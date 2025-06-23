import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

interface InfluencerApply {
  id: string;
  freelanceId: string;
  influName: string;
  influAvatar: string;
  influFollower: number;
  hasMembership: boolean;
  startTime: string;
  status: number;
  jobId: string;
  jobTitle: string;
}

interface NotificationBellBProps {
  userId: string;
  accessToken: string;
  businessId: string;
}

export default function NotificationBellB({
  accessToken,
  businessId,
}: NotificationBellBProps) {
  const [applies, setApplies] = useState<InfluencerApply[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const jobRes = await fetch(
          `https://localhost:7035/api/jobs/get-job/by-business-id/${businessId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!jobRes.ok) return;
        const jobData = await jobRes.json();
        const jobList = jobData?.data || [];

        const allApplies: InfluencerApply[] = [];

        for (const job of jobList) {
          const res = await fetch(
            `https://localhost:7035/api/freelance-jobs/${job.id}/list-influencers-apply-job`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!res.ok) continue;

          const data = await res.json();
          const applyList = data?.data?.map((item: any) => ({
            ...item,
            jobId: job.id,
            jobTitle: job.title || "Không rõ tên công việc",
          }));

          allApplies.push(...applyList);
        }

        setApplies(allApplies.filter((a) => a.status === 0));
      } catch (error) {
        console.error("Lỗi khi lấy thông báo:", error);
      }
    };

    if (businessId && accessToken) {
      fetchNotifications();
    }
  }, [businessId, accessToken]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRespond = async (freelanceJobId: string, status: number) => {
    if (status !== 1) {
      alert("Chức năng từ chối chưa được hỗ trợ.");
      return;
    }

    try {
      const res = await fetch(
        `https://localhost:7035/api/freelance-jobs/approve-influencer-job`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ freelanceJobId }),
        }
      );

      if (res.ok) {
        setApplies((prev) => prev.filter((item) => item.id !== freelanceJobId));
      } else {
        alert("Không thể cập nhật trạng thái.");
      }
    } catch (error) {
      console.error("Lỗi khi xác nhận ứng viên:", error);
    }
  };

  return (
    <div className="relative font-montserrat" ref={dropdownRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 flex items-center justify-center cursor-pointer relative"
      >
        <Bell className="text-white w-6 h-6" />
        {applies.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {applies.length}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-11 w-96 max-h-[420px] overflow-y-auto scrollbar-hide bg-white shadow-[0_8px_24px_rgba(0,0,0,0.20)] rounded-xl z-50 font-montserrat">
          <div className="p-4 pb-0 text-lg font-semibold text-gray-800 border-b bg-white rounded-t-xl">
            Thông báo
          </div>
          {applies.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              Không có yêu cầu mới.
            </div>
          ) : (
            <div className="p-3">
              {applies.map((influencer) => (
                <div
                  key={influencer.id}
                  className="bg-white rounded-lg shadow-sm p-4 mb-2 transition hover:bg-lightgray cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={influencer.influAvatar}
                      alt={influencer.influName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm text-gray-800">
                        <span className="font-semibold">
                          {influencer.influName}
                        </span>{" "}
                        đã ứng tuyển vào{" "}
                        <span className="text-teal-600 font-medium">
                          "{influencer.jobTitle}"
                        </span>
                      </div>

                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRespond(influencer.id, 1);
                          }}
                          className="px-5 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Chấp nhận
                        </button>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
