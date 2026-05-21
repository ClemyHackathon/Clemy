package com.clemy.claim

import com.clemy.ai.GeminiService
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class ClaimService(
    private val claimRepository: ClaimRepository,
    private val supplierRepository: SupplierRepository,
    private val geminiService: GeminiService
) {
    private val mapper = jacksonObjectMapper()

    @Transactional
    fun createClaim(request: CreateClaimRequest): ClaimResponse {
        val supplier = request.supplierId?.let { supplierRepository.findById(it).orElse(null) }

        val recentClaims = claimRepository.findTop10ByOrderByCreatedAtDesc()
            .map { it.rawText }

        val analysis = geminiService.analyzeClaim(
            rawText = request.rawText,
            processName = request.processName,
            supplierName = supplier?.name,
            recentClaims = recentClaims
        )

        val entity = ClaimEntity(
            rawText = request.rawText,
            processName = request.processName,
            supplierId = request.supplierId,
            occurredAt = request.occurredAt,
            claimType = analysis.claimType,
            severity = analysis.severity,
            rootCauseCandidates = mapper.writeValueAsString(analysis.rootCauseCandidates),
            recommendations = mapper.writeValueAsString(analysis.recommendations),
            isRepeated = analysis.isRepeated,
            aiSummary = analysis.aiSummary
        )

        val saved = claimRepository.save(entity)
        return toResponse(saved, supplier?.name)
    }

    fun getClaims(claimType: String?, status: String?, supplierId: UUID?): List<ClaimResponse> {
        return claimRepository.findWithFilters(claimType, status, supplierId)
            .map { entity ->
                val supplierName = entity.supplierId?.let {
                    supplierRepository.findById(it).orElse(null)?.name
                }
                toResponse(entity, supplierName)
            }
    }

    fun getClaim(id: UUID): ClaimResponse {
        val entity = claimRepository.findById(id).orElseThrow { NoSuchElementException("Claim not found: $id") }
        val supplierName = entity.supplierId?.let {
            supplierRepository.findById(it).orElse(null)?.name
        }
        return toResponse(entity, supplierName)
    }

    @Transactional
    fun updateStatus(id: UUID, request: UpdateClaimStatusRequest): ClaimResponse {
        val entity = claimRepository.findById(id).orElseThrow { NoSuchElementException("Claim not found: $id") }
        entity.status = request.status
        if (request.notes != null) entity.notes = request.notes
        val saved = claimRepository.save(entity)
        val supplierName = entity.supplierId?.let {
            supplierRepository.findById(it).orElse(null)?.name
        }
        return toResponse(saved, supplierName)
    }

    private fun toResponse(entity: ClaimEntity, supplierName: String?): ClaimResponse {
        return ClaimResponse(
            id = entity.id,
            createdAt = entity.createdAt,
            rawText = entity.rawText,
            occurredAt = entity.occurredAt,
            processName = entity.processName,
            supplierId = entity.supplierId,
            supplierName = supplierName,
            claimType = entity.claimType,
            severity = entity.severity,
            rootCauseCandidates = entity.rootCauseCandidates?.let { mapper.readValue(it, Any::class.java) },
            recommendations = entity.recommendations?.let { mapper.readValue(it, Any::class.java) },
            isRepeated = entity.isRepeated,
            aiSummary = entity.aiSummary,
            status = entity.status,
            notes = entity.notes
        )
    }
}
