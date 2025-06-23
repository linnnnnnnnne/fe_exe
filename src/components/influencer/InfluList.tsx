import { X, MapPin, UserPlus, Star } from "lucide-react";
import Pagination from "../share/Pagination";

type Influencer = {
  name: string;
  nickName: string;
  description: string;
  followers: string;
  category?: string;
  experience?: string;
  area: string;
  linkImage: string;
  userId: string;
  fieldNames?: string[];
};

interface InfluListProps {
  items: Influencer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onConnect: (influencer: Influencer) => void;
  highlightMembershipUserIds?: string[];
}

export default function InfluList({
  items,
  currentPage,
  totalPages,
  onPageChange,
  onConnect,
  highlightMembershipUserIds = [],
}: InfluListProps) {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((influencer, index) => (
          <div
            key={index}
            className="relative bg-white text-center p-4 rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.12)] transform transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] flex flex-col"
          >
            <button className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-lightgray text-teal hover:text-red-500 rounded-full shadow-sm">
              <X size={18} />
            </button>

            <div className="relative w-40 h-40 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.08)] border border-gray-200">
                <img
                  src={influencer.linkImage}
                  alt={influencer.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              {highlightMembershipUserIds?.includes(influencer.userId) && (
                <div
                  title="Đã đăng ký gói thành viên"
                  className="absolute top-2 right-3 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center shadow-md"
                >
                  <Star size={16} className="text-white fill-white" />
                </div>
              )}
            </div>

            <div className="mt-3">
              <h3 className="font-bold text-lg inline">{influencer.name}</h3>
              <span className="text-sm text-gray-700 italic ml-2">
                ({influencer.nickName || "Không có"})
              </span>
            </div>

            <p className="text-xs text-darkgray italic mt-1 mb-1">
              “{influencer.description?.trim() || "Không có"}”
            </p>

            <p className="text-xs text-gray-600 flex justify-center items-center gap-1 mt-1">
              <MapPin size={14} className="inline-block text-teal" />
              <span>{influencer.area?.trim() || "Không có"}</span>
              <span className="mx-2">|</span>
              <span>
                {influencer.followers?.trim() || "Không có"} người theo dõi
              </span>
            </p>

            <p className="text-[13px] text-black mt-1">
              Lĩnh vực:{" "}
              {influencer.fieldNames && influencer.fieldNames.length > 0
                ? influencer.fieldNames.join(" | ")
                : "Không có"}
            </p>

            <button
              className="mt-auto text-sm text-gray-600 font-semibold rounded-full bg-[#C7D7D3] hover:bg-teal100 hover:text-white px-4 py-1 mx-auto flex items-center justify-center gap-1 leading-none transition-colors duration-200"
              onClick={() => onConnect(influencer)}
            >
              <UserPlus size={16} />
              <span className="mt-[2px]">Kết nối</span>
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-darkgray mt-10">
          Không tìm thấy hồ sơ phù hợp.
        </p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
