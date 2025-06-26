import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MapPin } from "lucide-react";

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  startTime: string;
  endTime: string;
  status: number;
  budget: number;
  businessId: string;
  business: {
    name: string;
    address: string;
    logo: string;
  };
  fieldNames?: string[];
}

const getStatusLabel = (status: number) => {
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
      return "Hết hạn";
    default:
      return "Không xác định";
  }
};

export default function ProjectManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobsWithFields = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return toast.error("Bạn chưa đăng nhập.");

  setLoading(true);
  try {
    const res = await fetch("https://localhost:7035/api/jobs/get-all", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const json = await res.json();
    const jobList: any[] = Array.isArray(json.data) ? json.data : [];

    // Lấy danh sách businessId duy nhất
    const uniqueBusinessIds = [...new Set(jobList.map((job) => job.businessId))];
    const businessFieldsMap: Record<string, { fieldId: string; fieldName: string }[]> = {};

    // Gọi API để lấy fieldName theo từng business
    await Promise.all(
      uniqueBusinessIds.map(async (businessId) => {
        try {
          const res = await fetch(
            `https://localhost:7035/api/field/get-all-field-of-business/${businessId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          const data = await res.json();
          if (data.isSuccess && Array.isArray(data.data)) {
            businessFieldsMap[businessId] = data.data.map((f: any) => ({
              fieldId: f.fieldId,
              fieldName: f.fieldName,
            }));
          } else {
            businessFieldsMap[businessId] = [];
          }
        } catch {
          businessFieldsMap[businessId] = [];
        }
      })
    );

    // Gán fieldName cho từng job dựa vào job.businessField.fieldId
    const enrichedJobs = jobList.map((job) => {
      const businessId = job.businessId;
      const fieldId = job.businessField?.fieldId;
      const fields = businessFieldsMap[businessId] || [];

      const matchedField = fields.find((f) => f.fieldId === fieldId);
      const fieldName = matchedField ? matchedField.fieldName : "Không rõ";

      return {
        ...job,
        fieldNames: [fieldName], // vẫn dùng fieldNames cho dễ render list
      };
    });

    setJobs(enrichedJobs);
  } catch (err) {
    toast.error("Không thể tải danh sách công việc.");
    console.error("Lỗi fetch jobs:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchJobsWithFields();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4 leading-tight h-[30px]">
        <h2 className="text-xl font-semibold">Tất cả công việc</h2>
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên công việc"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-[6px] rounded-md text-sm leading-tight border border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal appearance-none"
          />
        </div>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500">Không có công việc nào.</p>
      ) : (
        jobs
          .filter((job) =>
            job.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
          )
          .map((job) => (
            <div
              key={job.id}
              className="bg-white p-4 border rounded-xl shadow-md"
            >
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center leading-tight h-[30px]">
                  <h3 className="font-bold text-base truncate">{job.title}</h3>
                  <span className="text-sm text-teal font-medium whitespace-nowrap">
                    {getStatusLabel(job.status)}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4 text-teal" />
                  <span>{job.location || "Không rõ địa điểm"}</span>
                </div>

                <p>
                  Lĩnh vực:{" "}
                  {job.fieldNames && job.fieldNames.length > 0
                    ? job.fieldNames.join(" | ")
                    : "Không rõ"}
                </p>

                <div className="flex justify-between items-center h-[20px] leading-none text-sm">
                  <p>Doanh nghiệp: {job.business?.name || "Không rõ"}</p>
                  <p className="text-right whitespace-nowrap">
                    Thời gian:{" "}
                    {new Date(job.startTime).toLocaleDateString("vi-VN")} →{" "}
                    {new Date(job.endTime).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
}
