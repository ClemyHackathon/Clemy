import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getClaims } from "@/lib/api";
import { ClaimCard } from "@/components/claims/ClaimCard";
import { ClaimSearchForm } from "@/components/claims/ClaimSearchForm";
import { ClaimStatusFilter } from "@/components/claims/ClaimStatusFilter";
import { Button } from "@/components/ui/button";
import type { Claim } from "@/lib/types";

function buildClaimTypeHref(claimType: string | undefined, status?: string, searchQuery?: string) {
  const params = new URLSearchParams();

  if (claimType) params.set("claimType", claimType);
  if (status) params.set("status", status);
  if (searchQuery) params.set("q", searchQuery);

  const nextQuery = params.toString();
  return nextQuery ? `/claims?${nextQuery}` : "/claims";
}

function searchClaims(claims: Claim[], query?: string) {
  const normalizedQuery = query?.trim().toLowerCase();

  if (!normalizedQuery) return claims;

  return claims.filter((claim) => {
    const searchableText = [
      claim.rawText,
      claim.aiSummary,
      claim.claimType,
      claim.severity,
      claim.status,
      claim.supplierName,
      claim.processName,
      claim.notes,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: { claimType?: string; status?: string; supplierId?: string; q?: string };
}) {
  const claims = await getClaims(searchParams).catch(() => []);

  const CLAIM_TYPES = ["소음", "냄새", "진동", "품질불량", "납품지연", "기타"];
  const selectedType = searchParams.claimType;
  const selectedStatus = searchParams.status;
  const query = searchParams.q;
  const visibleClaims = searchClaims(claims, query);

  return (
    <div className="min-h-screen bg-[#f2f2f2] md:bg-white">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50"
            aria-label="역할 선택으로 이동"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-cyan-600">Clemy</p>
            <h1 className="truncate text-lg font-bold text-gray-950">클레임 게시판</h1>
          </div>
          <Link href="/claims/new">
            <Button className="h-9 rounded-md bg-gray-950 px-3 text-sm font-semibold text-white hover:bg-gray-800">
              접수
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <ClaimSearchForm value={query} />

        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-cyan-600">REQUEST BOARD</p>
            <h2 className="mt-1 text-2xl font-bold text-gray-950">클레임 유형</h2>
          </div>
          <ClaimStatusFilter value={selectedStatus} />
        </div>

        <div className="-mx-4 mb-5 overflow-x-auto px-4">
          <div className="flex min-w-max gap-2">
            <Link href={buildClaimTypeHref(undefined, selectedStatus, query)}>
              <span
                className={`inline-flex h-8 items-center rounded-md px-3 text-sm font-semibold transition ${
                  !selectedType
                    ? "bg-cyan-50 text-cyan-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                전체
              </span>
            </Link>
            {CLAIM_TYPES.map((type) => (
              <Link key={type} href={buildClaimTypeHref(type, selectedStatus, query)}>
                <span
                  className={`inline-flex h-8 items-center rounded-md px-3 text-sm font-semibold transition ${
                    selectedType === type
                      ? "bg-cyan-50 text-cyan-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {visibleClaims.length === 0 ? (
          <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <p className="text-sm font-medium text-gray-500">
              {query ? "검색 결과가 없습니다." : "클레임이 없습니다."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 border-y border-gray-100">
            {visibleClaims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
