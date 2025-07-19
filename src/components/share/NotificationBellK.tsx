import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";

interface JobFromProgress {
  id: string;
  jobId: string;
  job: {
    title: string;
    businessId: string;
    startTime: string;
  };
  startTime: string;
  status: number;
}

interface InfluencerJobDisplay {
  id: string;
  jobTitle: string;
  businessName: string;
  startTime: string;
  status: "in-progress" | "cancelled";
}

export default function NotificationBellK() {
  const [jobsInProgress, setJobsInProgress] = useState<InfluencerJobDisplay[]>(
    []
  );
  const [jobsCancelled, setJobsCancelled] = useState<InfluencerJobDisplay[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const accessToken = localStorage.getItem("accessToken");
  const influId = localStorage.getItem("influId");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const endpoints = [
          {
            url: `https://localhost:7035/api/freelance-jobs/influencer/${influId}/jobs/in-progress`,
            status: "in-progress",
            setState: setJobsInProgress,
          },
          {
            url: `https://localhost:7035/api/freelance-jobs/influencer/${influId}/jobs/cancelled`,
            status: "cancelled",
            setState: setJobsCancelled,
          },
        ];

        for (const endpoint of endpoints) {
          const res = await fetch(endpoint.url, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (!res.ok) continue;

          const result = await res.json();
          const rawJobs: JobFromProgress[] = result?.data || [];

          const jobsWithCompany: InfluencerJobDisplay[] = await Promise.all(
            rawJobs.map(async (item) => {
              let businessName = "Không rõ";

              try {
                const businessRes = await fetch(
                  `https://localhost:7035/api/jobs/get-job/by-business-id/${item.job.businessId}`,
                  {
                    headers: { Authorization: `Bearer ${accessToken}` },
                  }
                );
                if (businessRes.ok) {
                  const businessData = await businessRes.json();
                  businessName =
                    businessData?.data?.[0]?.business?.name || "Không rõ";
                }
              } catch {}

              return {
                id: item.id,
                jobTitle: item.job.title,
                businessName,
                startTime: new Date(item.startTime).toLocaleDateString("vi-VN"),
                status: endpoint.status as "in-progress" | "cancelled",
              };
            })
          );

          endpoint.setState(jobsWithCompany);
        }
      } catch (error) {
        console.error("Lỗi khi lấy công việc:", error);
      }
    };

    if (influId && accessToken) fetchJobs();
  }, [influId, accessToken]);

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

  const totalJobs = jobsInProgress.length + jobsCancelled.length;

  return (
    <div className="relative font-montserrat" ref={dropdownRef}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-9 h-9 flex items-center justify-center cursor-pointer relative"
      >
        <Bell className="text-white w-6 h-6" />
        {totalJobs > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {totalJobs}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute right-0 top-11 w-96 max-h-[420px] overflow-y-auto scrollbar-hide bg-white shadow-[0_8px_24px_rgba(0,0,0,0.20)] rounded-xl z-50">
          <div className="p-4 pb-0 text-lg font-semibold text-gray-800 border-b bg-white rounded-t-xl">
            Thông báo
          </div>

          {totalJobs === 0 ? (
            <div className="p-4 text-gray-500 text-sm">
              Không có công việc mới.
            </div>
          ) : (
            <div className="p-3 space-y-4">
              {jobsInProgress.length > 0 && (
                <div>
                  {jobsInProgress.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg shadow-sm p-4 mb-2 transition hover:bg-lightgray cursor-pointer"
                    >
                      <div className="text-sm text-gray-800 font-semibold">
                        Bạn đã được tuyển vào:{" "}
                        <span className="text-teal-600">{job.jobTitle}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Bởi doanh nghiệp: {job.businessName}
                      </div>
                      <div className="text-xs text-gray-500">
                        Ngày bắt đầu: {job.startTime}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {jobsCancelled.length > 0 && (
                <div>
                  {jobsCancelled.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg shadow-sm p-4 mb-2 transition hover:bg-lightgray cursor-pointer opacity-80"
                    >
                      <div className="text-sm text-red-700 font-semibold">
                        Bạn đã không được tuyển vào:{" "}
                        <span className="text-teal-600">{job.jobTitle}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Bởi doanh nghiệp: {job.businessName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
