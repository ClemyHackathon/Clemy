import Link from "next/link";
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-yellow-500 font-bold text-xl">클레미</span>
          <span className="text-sm text-gray-500">산업현장 관리자 대시보드</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" className="text-sm">
              역할 선택
            </Button>
          </Link>
          <Link href="/claims">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
              클레임 게시판
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-5xl mx-auto">
        {stats && <StatsCards stats={stats} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">클레임 유형 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <ClaimTypeChart data={stats.byType} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">원인 후보 분석</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rootCauses.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">분석된 원인 후보가 없습니다.</p>
              ) : (
                rootCauses.map((item, index) => (
                  <div key={item.cause} className="rounded-md border bg-white px-3 py-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-gray-800">
                        {index + 1}. {item.cause}
                      </p>
                      <span className="shrink-0 text-xs font-semibold text-yellow-700">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">대응 우선순위 지정</CardTitle>
              <Link href="/claims" className="text-xs text-yellow-600 hover:underline">
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
                    className="block rounded-md border bg-white px-3 py-2 transition hover:border-yellow-300 hover:shadow-sm"
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">최근 접수 클레임</CardTitle>
            <Link href="/claims" className="text-xs text-yellow-600 hover:underline">
              게시판으로 이동
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
      </main>
    </div>
  );
}
