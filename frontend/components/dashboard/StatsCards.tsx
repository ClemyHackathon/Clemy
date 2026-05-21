import { Card, CardContent } from "@/components/ui/card";
import type { DashboardStats } from "@/lib/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "전체 클레임", value: stats.total, color: "text-gray-800" },
    { label: "접수됨", value: stats.pending, color: "text-blue-600" },
    { label: "처리중", value: stats.inProgress, color: "text-yellow-600" },
    { label: "완료", value: stats.completed, color: "text-green-600" },
    { label: "반복 패턴", value: stats.repeated, color: "text-amber-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-4 pb-4 text-center">
            <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
