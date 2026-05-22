"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const STATUSES = ["접수됨", "처리중", "완료"];

export function ClaimStatusFilter({ value }: { value?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(nextStatus: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nextStatus === "전체") {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    const query = params.toString();
    router.push(query ? `/claims?${query}` : "/claims");
  }

  return (
    <label className="relative block">
      <span className="sr-only">처리 상태</span>
      <select
        value={value ?? "전체"}
        onChange={(event) => handleChange(event.target.value)}
        className="h-9 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-sm font-medium text-gray-700 shadow-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
      >
        <option value="전체">상태 전체</option>
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        aria-hidden="true"
      />
    </label>
  );
}
