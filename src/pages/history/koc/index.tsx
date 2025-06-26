import { useEffect, useState } from "react";
import Headerrr from "../../../components/share/Headerrr";
import Footer from "../../../components/share/Footer";
import ReviewPopup from "../../../components/history/ReviewPopup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  Clock,
  CheckCircle,
  XCircle,
  Timer,
  MapPin,
  DollarSign,
  User,
  Gift,
  Calendar,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface JobWrapper {
  id: string;
  job: {
    id: string;
    title: string;
    description: string;
    kolBenefits: string;
    location: string;
    budget: number;
    gender: number;
    follower: number;
    startTime: string;
    endTime: string;
    require: string;
    status: number;
    businessId: string;
  };
}

export default function InfluencerHistoryPage() {
  const [inProgressJobs, setInProgressJobs] = useState<JobWrapper[]>([]);
  const [completedJobs, setCompletedJobs] = useState<JobWrapper[]>([]);
  const [cancelledJobs, setCancelledJobs] = useState<JobWrapper[]>([]);
  const [expiredJobs, setExpiredJobs] = useState<JobWrapper[]>([]);
  const [reviewedJobIds, setReviewedJobIds] = useState<string[]>([]);

  const [openSections, setOpenSections] = useState({
    inProgress: true,
    completed: true,
    cancelled: true,
    expired: true,
  });

  const [reviewingJob, setReviewingJob] = useState<null | {
    freelanceJobId: string;
    jobId: string;
    businessName: string;
    businessAvatar: string;
  }>(null);

  useEffect(() => {
    if (reviewingJob) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [reviewingJob]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const influId =
    typeof window !== "undefined" ? localStorage.getItem("influId") || "" : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const getBusinessInfo = async (id: string) => {
    const baseUrl = "https://localhost:7035";
    try {
      const res = await fetch(
        `${baseUrl}/api/business/get-business-by-id/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!res.ok) throw new Error("Lỗi khi lấy thông tin doanh nghiệp");

      const json = await res.json();
      return json?.data;
    } catch (err) {
      console.error("Lỗi fetch business:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const baseUrl = "https://localhost:7035";
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const urls = [
          `${baseUrl}/api/freelance-jobs/influencer/${influId}/jobs/in-progress`,
          `${baseUrl}/api/freelance-jobs/influencer/${influId}/jobs/completed`,
          `${baseUrl}/api/freelance-jobs/influencer/${influId}/jobs/cancelled`,
          `${baseUrl}/api/freelance-jobs/influencer/${influId}/jobs/pending`,
        ];

        const responses = await Promise.all(
          urls.map((url) =>
            fetch(url, { headers }).then(async (res) => {
              if (!res.ok) {
                console.error(`API failed: ${url}`, res.status);
                return { data: [] };
              }

              try {
                const json = await res.json();
                return json?.data ? { data: json.data } : { data: [] };
              } catch (e) {
                console.error(`JSON parse failed: ${url}`, e);
                return { data: [] };
              }
            })
          )
        );

        console.log("JOBS FETCHED:", responses);

        setInProgressJobs(responses[0].data);
        setCompletedJobs(responses[1].data);
        console.log("COMPLETED JOBS:", responses[1].data);

        setCancelledJobs(responses[2].data);
        setExpiredJobs(responses[3].data);
      } catch (err) {
        console.error("Lỗi tải công việc influencer:", err);
      }
    };

    if (influId && accessToken) fetchJobs();
    fetchReviewedJobs();
  }, [influId, accessToken]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const fetchReviewedJobs = async () => {
    try {
      const res = await fetch(
        "https://localhost:7035/api/review/rating-of-business",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await res.json();
      if (data?.isSuccess && Array.isArray(data.data)) {
        const reviewed = data.data.map((r: any) => r.jobId); // Lấy jobId đã đánh giá
        setReviewedJobIds(reviewed);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách đánh giá:", err);
    }
  };

  const renderJobs = (
    jobs: JobWrapper[],
    title: string,
    color: string,
    IconComponent: React.ElementType,
    sectionKey: keyof typeof openSections
  ) => (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
      <div
        className="flex items-center gap-2 cursor-pointer select-none group"
        onClick={() => toggleSection(sectionKey)}
      >
        {openSections[sectionKey] ? (
          <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-black" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-black" />
        )}
        <IconComponent className={`w-6 h-6 ${color}`} />
        <h2 className={`text-lg font-semibold ${color}`}>{title}</h2>
      </div>

      {openSections[sectionKey] && (
        <>
          {jobs.length === 0 ? (
            <p className="text-gray-500">Không có công việc nào.</p>
          ) : (
            <ul className="space-y-5">
              {jobs
                .filter((job) => job && job.job)
                .map((job) => (
                  <li
                    key={job.id}
                    className="bg-lightgray rounded-xl shadow-md p-4 border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-semibold">
                        {job.job.title || "Không có tiêu đề"}
                      </span>

                      {/* 👉 Chỉ hiển thị khi ở mục đã hoàn thành */}
                      {sectionKey === "completed" &&
                        (reviewedJobIds.includes(job.job.id) ? (
                          <span className="ml-auto text-sm text-gray-500 italic">
                            Đã đánh giá
                          </span>
                        ) : (
                          <button
                            onClick={async () => {
                              const business = await getBusinessInfo(
                                job.job.businessId
                              );
                              if (business) {
                                setReviewingJob({
                                  freelanceJobId: job.id,
                                  businessName:
                                    business.name || "Tên doanh nghiệp",
                                  businessAvatar:
                                    business.logo || "/logo-placeholder.png",
                                  jobId: job.job.id,
                                });
                              }
                            }}
                            className="text-xs bg-teal text-white px-3 py-1 rounded hover:bg-teal-700"
                          >
                            Đánh giá
                          </button>
                        ))}
                    </div>

                    <div className="text-sm text-gray-800 mb-2">
                      {job.job.description || "Không có mô tả"}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.job.location || "Không rõ"}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {typeof job.job.budget === "number"
                          ? `${job.job.budget.toLocaleString()}K`
                          : "Không rõ"}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {job.job.follower ?? "?"} follower ·{" "}
                        {job.job.gender === 1
                          ? "Nam"
                          : job.job.gender === 2
                          ? "Nữ"
                          : "Không yêu cầu"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4" />
                        {job.job.kolBenefits || "Không có quyền lợi"}
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Info className="w-4 h-4" />
                        {job.job.require || "Không yêu cầu cụ thể"}
                      </div>
                      <div className="flex items-center gap-2 col-span-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        {job.job.startTime
                          ? formatDate(job.job.startTime)
                          : "?"}{" "}
                        → {job.job.endTime ? formatDate(job.job.endTime) : "?"}
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-[Montserrat]">
      <Headerrr />

      <div className="mt-[55px] px-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal">
          LỊCH SỬ CÔNG VIỆC CỦA BẠN
        </h1>

        <div className="grid grid-cols-1 gap-x-8 gap-y-[30px]">
          <div className="flex flex-col gap-8 pr-20 pl-20">
            {renderJobs(
              inProgressJobs,
              "Đang thực hiện",
              "text-yellow-600",
              Clock,
              "inProgress"
            )}
            {renderJobs(
              cancelledJobs,
              "Đã huỷ",
              "text-red-600",
              XCircle,
              "cancelled"
            )}
          </div>
          <div className="flex flex-col gap-8 pr-20 pl-20">
            {renderJobs(
              completedJobs,
              "Đã hoàn thành",
              "text-green-600",
              CheckCircle,
              "completed"
            )}
            {renderJobs(
              expiredJobs,
              "Hết hạn",
              "text-gray-500",
              Timer,
              "expired"
            )}
          </div>
        </div>
      </div>

      {reviewingJob && (
        <ReviewPopup
          influencer={{
            influName: reviewingJob.businessName,
            influAvatar: reviewingJob.businessAvatar,
            freelanceJobId: reviewingJob.freelanceJobId,
          }}
          accessToken={accessToken}
          onClose={() => setReviewingJob(null)}
          onReviewed={() => {
            setReviewedJobIds((prev) => [...prev, reviewingJob.jobId]);

            setTimeout(() => {
              setReviewingJob(null);
            }, 500);
          }}
          type="business"
        />
      )}

      <div className="mt-[80px]">
        <Footer />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar
        closeOnClick
        draggable
        pauseOnHover
      />
    </div>
  );
}
