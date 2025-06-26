import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapPin, Mail, Phone } from "lucide-react";
import ActivityStats from "../share/ActivityStats";

interface JobFull {
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

interface BusinessPopupProps {
  businessId: string;
  businessUserId?: string;
  businessName: string;
  businessAddress?: string;
  businessLogo?: string;
  onClose: () => void;
  reviews: any[];
  getStatusLabel: (status: number) => string;
}

interface Representative {
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  startTime: string;
  endTime: string;
  status: number;
}

export default function BusinessPopup({
  businessId,
  businessUserId,
  businessName,
  businessAddress,
  businessLogo,
  onClose,
  reviews,
  getStatusLabel,
}: BusinessPopupProps) {
  const [representative, setRepresentative] = useState<Representative | null>(
    null
  );
  const [description, setDescription] = useState<string>("");
  const [jobs, setJobs] = useState<JobFull[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const repRes = await fetch(
          `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/${businessId}/representative`
        );
        const repJson = await repRes.json();
        if (repJson?.data) {
          setRepresentative({
            name: repJson.data.representativeName,
            role: repJson.data.role,
            email: repJson.data.representativeEmail,
            phoneNumber: repJson.data.representativePhoneNumber,
          });
        }

        if (businessUserId) {
          const busRes = await fetch(
            `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/get-business-by-user-id/${businessUserId}`
          );
          const busJson = await busRes.json();
          if (busJson?.data?.description) {
            setDescription(busJson.data.description);
          }
        }

        const jobRes = await fetch(
          `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-job/by-business-id/${businessId}`
        );
        const jobJson = await jobRes.json();
        if (jobJson?.data) {
          setJobs(jobJson.data as JobFull[]); // 👈 ép kiểu về đúng JobFull
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };

    fetchData();
  }, [businessId, businessUserId]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm font-montserrat">
      <div className="bg-[#F3F4F6] rounded-xl w-full max-w-6xl p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full transition"
        >
          ✕
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="relative w-[104px] h-[104px] rounded-full bg-white p-[2px]"
            style={{ boxShadow: "0 0 0 3px #3b82f6" }}
          >
            <img
              src={businessLogo || "/default-logo.png"}
              alt="Logo"
              className="w-full h-full rounded-full object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = "true";
                  img.src = "/default-logo.png";
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#065F46] uppercase">
              {businessName}
            </h1>
            {businessAddress && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} /> {businessAddress}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Cột trái */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg text-teal font-bold mb-3 mt-1">
                THÔNG TIN LIÊN HỆ
              </h2>
              {representative ? (
                <div className="text-sm space-y-2 text-gray-800">
                  <p className="mb-1">
                    <strong>Người đại diện:</strong> {representative.name}
                  </p>
                  <p>
                    <strong>Chức vụ:</strong> {representative.role}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail size={16} /> {representative.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={16} /> {representative.phoneNumber}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Không có thông tin người đại diện.
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-lg text-teal font-bold mb-2">
                GIỚI THIỆU VỀ DOANH NGHIỆP
              </h2>
              <p className="text-sm text-gray-800 whitespace-pre-line">
                {description || "Chưa có mô tả giới thiệu."}
              </p>
            </div>
          </div>

          {/* Cột phải: Thống kê hoạt động */}
          <div className="md:col-span-3">
            <ActivityStats
              jobs={jobs}
              reviews={reviews}
              getStatusLabel={getStatusLabel}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
