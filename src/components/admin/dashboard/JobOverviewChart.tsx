import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { TooltipProps } from "recharts";

interface JobOverviewChartProps {
  data: { name: string; value: number }[];
}

const CustomTooltip = (props: TooltipProps<any, any>) => {
  const { active, payload, label } = props as any;

  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          fontSize: "14px",
        }}
      >
        <p style={{ margin: 0 }}>{label}</p>
        <p style={{ color: "#3B82F6", margin: 0 }}>
          value : {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

export default function JobOverviewChart({ data }: JobOverviewChartProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Tổng quan công việc</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => {
              const colorMap: Record<string, string> = {
                "Đang thực hiện": "#FBBF24", // vàng
                "Đã hoàn thành": "#10B981", // xanh lá
                "Đã hủy": "#14B8A6", // teal
                "Hết hạn": "#EF4444", // đỏ
              };
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={colorMap[entry.name] || "#8884d8"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
