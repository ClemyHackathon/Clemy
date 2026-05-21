package com.clemy.claim

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/claims")
class ClaimController(private val claimService: ClaimService) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun create(@RequestBody request: CreateClaimRequest): ClaimResponse =
        claimService.createClaim(request)

    @GetMapping
    fun list(
        @RequestParam claimType: String? = null,
        @RequestParam status: String? = null,
        @RequestParam supplierId: UUID? = null
    ): List<ClaimResponse> = claimService.getClaims(claimType, status, supplierId)

    @GetMapping("/{id}")
    fun get(@PathVariable id: UUID): ClaimResponse = claimService.getClaim(id)

    @PatchMapping("/{id}")
    fun updateStatus(
        @PathVariable id: UUID,
        @RequestBody request: UpdateClaimStatusRequest
    ): ClaimResponse = claimService.updateStatus(id, request)
}
