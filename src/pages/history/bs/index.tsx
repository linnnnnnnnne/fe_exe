import { useEffect, useState } from "react";
import Headerrr from "../../../components/share/Headerrr";
import Footer from "../../../components/share/Footer";
import ReviewPopup from "../../../components/history/ReviewPopup";

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

interface Job {
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
}

export default function BusinessHistoryPage() {
  const [reviewedInfluencerIds, setReviewedInfluencerIds] = useState<string[]>(
    []
  );
  const [reviewedJobIds, setReviewedJobIds] = useState<string[]>([]);
  const [inProgressJobs, setInProgressJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [cancelledJobs, setCancelledJobs] = useState<Job[]>([]);
  const [expiredJobs, setExpiredJobs] = useState<Job[]>([]);
  const [jobInfluencers, setJobInfluencers] = useState<{
    [key: string]: any[];
  }>({});
  const [openJob, setOpenJob] = useState<string | null>(null);

  const [openSections, setOpenSections] = useState({
    inProgress: true,
    completed: true,
    cancelled: true,
    expired: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [openReviewPopup, setOpenReviewPopup] = useState<{
    open: boolean;
    influencer: any | null;
  }>({ open: false, influencer: null });

  useEffect(() => {
    if (openReviewPopup.open) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [openReviewPopup.open]);

  const businessId =
    typeof window !== "undefined"
      ? localStorage.getItem("businessId") || ""
      : "";
  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken") || ""
      : "";

  const fetchJobs = async () => {
    try {
      const baseUrl = "https://localhost:7035";
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      };

      const [res1, res2, res3, res4] = await Promise.all([
        fetch(
          `${baseUrl}/api/job-status/in-progress/by-business/${businessId}`,
          { headers }
        ),
        fetch(`${baseUrl}/api/job-status/complete/by-business/${businessId}`, {
          headers,
        }),
        fetch(`${baseUrl}/api/job-status/cancel/by-business/${businessId}`, {
          headers,
        }),
        fetch(
          `${baseUrl}/api/job-status/registration-expired/by-business/${businessId}`,
          { headers }
        ),
      ]);

      const [data1, data2, data3, data4] = await Promise.all([
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json(),
      ]);

      setInProgressJobs(data1.data || []);
      setCompletedJobs(data2.data || []);
      setCancelledJobs(data3.data || []);
      setExpiredJobs(data4.data || []);
    } catch (err) {
      console.error("Lỗi tải công việc:", err);
    }
  };

  useEffect(() => {
    if (businessId && accessToken) fetchJobs();
  }, [businessId, accessToken]);

  const fetchReviewedJobs = async () => {
    try {
      const res = await fetch(
        "https://localhost:7035/api/review/rating-of-influ",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data?.isSuccess) {
        const reviewedJobIds = data.data.map((r: any) => r.jobId);
        setReviewedInfluencerIds(reviewedJobIds);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách đánh giá:", err);
    }
  };
  useEffect(() => {
    if (businessId && accessToken) {
      fetchJobs();
      fetchReviewedJobs();
    }
  }, [businessId, accessToken]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("vi-VN", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const fetchInfluencersForJob = async (
    jobId: string,
    statusFilter: number
  ) => {
    try {
      const res = await fetch(
        `https://localhost:7035/api/freelance-jobs/${jobId}/list-influencers-apply-job`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      if (data?.isSuccess && Array.isArray(data.data)) {
        const filtered = data.data.filter(
          (i: any) => i.status === statusFilter
        );
        setJobInfluencers((prev) => ({ ...prev, [jobId]: filtered }));
      } else {
        setJobInfluencers((prev) => ({ ...prev, [jobId]: [] }));
      }
    } catch (err) {
      console.error("Lỗi fetch Influencer:", err);
      setJobInfluencers((prev) => ({ ...prev, [jobId]: [] }));
    }
    setOpenJob(jobId);
  };

  const confirmComplete = async (freelanceJobId: string, jobId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Bạn chưa đăng nhập hoặc token đã hết hạn.");
      return;
    }

    try {
      const res = await fetch(
        "https://localhost:7035/api/freelance-jobs/confirm-complete-job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ freelanceJobId }),
        }
      );

      const result = await res.json();
      if (res.ok && result?.isSuccess) {
        alert("Đã xác nhận hoàn thành!");
        await fetchJobs();
        setOpenJob(null);
      } else {
        console.error("Chi tiết lỗi:", result);
        alert(`${result.message || "Lỗi xác nhận hoàn thành."}`);
      }
    } catch (err) {
      console.error("Lỗi gọi API hoàn thành:", err);
      alert("Không thể xác nhận.");
    }
  };

  const renderJobs = (
    jobs: Job[],
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
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-black" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-black" />
        )}
        <IconComponent className={`w-5 h-5 ${color}`} />
        <h2 className={`text-lg font-semibold ${color}`}>{title}</h2>
      </div>

      {openSections[sectionKey] && (
        <>
          {jobs.length === 0 ? (
            <p className="text-gray-500">Không có công việc nào.</p>
          ) : (
            <ul className="space-y-5">
              {jobs.map((job) => (
                <li
                  key={job.id}
                  className="bg-lightgray rounded-xl shadow-md p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="text-base font-semibold">{job.title}</div>
                    {sectionKey === "inProgress" && (
                      <button
                        onClick={() => fetchInfluencersForJob(job.id, 1)}
                        className="text-sm bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700"
                      >
                        Hoàn thành
                      </button>
                    )}
                    {sectionKey === "completed" && (
                      <button
                        onClick={() => fetchInfluencersForJob(job.id, 2)}
                        className="text-sm bg-transparent underline text-gray-600 hover:text-black"
                      >
                        Xem Influencer
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-gray-800 mb-2">
                    {job.description}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {job.budget.toLocaleString()}K
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {job.follower} follower ·{" "}
                      {job.gender === 1
                        ? "Nam"
                        : job.gender === 2
                        ? "Nữ"
                        : "Không yêu cầu"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4" />
                      {job.kolBenefits}
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Info className="w-4 h-4" />
                      {job.require}
                    </div>
                    <div className="flex items-center gap-2 col-span-2 text-gray-700">
                      <Calendar className="w-4 h-4" />
                      {formatDate(job.startTime)} → {formatDate(job.endTime)}
                    </div>
                  </div>

                  {openJob === job.id && (
                    <>
                      {jobInfluencers[job.id]?.length > 0 ? (
                        <div className="mt-3 space-y-3">
                          {jobInfluencers[job.id].map((influ: any) => (
                            <div
                              key={influ.id}
                              className="flex items-center gap-3 p-2 bg-white rounded-md border"
                            >
                              <img
                                src={influ.influAvatar}
                                className="w-10 h-10 rounded-full object-cover"
                                alt={influ.influName}
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm">
                                  {influ.influName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {influ.influFollower.toLocaleString()}{" "}
                                  follower
                                </span>
                              </div>
                              {sectionKey === "inProgress" && (
                                <button
                                  onClick={() =>
                                    confirmComplete(influ.id, job.id)
                                  }
                                  className="ml-auto text-sm bg-teal text-white px-3 py-1 rounded hover:bg-green-700"
                                >
                                  Xác nhận hoàn thành
                                </button>
                              )}

                              {sectionKey === "completed" &&
                                influ.status === 2 &&
                                (reviewedInfluencerIds.includes(job.id) ? (
                                  <span className="ml-auto text-sm text-gray-500 italic">
                                    Đã đánh giá
                                  </span>
                                ) : (
                                  <button
                                    onClick={() =>
                                      setOpenReviewPopup({
                                        open: true,
                                        influencer: {
                                          ...influ,
                                          jobId: job.id,
                                        },
                                      })
                                    }
                                    className="ml-auto text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                  >
                                    Đánh giá
                                  </button>
                                ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 italic mt-2">
                          Không có Influencer phù hợp.
                        </p>
                      )}
                    </>
                  )}
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
      <div className="mt-[55px] px-6max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-teal">
          CÔNG VIỆC CỦA DOANH NGHIỆP
        </h1>
        <div className="grid grid-cols-1  gap-x-8 gap-y-[30px]">
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
              "Hết hạn đăng ký",
              "text-gray-500",
              Timer,
              "expired"
            )}
          </div>
        </div>
      </div>
      <div className="mt-[80px]">
        <Footer />
      </div>

      {openReviewPopup.open && openReviewPopup.influencer && (
        <ReviewPopup
          influencer={openReviewPopup.influencer}
          accessToken={accessToken}
          onClose={() => setOpenReviewPopup({ open: false, influencer: null })}
          onReviewed={() => {
            setReviewedInfluencerIds((prev) => [
              ...prev,
              openReviewPopup.influencer.jobId,
            ]);
          }}
        />
      )}
    </div>
  );
}
