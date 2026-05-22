import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "전체 클레임", value: stats.total, color: "text-gray-950" },
    { label: "접수됨", value: stats.pending, color: "text-cyan-600" },
    { label: "처리중", value: stats.inProgress, color: "text-slate-700" },
    { label: "완료", value: stats.completed, color: "text-emerald-600" },
    { label: "반복 패턴", value: stats.repeated, color: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="rounded-md border border-gray-200 bg-white ring-0">
          <CardContent className="py-5 text-center">
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="mt-1 text-xs font-medium text-gray-500">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
