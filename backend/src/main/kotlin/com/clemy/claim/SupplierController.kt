package com.clemy.claim

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

data class SupplierResponse(val id: UUID, val name: String)

@RestController
@RequestMapping("/api/suppliers")
class SupplierController(private val supplierRepository: SupplierRepository) {

    @GetMapping
    fun list(): List<SupplierResponse> =
        supplierRepository.findAll().map { SupplierResponse(it.id, it.name) }
}
