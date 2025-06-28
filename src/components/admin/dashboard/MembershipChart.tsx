import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface ChartItem {
  label: string;
  Business: number;
  Freelancer: number;
}

function getLast7Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function getCurrentMonthDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month, d).toISOString().split("T")[0];
    dates.push(day);
  }
  return dates;
}

export default function MembershipChart() {
  const [dailyData, setDailyData] = useState<ChartItem[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartItem[]>([]);
  const [total, setTotal] = useState<{ Business: number; Freelancer: number }>({ Business: 0, Freelancer: 0 });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        };

        const [resBusiness, resFreelancer] = await Promise.all([
          fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/membership/businesses", { headers }),
          fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/membership/influencers", { headers }),
        ]);

        const bizData = await resBusiness.json();
        const kocData = await resFreelancer.json();

        const counter: Record<string, { Business: number; Freelancer: number }> = {};
        let sumBusiness = 0;
        let sumFreelancer = 0;

        const addToDate = (items: any[], role: "Business" | "Freelancer") => {
          items.forEach((item) => {
            const date = new Date(item.startDate);
            const key = date.toISOString().split("T")[0];
            if (!counter[key]) {
              counter[key] = { Business: 0, Freelancer: 0 };
            }
            counter[key][role]++;
            if (role === "Business") sumBusiness += item.membershipType?.price || 0;
            if (role === "Freelancer") sumFreelancer += item.membershipType?.price || 0;
          });
        };

        addToDate(bizData?.data || [], "Business");
        addToDate(kocData?.data || [], "Freelancer");

        const last7 = getLast7Days();
        const thisMonth = getCurrentMonthDates();

        setDailyData(
          last7.map((date) => ({
            label: date,
            Business: counter[date]?.Business || 0,
            Freelancer: counter[date]?.Freelancer || 0,
          }))
        );

        setMonthlyData(
          thisMonth.map((date) => ({
            label: date.split("-")[2],
            Business: counter[date]?.Business || 0,
            Freelancer: counter[date]?.Freelancer || 0,
          }))
        );

        setTotal({ Business: sumBusiness, Freelancer: sumFreelancer });
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu membership:", err);
      }
    };

    fetchMemberships();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-6">Biểu đồ Membership theo 7 ngày gần nhất</h2>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={dailyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", fontSize: "14px" }}>
                        {payload.map((entry, idx) => (
                          <p key={idx} style={{ margin: 0 }}>{`${entry.name} : ${entry.value}`}</p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Business" stroke="#34D399" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Freelancer" stroke="#60A5FA" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-center text-gray-700 font-semibold">
            Tổng thu: <span className="text-teal-600">Business {total.Business.toLocaleString()} đ</span> | <span className="text-blue-600">Freelancer {total.Freelancer.toLocaleString()} đ</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-6">Biểu đồ Membership theo tháng gần nhất</h2>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" label={{ value: "Ngày", position: "insideBottomRight", offset: -5 }} />
              <YAxis allowDecimals={false} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div style={{ backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px", padding: "8px 12px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", fontSize: "14px" }}>
                        {payload.map((entry, idx) => (
                          <p key={idx} style={{ margin: 0 }}>{`${entry.name} : ${entry.value}`}</p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar dataKey="Business" fill="#34D399" />
              <Bar dataKey="Freelancer" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-center text-gray-700 font-semibold">
            Tổng thu: <span className="text-teal-600">Business {total.Business.toLocaleString()} đ</span> | <span className="text-blue-600">Freelancer {total.Freelancer.toLocaleString()} đ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
