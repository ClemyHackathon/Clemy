package com.clemy.claim

import jakarta.persistence.*
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.Instant
import java.util.UUID

@Entity
@Table(name = "claims")
class ClaimEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "created_at")
    val createdAt: Instant = Instant.now(),

    @Column(name = "raw_text", nullable = false)
    val rawText: String,

    @Column(name = "occurred_at")
    val occurredAt: Instant? = null,

    @Column(name = "process_name")
    val processName: String? = null,

    @Column(name = "supplier_id")
    val supplierId: UUID? = null,

    @Column(name = "claim_type")
    var claimType: String? = null,

    @Column(name = "severity")
    var severity: String? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "root_cause_candidates", columnDefinition = "jsonb")
    var rootCauseCandidates: String? = null,

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "recommendations", columnDefinition = "jsonb")
    var recommendations: String? = null,

    @Column(name = "is_repeated")
    var isRepeated: Boolean = false,

    @Column(name = "ai_summary")
    var aiSummary: String? = null,

    @Column(name = "status")
    var status: String = "접수됨",

    @Column(name = "notes")
    var notes: String? = null
)

@Entity
@Table(name = "suppliers")
class SupplierEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "name", nullable = false)
    val name: String,

    @Column(name = "contact_email")
    val contactEmail: String? = null
)

@Repository
interface ClaimRepository : JpaRepository<ClaimEntity, UUID> {
    @Query(
        """SELECT c FROM ClaimEntity c WHERE
        (:claimType IS NULL OR c.claimType = :claimType) AND
        (:status IS NULL OR c.status = :status) AND
        (:supplierId IS NULL OR c.supplierId = :supplierId)
        ORDER BY c.createdAt DESC"""
    )
    fun findWithFilters(
        @Param("claimType") claimType: String?,
        @Param("status") status: String?,
        @Param("supplierId") supplierId: UUID?
    ): List<ClaimEntity>

    fun findTop10ByOrderByCreatedAtDesc(): List<ClaimEntity>
}

@Repository
interface SupplierRepository : JpaRepository<SupplierEntity, UUID> {
    fun findByName(name: String): SupplierEntity?
}
