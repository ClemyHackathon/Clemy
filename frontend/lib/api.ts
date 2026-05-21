import type { Claim, DashboardStats, Supplier } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function submitClaim(data: {
  rawText: string;
  processName?: string;
  supplierId?: string;
  occurredAt?: string;
}): Promise<Claim> {
  const res = await fetch(`${API}/api/claims`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `접수 실패 (HTTP ${res.status})`);
  }
  return res.json();
}

export async function getClaims(params?: {
  claimType?: string;
  status?: string;
  supplierId?: string;
}): Promise<Claim[]> {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params ?? {}).filter(([, v]) => v)
    ) as Record<string, string>
  );
  const res = await fetch(`${API}/api/claims?${query}`);
  if (!res.ok) throw new Error("클레임 목록을 불러오지 못했습니다.");
  return res.json();
}

export async function getClaim(id: string): Promise<Claim> {
  const res = await fetch(`${API}/api/claims/${id}`);
  if (!res.ok) throw new Error("클레임을 찾을 수 없습니다.");
  return res.json();
}

export async function updateClaimStatus(
  id: string,
  status: string,
  notes?: string
): Promise<Claim> {
  const res = await fetch(`${API}/api/claims/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
  if (!res.ok) throw new Error("상태 변경에 실패했습니다.");
  return res.json();
}

export async function getDashboard(): Promise<DashboardStats> {
  const res = await fetch(`${API}/api/dashboard`);
  if (!res.ok) throw new Error("대시보드 데이터를 불러오지 못했습니다.");
  return res.json();
}

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${API}/api/suppliers`);
  if (!res.ok) return [];
  return res.json();
}
