package com.clemy.dashboard

import com.clemy.claim.ClaimRepository
import com.clemy.claim.SupplierRepository
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class DashboardStats(
    val total: Long,
    val pending: Long,
    val inProgress: Long,
    val completed: Long,
    val repeated: Long,
    val byType: Map<String, Long>,
    val bySupplier: Map<String, Long>,
    val bySeverity: Map<String, Long>
)

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val claimRepository: ClaimRepository,
    private val supplierRepository: SupplierRepository
) {

    @GetMapping
    fun stats(): DashboardStats {
        val all = claimRepository.findAll()
        val suppliers = supplierRepository.findAll().associateBy({ it.id }, { it.name })

        val byType = all.groupingBy { it.claimType ?: "기타" }.eachCount()
            .mapValues { it.value.toLong() }

        val bySupplier = all
            .filter { it.supplierId != null }
            .groupingBy { suppliers[it.supplierId] ?: "미상" }
            .eachCount()
            .mapValues { it.value.toLong() }

        val bySeverity = all.groupingBy { it.severity ?: "미상" }.eachCount()
            .mapValues { it.value.toLong() }

        return DashboardStats(
            total = all.size.toLong(),
            pending = all.count { it.status == "접수됨" }.toLong(),
            inProgress = all.count { it.status == "처리중" }.toLong(),
            completed = all.count { it.status == "완료" }.toLong(),
            repeated = all.count { it.isRepeated }.toLong(),
            byType = byType,
            bySupplier = bySupplier,
            bySeverity = bySeverity
        )
    }
}
