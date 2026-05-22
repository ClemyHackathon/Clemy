import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getDashboard, getClaims } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClaimCard } from "@/components/claims/ClaimCard";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ClaimTypeChart } from "@/components/dashboard/ClaimTypeChart";
import type { Claim, RootCauseCandidate } from "@/lib/types";

function getTopRootCauses(claims: Claim[]) {
  const causeMap = new Map<string, { count: number; confidence?: string }>();

  claims.forEach((claim) => {
    claim.rootCauseCandidates?.forEach((candidate: RootCauseCandidate) => {
      const current = causeMap.get(candidate.cause);
      causeMap.set(candidate.cause, {
        count: (current?.count ?? 0) + 1,
        confidence: current?.confidence ?? candidate.confidence,
      });
    });
  });

  return Array.from(causeMap.entries())
    .map(([cause, value]) => ({ cause, ...value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function getPriorityScore(claim: Claim) {
  const severityScore = claim.severity === "높음" ? 40 : claim.severity === "중간" ? 24 : 12;
  const statusScore = claim.status === "접수됨" ? 24 : claim.status === "처리중" ? 12 : 0;
  const repeatedScore = claim.isRepeated ? 20 : 0;

  return severityScore + statusScore + repeatedScore;
}

function getPriorityLabel(score: number) {
  if (score >= 70) return "긴급";
  if (score >= 45) return "높음";
  if (score >= 25) return "중간";
  return "낮음";
}

export default async function CsDashboardPage() {
  const [stats, claims] = await Promise.all([
    getDashboard().catch(() => null),
    getClaims().catch(() => []),
  ]);
  const recentClaims = claims.slice(0, 5);
  const rootCauses = getTopRootCauses(claims);
  const priorityClaims = claims
    .map((claim) => ({ claim, score: getPriorityScore(claim) }))
    .filter(({ claim }) => claim.status !== "완료")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f2f2f2] md:bg-white">
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50"
            aria-label="역할 선택으로 이동"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-cyan-600">Clemy</p>
            <h1 className="truncate text-lg font-bold text-gray-950">산업현장 관리자 대시보드</h1>
          </div>
          <Link href="/claims">
            <Button className="h-9 rounded-md bg-gray-950 px-3 text-sm font-semibold text-white hover:bg-gray-800">
              게시판
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        <div>
          <p className="text-xs font-semibold text-cyan-600">ADMIN DASHBOARD</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">클레임 현황</h2>
        </div>

        {stats && <StatsCards stats={stats} />}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {stats && (
            <Card className="rounded-md border border-gray-200 bg-white ring-0">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-950">클레임 유형 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <ClaimTypeChart data={stats.byType} />
              </CardContent>
            </Card>
          )}

          <Card className="rounded-md border border-gray-200 bg-white ring-0">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-950">원인 후보 분석</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rootCauses.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">분석된 원인 후보가 없습니다.</p>
              ) : (
                rootCauses.map((item, index) => (
                  <div key={item.cause} className="rounded-md border border-gray-200 bg-white px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-gray-800">
                        {index + 1}. {item.cause}
                      </p>
                      <span className="shrink-0 text-xs font-semibold text-cyan-600">
                        {item.count}건
                      </span>
                    </div>
                    {item.confidence && (
                      <p className="mt-1 text-xs text-gray-500">AI 신뢰도: {item.confidence}</p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="rounded-md border border-gray-200 bg-white ring-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-gray-950">대응 우선순위 지정</CardTitle>
              <Link href="/claims" className="text-xs font-semibold text-cyan-600 hover:underline">
                전체 보기
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityClaims.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">대응 대기 클레임이 없습니다.</p>
              ) : (
                priorityClaims.map(({ claim, score }, index) => (
                  <Link
                    key={claim.id}
                    href={`/claims/${claim.id}`}
                    className="block rounded-md border border-gray-200 bg-white px-3 py-3 transition hover:border-cyan-200 hover:bg-cyan-50/30"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-gray-500">#{index + 1}</span>
                      <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">
                        {getPriorityLabel(score)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-gray-700">{claim.rawText}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {claim.claimType ?? "기타"} · {claim.severity ?? "심각도 미상"} · {claim.status}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-md border border-gray-200 bg-white ring-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-gray-950">최근 접수 클레임</CardTitle>
            <Link href="/claims" className="text-xs font-semibold text-cyan-600 hover:underline">
              게시판으로 이동
            </Link>
          </CardHeader>
          <CardContent>
            {recentClaims.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">클레임이 없습니다.</p>
            ) : (
              <div className="divide-y divide-gray-100 border-y border-gray-100">
                {recentClaims.map((claim) => (
                  <ClaimCard key={claim.id} claim={claim} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
