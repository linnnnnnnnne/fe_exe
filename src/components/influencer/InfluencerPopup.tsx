import { createPortal } from "react-dom";
import { MapPin, Phone, X } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import ActivityStats from "../share/ActivityStats";
import type { Job } from "../share/ActivityStats";

interface InfluencerPopupProps {
  data: {
    name: string;
    nickName: string;
    area: string;
    linkImage: string;
    dateOfBirth?: string;
    gender?: number;
    phoneNumber?: string;
    portfolio_link?: string;
    linkmxh?: string[];
    follower?: number;
    bio?: string;
    jobs?: Job[];
  };
  onClose: () => void;
}

export default function InfluencerPopup({
  data,
  onClose,
}: InfluencerPopupProps) {
  const getGenderLabel = (gender: number | undefined) => {
    switch (gender) {
      case 1:
        return "Nam";
      case 2:
        return "Nữ";
      case 3:
        return "Giới tính khác";
      default:
        return "Không rõ";
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm font-montserrat">
      <div className="bg-[#F3F4F6] rounded-xl w-full max-w-6xl p-6 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full transition"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="relative w-[104px] h-[104px] rounded-full bg-white p-[2px]"
            style={{ boxShadow: "0 0 0 3px #3b82f6" }}
          >
            <img
              src={data.linkImage || "/default-avatar.png"}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-teal mb-0 mt-0 uppercase">
              {data.name}
              <span className="text-sm normal-case font-normal text-gray-700 ml-2">
                ({data.nickName})
              </span>
            </h1>
            <p className="text-sm italic text-gray-600 mt-2">
              {data.bio || "Không có mô tả"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} />
              {data.area || "Không rõ"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Cột trái */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow p-4 text-sm">
              <h2 className="text-xl text-teal font-bold mb-3 mt-2">
                THÔNG TIN LIÊN HỆ
              </h2>
              <div className="space-y-2 text-gray-800">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {data.phoneNumber || "Không có"}
                </div>
                <div>
                  <strong>Ngày sinh:</strong>{" "}
                  {data.dateOfBirth && !isNaN(Date.parse(data.dateOfBirth))
                    ? new Date(data.dateOfBirth).toLocaleDateString("vi-VN")
                    : "Không có"}
                </div>
                <div>
                  <strong>Giới tính:</strong> {getGenderLabel(data.gender)}
                </div>
                <div>
                  <strong>Khu vực:</strong> {data.area || "Không rõ"}
                </div>
                <div>
                  <strong>Người theo dõi:</strong>{" "}
                  {data.follower?.toLocaleString() || "Không có"}
                </div>
                <div>
                  <strong>Portfolio:</strong>{" "}
                  {data.portfolio_link ? (
                    <a
                      href={data.portfolio_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      {data.portfolio_link}
                    </a>
                  ) : (
                    "Không có"
                  )}
                </div>
                <div className="flex gap-4 items-center pt-1">
                  {[
                    FaFacebook,
                    FaInstagram,
                    FaYoutube,
                    FaTiktok,
                    FaWhatsapp,
                  ].map((Icon, idx) => {
                    const platform = [
                      "facebook",
                      "instagram",
                      "youtube",
                      "tiktok",
                      "whatsapp",
                    ][idx];
                    const link = data.linkmxh?.find((url) =>
                      url.toLowerCase().includes(platform)
                    );
                    return (
                      link && (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          title={platform}
                          className="text-teal hover:text-teal-600"
                        >
                          <Icon size={24} />
                        </a>
                      )
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thống kê hoạt động */}
          <div className="md:col-span-3">
            {data.jobs && data.jobs.length > 0 ? (
              <ActivityStats
                jobs={data.jobs}
                reviews={[]}
                getStatusLabel={(status) => {
                  switch (status) {
                    case 0:
                      return "Đang chờ duyệt";
                    case 1:
                      return "Đang thực hiện";
                    case 2:
                      return "Hoàn thành";
                    default:
                      return "Không xác định";
                  }
                }}
              />
            ) : (
              <p className="text-gray-500 text-sm">Chưa có hoạt động nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
