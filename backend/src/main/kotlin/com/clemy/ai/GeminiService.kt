package com.clemy.ai

import com.clemy.claim.ClaimAnalysisResult
import com.clemy.claim.RootCauseCandidate
import com.clemy.claim.Recommendation
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException

@Service
class GeminiService(
    @Value("\${gemini.api-key}") private val apiKey: String,
    @Value("\${gemini.model}") private val model: String
) {
    private val log = LoggerFactory.getLogger(GeminiService::class.java)
    private val client = WebClient.builder()
        .baseUrl("https://generativelanguage.googleapis.com/v1beta")
        .build()
    private val mapper = jacksonObjectMapper()

    fun analyzeClaim(
        rawText: String,
        processName: String?,
        supplierName: String?,
        recentClaims: List<String> = emptyList()
    ): ClaimAnalysisResult {
        val contextPart = if (recentClaims.isNotEmpty())
            "\n최근 유사 클레임(참고):\n${recentClaims.joinToString("\n")}"
        else ""

        val prompt = """
            당신은 제조업 현장 클레임 분석 전문가입니다.
            아래 클레임을 분석하고 반드시 JSON만 응답하세요. 마크다운 불필요.

            클레임: $rawText
            공정명: ${processName ?: "미상"}
            납품업체: ${supplierName ?: "미상"}$contextPart

            {
              "claim_type": "소음|냄새|진동|품질불량|납품지연|기타",
              "severity": "낮음|중간|높음",
              "root_cause_candidates": [
                {"rank": 1, "cause": "...", "confidence": "높음|중간|낮음"},
                {"rank": 2, "cause": "...", "confidence": "높음|중간|낮음"},
                {"rank": 3, "cause": "...", "confidence": "높음|중간|낮음"}
              ],
              "recommendations": [
                {"action": "즉시: ...", "priority": 1},
                {"action": "단기: ...", "priority": 2},
                {"action": "장기: ...", "priority": 3}
              ],
              "is_repeated": false,
              "ai_summary": "한 문장 요약"
            }
        """.trimIndent()

        val body = mapOf(
            "contents" to listOf(mapOf("parts" to listOf(mapOf("text" to prompt)))),
            "generationConfig" to mapOf("responseMimeType" to "application/json")
        )

        return try {
            val text = callWithRetry(body)
            mapper.readValue(text)
        } catch (e: Exception) {
            log.warn("Gemini API 호출 실패 (${e.javaClass.simpleName}): ${e.message}. fallback 결과를 반환합니다.")
            fallbackResult(rawText)
        }
    }

    private fun callWithRetry(body: Map<String, Any>, maxRetries: Int = 2): String {
        var lastException: Exception? = null
        repeat(maxRetries) { attempt ->
            try {
                val response = client.post()
                    .uri("/models/$model:generateContent?key=$apiKey")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map::class.java)
                    .block()
                return extractText(response)
            } catch (e: WebClientResponseException.TooManyRequests) {
                lastException = e
                if (attempt < maxRetries - 1) {
                    log.warn("Gemini 429 — {}초 후 재시도 ({}/{})", 60, attempt + 1, maxRetries)
                    Thread.sleep(60_000L)
                }
            } catch (e: WebClientResponseException) {
                // 403, 404 등 재시도해도 소용없는 오류는 즉시 throw
                throw e
            }
        }
        throw lastException ?: IllegalStateException("Gemini 재시도 초과")
    }

    private fun fallbackResult(rawText: String) = ClaimAnalysisResult(
        claimType = "기타",
        severity = "중간",
        rootCauseCandidates = listOf(
            RootCauseCandidate(1, "AI 분석 일시 불가 — 수동 검토 필요", "낮음")
        ),
        recommendations = listOf(
            Recommendation("즉시: 담당자가 직접 현장 확인 후 원인 분류", 1)
        ),
        isRepeated = false,
        aiSummary = "AI 분석을 일시적으로 사용할 수 없습니다. 접수는 정상 처리됐습니다."
    )

    private fun extractText(response: Map<*, *>?): String {
        val candidates = response?.get("candidates") as? List<*>
        val content = (candidates?.firstOrNull() as? Map<*, *>)?.get("content") as? Map<*, *>
        val parts = content?.get("parts") as? List<*>
        return ((parts?.firstOrNull() as? Map<*, *>)?.get("text") as? String) ?: ""
    }
}
