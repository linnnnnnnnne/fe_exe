import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Influencer {
  influId: string;
  name: string;
  nickName: string;
  dateOfBirth: string;
  phoneNumber: string;
  area: string;
  follower: number;
  bio: string;
  linkImage: string;
  portfolio_link: string;
}

export default function FreelancerManager() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://localhost:7035/api/influ/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          setInfluencers(result.data);
        } else {
          setInfluencers([]);
          toast.warn("Không có dữ liệu influencer.");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải danh sách influencer:", err);
        toast.error("Lỗi khi tải danh sách influencer.");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  return (
    <div>
      {loading && <p>Đang tải danh sách influencer...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && influencers.length === 0 && (
        <p className="text-gray-500">Không có freelancer nào.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {influencers.map((influ) => (
          <div
            key={influ.influId}
            className="relative bg-white text-center p-4 rounded-2xl border border-gray-200 shadow-[0_6px_20px_rgba(0,0,0,0.12)] transform transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 flex flex-col"
          >
            <div className="flex justify-center">
              <img
                src={influ.linkImage}
                alt={influ.name}
                className="h-24 w-24 rounded-full object-cover border"
              />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{influ.name}</p>
              <p className="text-sm text-gray-600">Nickname: {influ.nickName}</p>
              <p className="text-sm">Follower: {influ.follower.toLocaleString()}</p>
              <p className="text-sm">SĐT: {influ.phoneNumber}</p>
              <p className="text-sm">
                Ngày sinh: {new Date(influ.dateOfBirth).toLocaleDateString()}
              </p>
              <p className="text-sm">Khu vực: {influ.area}</p>
              <a
                href={influ.portfolio_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm mt-1 inline-block"
              >
                Xem portfolio
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
