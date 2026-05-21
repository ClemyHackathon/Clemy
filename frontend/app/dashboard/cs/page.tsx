import Link from "next/link";
import { getDashboard, getClaims } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClaimCard } from "@/components/claims/ClaimCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ClaimTypeChart } from "@/components/dashboard/ClaimTypeChart";

export default async function CsDashboardPage() {
  const [stats, recentClaims] = await Promise.all([
    getDashboard().catch(() => null),
    getClaims().then((c) => c.slice(0, 5)).catch(() => []),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-yellow-500 font-bold text-xl">클레미</span>
          <span className="text-sm text-gray-500">CS 대시보드</span>
        </div>
        <Link href="/claims/new">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
            + 클레임 접수
          </Button>
        </Link>
      </header>

      <main className="p-6 space-y-6 max-w-5xl mx-auto">
        {stats && <StatsCards stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">유형별 클레임</CardTitle>
              </CardHeader>
              <CardContent>
                <ClaimTypeChart data={stats.byType} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">최근 클레임</CardTitle>
              <Link href="/claims" className="text-xs text-yellow-600 hover:underline">
                전체 보기
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentClaims.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">클레임이 없습니다.</p>
              ) : (
                recentClaims.map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
