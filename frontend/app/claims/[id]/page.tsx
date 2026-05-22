import Link from "next/link";
import { notFound } from "next/navigation";
import { getClaim } from "@/lib/api";
import { AIAnalysisResult } from "@/components/claims/AIAnalysisResult";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATUS_COLORS: Record<string, string> = {
  접수됨: "bg-blue-100 text-blue-800",
  처리중: "bg-yellow-100 text-yellow-800",
  완료: "bg-green-100 text-green-800",
};

export default async function ClaimDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let claim;
  try {
    claim = await getClaim(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <Link href="/claims" className="text-sm text-gray-500 hover:text-gray-800">
          ← 클레임 목록
        </Link>
        <span className="text-yellow-500 font-bold text-lg">Clemy</span>
        <span className="text-sm text-gray-500">AI 원인 분석 및 해야 할 일</span>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>클레임 상세</span>
              <Badge className={STATUS_COLORS[claim.status] ?? "bg-gray-100 text-gray-800"}>
                {claim.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-gray-700 whitespace-pre-wrap">{claim.rawText}</p>
            <div className="grid grid-cols-2 gap-2 text-gray-500 text-xs">
              {claim.processName && <span>공정: {claim.processName}</span>}
              {claim.supplierName && <span>업체: {claim.supplierName}</span>}
              {claim.occurredAt && (
                <span>발생: {new Date(claim.occurredAt).toLocaleString("ko-KR")}</span>
              )}
              <span>접수: {new Date(claim.createdAt).toLocaleString("ko-KR")}</span>
            </div>
          </CardContent>
        </Card>

        <AIAnalysisResult claim={claim} />
      </main>
    </div>
  );
}
