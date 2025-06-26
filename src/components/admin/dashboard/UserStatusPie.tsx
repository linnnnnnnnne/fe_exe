import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#34D399", "#dc2626"];

interface UserStatusPieProps {
  data: { name: string; value: number }[];
  unauthorized: boolean;
}

export default function UserStatusPie({
  data,
  unauthorized,
}: UserStatusPieProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Tình trạng tài khoản</h2>
      {unauthorized ? (
        <p className="text-sm text-gray-500">
          Bạn không có quyền xem dữ liệu này.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              labelLine={false}
              label={({ percent }) =>
                percent !== undefined ? `${(percent * 100).toFixed(0)}%` : ""
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
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
                      <p
                        style={{ margin: 0 }}
                      >{`${payload[0].name} : ${payload[0].value}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="square"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
