import Link from "next/link";
import { getClaims } from "@/lib/api";
import { ClaimCard } from "@/components/claims/ClaimCard";
import { Button } from "@/components/ui/button";

export default async function ClaimsPage({
  searchParams,
}: {
  searchParams: { claimType?: string; status?: string; supplierId?: string };
}) {
  const claims = await getClaims(searchParams).catch(() => []);

  const CLAIM_TYPES = ["소음", "냄새", "진동", "품질불량", "납품지연", "기타"];
  const STATUSES = ["접수됨", "처리중", "완료"];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/cs" className="text-sm text-gray-500 hover:text-gray-800">
            ← 대시보드
          </Link>
          <span className="text-yellow-500 font-bold text-lg">클레미</span>
        </div>
        <Link href="/claims/new">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm">
            + 클레임 접수
          </Button>
        </Link>
      </header>

      <main className="p-6 max-w-3xl mx-auto space-y-4">
        <div className="flex flex-wrap gap-2">
          <Link href="/claims">
            <span className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-gray-50 cursor-pointer">
              전체
            </span>
          </Link>
          {CLAIM_TYPES.map((t) => (
            <Link key={t} href={`/claims?claimType=${t}`}>
              <span className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-gray-50 cursor-pointer">
                {t}
              </span>
            </Link>
          ))}
          {STATUSES.map((s) => (
            <Link key={s} href={`/claims?status=${s}`}>
              <span className="px-3 py-1 rounded-full text-xs border bg-white hover:bg-gray-50 cursor-pointer">
                {s}
              </span>
            </Link>
          ))}
        </div>

        {claims.length === 0 ? (
          <p className="text-center text-gray-400 py-16">클레임이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
