"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Claim } from "@/lib/types";
import { CLAIM_TYPE_COLORS, SEVERITY_COLORS } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  접수됨: "bg-blue-100 text-blue-800",
  처리중: "bg-yellow-100 text-yellow-800",
  완료: "bg-green-100 text-green-800",
};

export function ClaimCard({ claim }: { claim: Claim }) {
  return (
    <Link href={`/claims/${claim.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-4 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex gap-2 flex-wrap">
              {claim.claimType && (
                <Badge className={CLAIM_TYPE_COLORS[claim.claimType] ?? "bg-gray-100 text-gray-800"}>
                  {claim.claimType}
                </Badge>
              )}
              {claim.severity && (
                <Badge className={SEVERITY_COLORS[claim.severity] ?? "bg-gray-100 text-gray-800"}>
                  {claim.severity}
                </Badge>
              )}
              {claim.isRepeated && (
                <Badge className="bg-amber-100 text-amber-800">반복</Badge>
              )}
            </div>
            <Badge className={STATUS_COLORS[claim.status] ?? "bg-gray-100 text-gray-800"}>
              {claim.status}
            </Badge>
          </div>

          <p className="text-sm text-gray-700 line-clamp-2">{claim.rawText}</p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{claim.supplierName ?? "업체 미상"} {claim.processName ? `· ${claim.processName}` : ""}</span>
            <span>{new Date(claim.createdAt).toLocaleDateString("ko-KR")}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
