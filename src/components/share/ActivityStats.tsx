export interface Job {
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
  businessField?: {
    fieldId: string;
  };
  fieldName?: string;
}

interface ActivityStatsProps {
  jobs: Job[];
  reviews: any[];
  getStatusLabel: (status: number) => string;
}

export default function ActivityStats({
  jobs,
  reviews,
  getStatusLabel,
}: ActivityStatsProps) {
  const filteredJobs = jobs.filter((job) => {
    const label = getStatusLabel(job.status);
    return label === "Hoàn thành" || label === "Đang thực hiện";
  });

  const completedJobs = filteredJobs.filter(
    (job) => getStatusLabel(job.status) === "Hoàn thành"
  ).length;

  const activeJobs = jobs.filter((job) => {
    const label = getStatusLabel(job.status);
    return label === "Available" || label === "Đang thực hiện";
  }).length;

  const totalEvaluableJobs = filteredJobs.length;
  const totalReviews = reviews.length;

  const completionRate =
    totalEvaluableJobs > 0
      ? Math.round((completedJobs / totalEvaluableJobs) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow space-y-4">
      <h2 className="text-xl font-bold text-teal mb-4 mt-0">HOẠT ĐỘNG</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cột 1 */}
        <div className="space-y-4">
          <div className="bg-[#F0FAFA] p-4 rounded-lg text-center">
            <div className="text-green-600 text-2xl font-bold">
              {completedJobs}
            </div>
            <div className="text-sm font-medium mt-1">Dự án đã hoàn thành</div>
          </div>
          <div className="bg-[#F0FAFA] p-4 rounded-lg text-center">
            <div className="text-yellow-500 text-2xl font-bold">
              {activeJobs.toString().padStart(2, "0")}
            </div>
            <div className="text-sm font-medium mt-1">Dự án đang thực hiện</div>
          </div>
        </div>

        {/* Cột 2 */}
        <div className="space-y-4">
          <div className="bg-[#F0FAFA] p-4 rounded-lg text-center">
            <div className="text-gray-500 text-2xl font-bold">
              {totalReviews}
            </div>
            <div className="text-sm font-medium mt-1">Tổng số đánh giá</div>
          </div>
          <div className="bg-[#F0FAFA] p-4 rounded-lg text-center">
            <div className="text-red-600 text-2xl font-bold">
              {completedJobs}
            </div>
            <div className="text-sm font-medium mt-1">Điểm đạt được</div>
          </div>
        </div>

        {/* Cột 3 */}
        <div className="bg-[#F0FAFA] p-4 rounded-lg text-center flex flex-col items-center justify-center">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                className="text-red-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={
                  completionRate >= 70 ? "text-green-600" : "text-red-600"
                }
                strokeWidth="3"
                strokeDasharray={`${completionRate}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div
              className={`absolute inset-0 flex items-center justify-center text-base font-bold ${
                completionRate >= 70 ? "text-green-600" : "text-red-600"
              }`}
            >
              {completionRate}%
            </div>
          </div>
          <div className="text-sm font-medium mt-2">Tỉ lệ hoàn thành dự án</div>
        </div>
      </div>
    </div>
  );
}
