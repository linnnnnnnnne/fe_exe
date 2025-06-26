import { FaUsers, FaBuilding, FaBriefcase, FaIdCard } from "react-icons/fa";

interface StatsCardsProps {
  totalInflu: number;
  totalBusiness: number;
  totalJobs: number;
  totalMemberships: number;
}

export default function StatsCards({
  totalInflu,
  totalBusiness,
  totalJobs,
  totalMemberships,
}: StatsCardsProps) {
  const items = [
    {
      label: "Tổng Influencer",
      value: totalInflu,
      icon: <FaUsers className="text-3xl text-pink-500" />,
    },
    {
      label: "Tổng Doanh nghiệp",
      value: totalBusiness,
      icon: <FaBuilding className="text-3xl text-blue-500" />,
    },
    {
      label: "Tổng Công việc",
      value: totalJobs,
      icon: <FaBriefcase className="text-3xl text-amber-500" />,
    },
    {
      label: "Tổng Membership",
      value: totalMemberships,
      icon: <FaIdCard className="text-3xl text-green-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl text-center shadow space-y-2"
        >
          <div>{item.icon}</div>
          <p className="text-2xl font-bold text-teal-600">{item.value}</p>
          <p className="text-sm font-medium">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
