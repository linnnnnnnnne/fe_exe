import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

interface Influencer {
  influId: string;
  userId: string;
  name: string;
  nickName: string;
  dateOfBirth: string;
  phoneNumber: string;
  area: string;
  follower: number;
  bio: string;
  linkImage: string;
  portfolio_link: string;
  linkmxh?: string[];
  fieldNames?: string[];
  isBlocked?: boolean;
  email?: string;
}

export default function FreelancerManager() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

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
        const [influRes, userStatusRes] = await Promise.all([
          fetch(
            "https://localhost:7035/api/influ/all",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          ),
          fetch(
            "https://localhost:7035/api/user/all",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          ),
        ]);

        const [influData, userStatusData] = await Promise.all([
          influRes.json(),
          userStatusRes.json(),
        ]);

        const userBlockedMap: Record<string, boolean> = {};
        if (Array.isArray(userStatusData.data)) {
          userStatusData.data.forEach((u: any) => {
            userBlockedMap[u.userId] = u.isBlocked;
          });
        }

        if (influRes.ok && Array.isArray(influData.data)) {
          const fullInfluencers = await Promise.all(
            influData.data.map(async (influ: Influencer) => {
              let linkmxh: string[] = [];
              let fieldNames: string[] = [];
              let email = ""; // 👈 Khởi tạo email

              try {
                const detailRes = await fetch(
                  `https://localhost:7035/api/influ/get-influ-by-userId/${influ.userId}`,
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const detailData = await detailRes.json();
                linkmxh = detailData?.data?.linkmxh || [];
                email = detailData?.data?.email || ""; // 👈 Lấy email
              } catch {}

              try {
                const fieldRes = await fetch(
                  `https://localhost:7035/api/field/get-all-field-of-influ/${influ.influId}`,
                  { headers: { Authorization: `Bearer ${accessToken}` } }
                );
                const fieldData = await fieldRes.json();
                if (fieldData?.isSuccess && Array.isArray(fieldData.data)) {
                  fieldNames = fieldData.data.map(
                    (f: { name: string }) => f.name
                  );
                }
              } catch {}

              return {
                ...influ,
                linkmxh,
                fieldNames,
                email, // 👈 Gán email
                isBlocked: userBlockedMap.hasOwnProperty(influ.userId)
                  ? userBlockedMap[influ.userId]
                  : false,
              };
            })
          );

          setInfluencers(fullInfluencers);
        } else {
          toast.warn("Không có dữ liệu influencer.");
          setInfluencers([]);
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

  const handleBlock = async (userId: string, block: boolean) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return toast.error("Bạn chưa đăng nhập.");

    const confirm = window.confirm(
      block
        ? "Bạn có chắc muốn chặn tài khoản này?"
        : "Bạn có chắc muốn gỡ chặn?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        `https://localhost:7035/api/admin/users/${userId}/block?isBlocked=${block}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.ok) {
        toast.success(block ? "Đã chặn tài khoản!" : "Đã gỡ chặn tài khoản!");
        setInfluencers((prev) =>
          prev.map((i) =>
            i.userId === userId ? { ...i, isBlocked: block } : i
          )
        );
      } else {
        toast.error("Thao tác thất bại.");
      }
    } catch (err) {
      console.error("Lỗi khi xử lý chặn/gỡ chặn:", err);
      toast.error("Đã xảy ra lỗi.");
    }
  };

  const filteredInfluencers = influencers.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {loading && <p>Đang tải danh sách influencer...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && influencers.length === 0 && (
        <p className="text-gray-500">Không có freelancer nào.</p>
      )}

      <div className="flex justify-between items-center mb-4 leading-tight h-[30px]">
        <h2 className="text-xl font-semibold">Tất cả Freelancer</h2>
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên influencer"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-[6px] rounded-md text-sm leading-tight border border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal appearance-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredInfluencers.map((influ) => (
          <div
            key={influ.influId}
            className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-md hover:shadow-lg transition relative"
          >
            <img
              src={influ.linkImage}
              alt={influ.name}
              className="w-24 h-24 rounded-full object-cover border shrink-0 mt-9 ml-2"
            />

            <div className="flex flex-col sm:flex-row justify-between w-full gap-6">
              {/* Nội dung thông tin */}
              <div className="flex-1 text-sm ml-2">
                <p className="text-lg font-bold mb-2 mt-0">{influ.name}</p>

                <div className="flex flex-col text-sm space-y-1">
                  <div className="grid grid-cols-2">
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600">
                        Nickname:
                      </span>
                      <span>{influ.nickName}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600">SĐT:</span>
                      <span>{influ.phoneNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600">Email:</span>
                      <span>{influ.email}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600">
                        Khu vực:
                      </span>
                      <span>{influ.area}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600">
                        Ngày sinh:
                      </span>
                      <span>
                        {new Date(influ.dateOfBirth).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <span className="font-medium text-gray-600">
                        Mạng xã hội:
                      </span>
                      <div className="flex gap-1">
                        {[
                          FaFacebook,
                          FaInstagram,
                          FaYoutube,
                          FaTiktok,
                          FaWhatsapp,
                        ].map((Icon, idx) => {
                          const names = [
                            "facebook",
                            "instagram",
                            "youtube",
                            "tiktok",
                            "whatsapp",
                          ];
                          const name = names[idx];
                          const link = influ.linkmxh?.find((url) =>
                            url.toLowerCase().includes(name)
                          );
                          return (
                            link && (
                              <a
                                key={name}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={name}
                                className="text-teal hover:text-teal-400"
                              >
                                <Icon size={18} />
                              </a>
                            )
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2">
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600">
                        Follower:
                      </span>
                      <span>{influ.follower.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="font-medium text-gray-600 whitespace-nowrap align-top">
                        Lĩnh vực:&nbsp;
                      </span>
                      <span className="inline">
                        {influ.fieldNames?.length
                          ? influ.fieldNames.join(" | ")
                          : "Không có"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <span className="font-medium text-gray-600">
                      Portfolio:
                    </span>
                    <a
                      href={influ.portfolio_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Xem portfolio
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 mt-1">
                <button
                  onClick={() => handleBlock(influ.userId, !influ.isBlocked)}
                  className={`text-xs px-3 py-1 rounded-md shadow ${
                    influ.isBlocked
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-red-100 text-red-600 hover:bg-red-200"
                  }`}
                >
                  {influ.isBlocked ? "Gỡ chặn tài khoản" : "Chặn tài khoản"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
