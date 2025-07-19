import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StatsCards from "./dashboard/StatsCards";
import JobOverviewChart from "./dashboard/JobOverviewChart";
import UserStatusPie from "./dashboard/UserStatusPie";
import MembershipChart from "./dashboard/MembershipChart";

interface Stats {
  totalInflu: number;
  totalBusiness: number;
  totalJobs: number;
  totalMemberships: number;
  activeAccounts: number;
  blockedAccounts: number;
  jobStats: {
    doing: number;
    done: number;
    canceled: number;
    expired: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalInflu: 0,
    totalBusiness: 0,
    totalJobs: 0,
    totalMemberships: 0,
    activeAccounts: 0,
    blockedAccounts: 0,
    jobStats: {
      doing: 0,
      done: 0,
      canceled: 0,
      expired: 0,
    },
  });

  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    const safeJson = async (res: Response) => {
      try {
        return await res.json();
      } catch {
        return {};
      }
    };

    const checkTokenExpired = (res: Response) => {
      if (res.status === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.clear();
        window.location.href = "/login";
        return true;
      }
      return false;
    };

    const fetchStats = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Vui lòng đăng nhập lại");
        window.location.href = "/login";
        return;
      }

      const headers = { Authorization: `Bearer ${accessToken}` };

      try {
        const [influRes, businessRes, jobsRes] = await Promise.all([
          fetch(
            "https://localhost:7035/api/influ/all",
            { headers }
          ),
          fetch(
            "https://localhost:7035/api/business/all",
            { headers }
          ),
          fetch(
            "https://localhost:7035/api/jobs/get-all",
            { headers }
          ),
        ]);

        if ([influRes, businessRes, jobsRes].some(checkTokenExpired)) return;

        const influ = await safeJson(influRes);
        const business = await safeJson(businessRes);
        const jobs = await safeJson(jobsRes);

        let membershipsData: any[] = [];
        let usersData: any[] = [];

        try {
          const membershipRes = await fetch(
            "https://localhost:7035/api/membership/all",
            { headers }
          );
          if (checkTokenExpired(membershipRes)) return;
          if (membershipRes.ok) {
            const json = await membershipRes.json();
            membershipsData = Array.isArray(json?.data) ? json.data : [];
          } else {
            setUnauthorized(true);
          }
        } catch {
          setUnauthorized(true);
        }

        try {
          const userRes = await fetch(
            "https://localhost:7035/api/user/all",
            {
              headers,
            }
          );
          if (checkTokenExpired(userRes)) return;
          if (userRes.ok) {
            const json = await userRes.json();
            usersData = Array.isArray(json?.data) ? json.data : [];
          } else {
            setUnauthorized(true);
          }
        } catch {
          setUnauthorized(true);
        }

        const influData = Array.isArray(influ?.data) ? influ.data : [];
        const businessData = Array.isArray(business?.data) ? business.data : [];
        const jobsData = Array.isArray(jobs?.data) ? jobs.data : [];

        const activeAccounts = usersData.filter(
          (u: any) => u.isBlocked === false
        ).length;
        const blockedAccounts = usersData.filter(
          (u: any) => u.isBlocked === true
        ).length;

        const jobStats = { doing: 0, done: 0, canceled: 0, expired: 0 };
        jobsData.forEach((job: any) => {
          switch (job.status) {
            case 1:
              jobStats.doing++;
              break;
            case 2:
              jobStats.done++;
              break;
            case 3:
              jobStats.canceled++;
              break;
            case 4:
              jobStats.expired++;
              break;
          }
        });

        setStats({
          totalInflu: influData.length,
          totalBusiness: businessData.length,
          totalJobs: jobsData.length,
          totalMemberships: membershipsData.length,
          activeAccounts,
          blockedAccounts,
          jobStats,
        });
      } catch (err) {
        console.error("Lỗi lấy dữ liệu Dashboard:", err);
        toast.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    };

    fetchStats();
  }, []);

  const statusData = [
    { name: "Đang thực hiện", value: stats.jobStats.doing },
    { name: "Đã hoàn thành", value: stats.jobStats.done },
    { name: "Đã hủy", value: stats.jobStats.canceled },
    { name: "Hết hạn", value: stats.jobStats.expired },
  ];

  const userPie = [
    { name: "Hoạt động", value: stats.activeAccounts },
    { name: "Bị chặn", value: stats.blockedAccounts },
  ];

  return (
    <div className="space-y-6 p-4">
      <StatsCards
        totalInflu={stats.totalInflu}
        totalBusiness={stats.totalBusiness}
        totalJobs={stats.totalJobs}
        totalMemberships={stats.totalMemberships}
      />
      <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
        <div className="md:col-span-7">
          <JobOverviewChart data={statusData} />
        </div>
        <div className="md:col-span-3">
          <UserStatusPie data={userPie} unauthorized={unauthorized} />
        </div>
      </div>

      <MembershipChart />
    </div>
  );
}
