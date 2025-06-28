import { createPortal } from "react-dom";
import { X, FileText, Target, Gift } from "lucide-react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Job {
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
  gender?: number;
  follower?: number;
  require?: string;
  kolBenefits?: string;
  business?: {
    name?: string;
    logo?: string;
    address?: string;
  };
}

interface JobDetailProps {
  job: Job;
  onClose: () => void;
}

const genderText = (gender?: number) => {
  switch (gender) {
    case 1: return "Nam";
    case 2: return "Nữ";
    default: return "Không yêu cầu";
  }
};

const getFreelanceId = () => {
  return localStorage.getItem("influId") || "";
};

export default function JobDetail({ job, onClose }: JobDetailProps) {
  const [loading, setLoading] = useState(false);

  const handleApplyJob = async () => {
  const freelanceId = getFreelanceId();
  const accessToken = localStorage.getItem("accessToken");

  if (!freelanceId || !accessToken) {
    toast.error("Bạn chưa đăng nhập hoặc thiếu thông tin Influencer.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/freelance-jobs/apply-job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        jobId: job.id,
        freelanceId,
      }),
    });

    const data = await res.json();

    if (res.ok && data.isSuccess) {
      toast.success("Ứng tuyển thành công!");
    } else {
      toast.error("Ứng tuyển thất bại: " + (data.message || "Lỗi không xác định"));
    }
  } catch (error) {
    console.error("Apply error:", error);
    toast.error("Có lỗi xảy ra khi ứng tuyển.");
  } finally {
    setLoading(false);
  }
};


  return createPortal(
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl mx-4 p-6 rounded-xl shadow-xl relative max-h-[90vh] overflow-y-auto font-montserrat">
        <ToastContainer position="top-right" autoClose={false} />

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Logo + Thông tin cơ bản */}
        <div className="flex gap-5 items-start border-b">
          <img
            src={job.business?.logo || "/default-logo.png"}
            alt="logo"
            className="w-[100px] h-[100px] object-contain rounded-lg border mt-9"
          />
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-bold text-gray-800 mt-0 mb-2">{job.title}</h2>
            <p className="text-sm text-gray-700"><strong>Công ty:</strong> {job.business?.name || "Không rõ"}</p>
            <p className="text-sm text-gray-700"><strong>Địa chỉ:</strong> {job.business?.address || "Không có"}</p>
            <p className="text-sm text-gray-700"><strong>Khu vực:</strong> {job.location}</p>
            <p className="text-sm text-gray-700"><strong>Thời gian:</strong> {new Date(job.startTime || "").toLocaleDateString("vi-VN")} → {new Date(job.endTime || "").toLocaleDateString("vi-VN")}</p>
          </div>
        </div>

        {/* Thông tin nhanh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 mb-6 mt-4">
          <p><strong>Lương:</strong> {job.budget?.toLocaleString("vi-VN") || "?"} VND</p>
          <p><strong>Giới tính yêu cầu:</strong> {genderText(job.gender)}</p>
          <p><strong>Follower tối thiểu:</strong> {job.follower || 0}</p>
          <p><strong>Lĩnh vực:</strong> {job.fieldName || "Không rõ"}</p>
        </div>

        {/* Mô tả và Quyền lợi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Mô tả công việc
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <Gift className="w-4 h-4 text-pink-600" />
              Quyền lợi
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.kolBenefits}</p>
          </div>
        </div>

        {/* Yêu cầu */}
        {job.require && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-yellow-600" />
              Yêu cầu
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-line">{job.require}</p>
          </div>
        )}

        {/* Nút Ứng tuyển (ẩn nếu job đã hoàn thành, hủy hoặc hết hạn) */}
        {![2, 3, 4].includes(job.status ?? -1) && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleApplyJob}
              disabled={loading}
              className={`px-5 py-2 rounded-md font-medium transition text-white ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-[#14b8a6] hover:bg-[#0d9488]"
              }`}
            >
              {loading ? "Đang gửi..." : "Ứng tuyển ngay"}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
