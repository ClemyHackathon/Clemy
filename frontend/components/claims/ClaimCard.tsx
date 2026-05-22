"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Bookmark,
  Clock,
  PackageCheck,
  Sparkles,
  Volume2,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import type { Claim } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  접수됨: "bg-blue-50 text-blue-700",
  처리중: "bg-amber-50 text-amber-700",
  완료: "bg-emerald-50 text-emerald-700",
};

const TYPE_STYLES: Record<string, { className: string; icon: typeof AlertTriangle }> = {
  소음: { className: "bg-sky-50 text-sky-600", icon: Volume2 },
  냄새: { className: "bg-emerald-50 text-emerald-600", icon: Wind },
  진동: { className: "bg-orange-50 text-orange-600", icon: Zap },
  품질불량: { className: "bg-rose-50 text-rose-600", icon: PackageCheck },
  납품지연: { className: "bg-violet-50 text-violet-600", icon: Clock },
  기타: { className: "bg-gray-100 text-gray-600", icon: Wrench },
};

export function ClaimCard({ claim }: { claim: Claim }) {
  const type = claim.claimType ?? "기타";
  const typeStyle = TYPE_STYLES[type] ?? TYPE_STYLES.기타;
  const TypeIcon = typeStyle.icon;

  return (
    <Link
      href={`/claims/${claim.id}`}
      className="grid grid-cols-[96px_1fr_24px] gap-3 py-4 transition hover:bg-gray-50 sm:grid-cols-[120px_1fr_28px]"
    >
      <div
        className={`flex h-24 items-center justify-center rounded-md ${typeStyle.className}`}
        aria-hidden="true"
      >
        <TypeIcon className="h-9 w-9" />
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-1.5">
          <span className="rounded-sm bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            AI
          </span>
          <span className="rounded-sm bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
            {type}
          </span>
          <span
            className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
              STATUS_STYLES[claim.status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {claim.status}
          </span>
          {claim.isRepeated && (
            <span className="inline-flex items-center gap-1 rounded-sm bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              반복
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-[15px] font-semibold leading-5 text-gray-950">
          {claim.rawText}
        </p>

        <p className="mt-2 truncate text-xs text-gray-500">
          {claim.supplierName ?? "업체 미상"}
          {claim.processName ? ` · ${claim.processName}` : ""}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          접수 {new Date(claim.createdAt).toLocaleDateString("ko-KR")}
          {claim.severity ? ` · 심각도 ${claim.severity}` : ""}
        </p>
      </div>

      <div className="flex justify-end pt-7 text-gray-400">
        <Bookmark className="h-6 w-6" aria-hidden="true" />
      </div>
    </Link>
  );
}
