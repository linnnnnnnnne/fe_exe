import { useEffect, useState } from "react";
import { MapPin, Clock4, Star } from "lucide-react";
import Pagination from "../share/Pagination";
import JobDetail from "./JobDetail";
import { useNavigate } from "react-router-dom";

const jobsPerPage = 6;

export interface Job {
  id: string;
  title: string;
  location: string;
  businessId: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  status?: number;
  budget?: number;
  fieldName?: string;
  kolBenefits?: string;
  require?: string;
  gender?: number;
  follower?: number;
  business?: {
    name?: string;
    logo?: string;
    address?: string;
    userId?: string;
  };
  businessField?: {
    fieldId?: string;
  };
}

interface ListJobsProps {
  jobs?: Job[];
  loading?: boolean;
}

const getStatusLabel = (status?: number) => {
  switch (status) {
    case 0:
      return "Available";
    case 1:
      return "Đang thực hiện";
    case 2:
      return "Hoàn thành";
    case 3:
      return "Đã hủy";
    case 4:
      return "Hết hạn đăng ký";
    default:
      return "Không xác định";
  }
};

export default function ListJobs({
  jobs: searchJobs,
  loading: searchLoading,
}: ListJobsProps) {
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highlightMembershipUserIds, setHighlightMembershipUserIds] = useState<
    string[]
  >([]);
  const [selectedJobDetail, setSelectedJobDetail] = useState<Job | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);

  const navigate = useNavigate();
  const useSearch = Array.isArray(searchJobs);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const res = await fetch(
          "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/membership/businesses"
        );
        const json = await res.json();
        if (json?.isSuccess && Array.isArray(json.data)) {
          const ids = json.data.map((m: any) => m.userId);
          setHighlightMembershipUserIds(ids);
        }
      } catch (err) {
        console.error("Lỗi khi fetch business membership:", err);
      }
    };

    fetchMemberships();
  }, []);

  useEffect(() => {
    if (useSearch) {
      setJobs(searchJobs || []);
      setLoading(!!searchLoading);
      return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch(
          "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-all"
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const jobList = Array.isArray(data) ? data : data.data || [];
        setJobs(jobList);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định khi gọi API.");
        console.error("Lỗi khi gọi API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchJobs, searchLoading]);

  useEffect(() => {
    if (showJobDetail) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showJobDetail]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const currentJobs = jobs.slice((page - 1) * jobsPerPage, page * jobsPerPage);

  const handleNavigateToBusinessDetail = (job: Job) => {
    navigate("/business_detail", {
      state: {
        businessId: job.businessId,
        businessName: job.business?.name || "Không rõ",
        businessAddress: job.business?.address,
        businessLogo: job.business?.logo,
        businessUserId: job.business?.userId,
      },
    });
  };

  if (loading)
    return <p className="text-center">Đang tải dữ liệu công việc...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  if (jobs.length === 0)
    return (
      <p className="text-center text-gray-500">
        Không có công việc nào được hiển thị.
      </p>
    );

  return (
    <div className="space-y-6">
      {currentJobs.map((job, index) => (
        <div
          key={index}
          onClick={() => {
            setSelectedJobDetail(job);
            setShowJobDetail(true);
          }}
          className="relative bg-white rounded-2xl p-5 flex items-center gap-6 border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.08)] transform transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] cursor-pointer"
        >
          <div className="relative w-[80px] h-[80px]">
            <img
              src={job.business?.logo || "/default-logo.png"}
              alt="logo"
              className="w-full h-full rounded-xl object-contain"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "true";
                  img.src = "/default-logo.png";
                }
              }}
            />
            {highlightMembershipUserIds.includes(job.businessId) && (
              <div
                title="Doanh nghiệp thành viên"
                className="absolute top-0 right-0 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center shadow"
              >
                <Star size={12} className="text-white fill-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex h-[32px] justify-between items-center">
              <h2 className="font-semibold text-[19px] text-gray-800">
                {job.title}
              </h2>
              <span className="text-sm font-medium text-teal ml-4 whitespace-nowrap">
                {getStatusLabel(job.status)}
              </span>
            </div>

            <p className="text-gray-600 mt-0 mb-2 flex justify-between items-center gap-2 flex-wrap">
              <a
                href="/business_detail"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleNavigateToBusinessDetail(job);
                }}
                className="no-underline cursor-pointer text-gray-600 hover:text-black"
              >
                Công ty: {job.business?.name || "Chưa có tên công ty"}
              </a>
              {job.budget && (
                <span className="text-teal font-medium whitespace-nowrap">
                  {job.budget.toLocaleString("vi-VN")} VND
                </span>
              )}
            </p>

            {job.description && (
              <p className="text-gray-500 text-sm mt-1">{job.description}</p>
            )}

            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 flex-wrap gap-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-teal" />
                  {job.location}
                </span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm font-medium">
                  {job.fieldName || "Chưa rõ lĩnh vực"}
                </span>
              </div>
              <div className="flex items-center gap-6">
                {job.startTime && (
                  <span className="flex items-center gap-1">
                    <Clock4 className="w-4 h-4" />
                    {new Date(job.startTime).toLocaleDateString("vi-VN")} →{" "}
                    {job.endTime
                      ? new Date(job.endTime).toLocaleDateString("vi-VN")
                      : "?"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}

      {showJobDetail && selectedJobDetail && (
        <JobDetail
          job={selectedJobDetail}
          onClose={() => setShowJobDetail(false)}
        />
      )}
    </div>
  );
}
