import { MapPin, Star } from "lucide-react";
import { useMemo } from "react";

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
  fieldName?: string;
}

interface JobListPublicProps {
  jobs: Job[];
  getStatusLabel: (status: number) => string;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  reviews: any[];
  influMap: { [id: string]: any };
  hasMembership: boolean;
}

export default function JobListPublic({
  jobs,
  getStatusLabel,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  reviews,
  influMap,
  hasMembership,
}: JobListPublicProps) {
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const currentJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return jobs.slice(startIndex, startIndex + itemsPerPage);
  }, [jobs, currentPage, itemsPerPage]);

  if (jobs.length === 0) {
    return <p className="text-sm text-gray-500">Không có công việc nào.</p>;
  }

  return (
    <div className="space-y-4">
      {currentJobs.map((job, idx) => {
        const review = reviews.find((r) => r.jobId === job.id);
        const influ = review && influMap[review.influId];

        return (
          <div
            key={idx}
            className="p-4 bg-[#F1F9F9] rounded-xl border shadow-sm space-y-1"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg mt-1 mb-2">{job.title}</h3>
              <div className="text-teal font-bold">
                {getStatusLabel(job.status)}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div className="max-w-[75%]">
                <strong>Mô tả công việc:</strong>{" "}
                <span className="whitespace-pre-wrap">
                  {job.description}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <strong>Yêu cầu:</strong> {job.require}
              </div>
              <div>
                <strong>Giới tính:</strong>{" "}
                {job.gender === 0 ? "Nam" : job.gender === 1 ? "Nữ" : "Bất kỳ"}
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <div>
                <strong>Quyền lợi:</strong> {job.kolBenefits}
              </div>
              <div>
                <strong>Ngân sách:</strong> {job.budget.toLocaleString()} VNĐ
              </div>
            </div>

            <div className="flex justify-between text-sm mt-1">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {job.location} <span>|</span> {job.fieldName}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(job.startTime).toLocaleDateString("vi-VN")} – {new Date(job.endTime).toLocaleDateString("vi-VN")}
              </div>
            </div>

            {job.status === 2 && (
              <div className="mt-3 bg-white border p-3 rounded-lg shadow text-sm space-y-1">
                <strong>Đánh giá từ đối tác:</strong>
                {!hasMembership ? (
                  <p className="text-gray-500 italic">
                    Hãy nâng cấp tài khoản để xem review từ đối tác của bạn
                  </p>
                ) : review ? (
                  <div className="mt-1 flex items-start gap-3">
                    <img
                      src={influ?.linkImage || "https://via.placeholder.com/40"}
                      className="w-12 h-12 mt-1 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <div className="font-semibold">
                          {influ?.name || "Influencer"}
                        </div>
                        <div className="flex items-center gap-1 text-orange-400 mb-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={`stroke-orange-400 ${
                                i < review.rating
                                  ? "fill-orange-400"
                                  : "fill-transparent"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-gray-700 mt-1">
                        {review.feedback ? (
                          <span className="italic">"{review.feedback}"</span>
                        ) : (
                          <span className="text-gray-500">
                            Hiện tại chưa có review từ đối tác
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Hiện tại chưa có review từ đối tác
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-full text-sm ${
                currentPage === i + 1
                  ? "bg-teal text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}