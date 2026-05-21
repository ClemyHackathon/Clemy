package com.clemy.claim

import com.fasterxml.jackson.annotation.JsonProperty
import java.time.Instant
import java.util.UUID

data class CreateClaimRequest(
    val rawText: String,
    val processName: String? = null,
    val supplierId: UUID? = null,
    val occurredAt: Instant? = null
)

data class UpdateClaimStatusRequest(
    val status: String,
    val notes: String? = null
)

data class RootCauseCandidate(
    val rank: Int,
    val cause: String,
    val confidence: String? = null
)

data class Recommendation(
    val action: String,
    val priority: Int
)

data class ClaimAnalysisResult(
    @JsonProperty("claim_type") val claimType: String,
    val severity: String,
    @JsonProperty("root_cause_candidates") val rootCauseCandidates: List<RootCauseCandidate>,
    val recommendations: List<Recommendation>,
    @JsonProperty("is_repeated") val isRepeated: Boolean,
    @JsonProperty("ai_summary") val aiSummary: String
)

data class ClaimResponse(
    val id: UUID,
    val createdAt: Instant,
    val rawText: String,
    val occurredAt: Instant?,
    val processName: String?,
    val supplierId: UUID?,
    val supplierName: String?,
    val claimType: String?,
    val severity: String?,
    val rootCauseCandidates: Any?,
    val recommendations: Any?,
    val isRepeated: Boolean,
    val aiSummary: String?,
    val status: String,
    val notes: String?
)
