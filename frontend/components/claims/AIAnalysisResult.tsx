"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Claim } from "@/lib/types";
import { CLAIM_TYPE_COLORS, SEVERITY_COLORS } from "@/lib/types";

export function AIAnalysisResult({ claim }: { claim: Claim }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            AI 분석 결과
            {claim.isRepeated && (
              <Badge className="bg-amber-100 text-amber-800">반복 패턴</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {claim.claimType && (
              <Badge className={CLAIM_TYPE_COLORS[claim.claimType] ?? "bg-gray-100 text-gray-800"}>
                {claim.claimType}
              </Badge>
            )}
            {claim.severity && (
              <Badge className={SEVERITY_COLORS[claim.severity] ?? "bg-gray-100 text-gray-800"}>
                심각도: {claim.severity}
              </Badge>
            )}
          </div>

          {claim.aiSummary && (
            <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded p-3">
              {claim.aiSummary}
            </p>
          )}
        </CardContent>
      </Card>

      {claim.rootCauseCandidates && claim.rootCauseCandidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">원인 후보</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {claim.rootCauseCandidates.map((c) => (
                <li key={c.rank} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400 text-white text-xs flex items-center justify-center font-bold">
                    {c.rank}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{c.cause}</p>
                    {c.confidence && (
                      <p className="text-xs text-gray-500">신뢰도: {c.confidence}</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {claim.recommendations && claim.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">대응 방안</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {claim.recommendations.map((r) => (
                <li key={r.priority} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-xs flex items-center justify-center font-bold">
                    {r.priority}
                  </span>
                  <p className="text-sm">{r.action}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
