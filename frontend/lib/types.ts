export interface RootCauseCandidate {
  rank: number;
  cause: string;
  confidence?: string;
}

export interface Recommendation {
  action: string;
  priority: number;
}

export interface Claim {
  id: string;
  createdAt: string;
  rawText: string;
  occurredAt?: string;
  processName?: string;
  supplierId?: string;
  supplierName?: string;
  claimType?: string;
  severity?: string;
  rootCauseCandidates?: RootCauseCandidate[];
  recommendations?: Recommendation[];
  isRepeated: boolean;
  aiSummary?: string;
  status: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  repeated: number;
  byType: Record<string, number>;
  bySupplier: Record<string, number>;
  bySeverity: Record<string, number>;
}

export const CLAIM_TYPE_COLORS: Record<string, string> = {
  소음: "bg-blue-100 text-blue-800",
  냄새: "bg-green-100 text-green-800",
  진동: "bg-orange-100 text-orange-800",
  품질불량: "bg-red-100 text-red-800",
  납품지연: "bg-purple-100 text-purple-800",
  기타: "bg-gray-100 text-gray-800",
};

export const SEVERITY_COLORS: Record<string, string> = {
  낮음: "bg-green-100 text-green-800",
  중간: "bg-yellow-100 text-yellow-800",
  높음: "bg-red-100 text-red-800",
};

export const STATUS_LABELS = ["접수됨", "처리중", "완료"];
