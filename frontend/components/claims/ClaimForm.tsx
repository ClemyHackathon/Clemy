"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitClaim, getSuppliers } from "@/lib/api";
import type { Supplier } from "@/lib/types";
import { useEffect } from "react";

export function ClaimForm() {
  const router = useRouter();
  const [rawText, setRawText] = useState("");
  const [processName, setProcessName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [occurredAt, setOccurredAt] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getSuppliers().then(setSuppliers).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rawText.trim()) return;

    setLoading(true);
    setError("");
    try {
      const claim = await submitClaim({
        rawText,
        processName: processName || undefined,
        supplierId: supplierId || undefined,
        occurredAt: occurredAt ? new Date(occurredAt).toISOString() : undefined,
      });
      router.push(`/claims/${claim.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>클레임 접수</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">클레임 내용 *</label>
            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="현장에서 발생한 문제를 자세히 입력해 주세요."
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">공정명</label>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="예: 3공정"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">납품업체</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">선택 안 함</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">발생 일시</label>
            <input
              type="datetime-local"
              value={occurredAt}
              onChange={(e) => setOccurredAt(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !rawText.trim()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
          >
            {loading ? "AI 분석 중..." : "접수 및 AI 분석"}
          </Button>

          {loading && (
            <p className="text-xs text-center text-gray-500 animate-pulse">
              Gemini가 클레임을 분석하고 있습니다. 잠시만 기다려 주세요.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
