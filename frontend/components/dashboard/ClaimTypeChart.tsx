"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const TYPE_COLORS: Record<string, string> = {
  소음: "#3B82F6",
  냄새: "#22C55E",
  진동: "#F97316",
  품질불량: "#EF4444",
  납품지연: "#A855F7",
  기타: "#9CA3AF",
};

export function ClaimTypeChart({ data }: { data: Record<string, number> }) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">데이터 없음</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={TYPE_COLORS[entry.name] ?? "#9CA3AF"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
