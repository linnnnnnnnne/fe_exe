import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Business {
  id: string;
  userId: string;
  name: string;
  address: string;
  businessLicense: string;
  logo: string;
  fieldIds: string[];
  portfolio_link?: string;
  isBlocked?: boolean;
}

interface Representative {
  representativeName: string;
  role: string;
  representativeEmail: string;
  representativePhoneNumber: string;
}

export default function BusinessManager() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [representatives, setRepresentatives] = useState<
    Record<string, Representative>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/business/all",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const result = await res.json();

        const userStatusRes = await fetch(
          "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/user/all",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const userStatusData = await userStatusRes.json();
        const userBlockedMap: Record<string, boolean> = {};
        if (Array.isArray(userStatusData.data)) {
          userStatusData.data.forEach((u: any) => {
            userBlockedMap[u.userId] = u.isBlocked;
          });
        }

        if (res.ok && Array.isArray(result.data)) {
          const enriched = result.data.map((biz: Business) => ({
            ...biz,
            isBlocked: userBlockedMap[biz.userId] ?? false,
          }));
          setBusinesses(enriched);
        } else {
          toast.warn("Không có dữ liệu doanh nghiệp.");
          setBusinesses([]);
        }
      } catch (err: any) {
        console.error("Lỗi khi tải doanh nghiệp:", err);
        toast.error("Lỗi khi tải danh sách doanh nghiệp.");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  useEffect(() => {
    const fetchRepresentatives = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const reps: Record<string, Representative> = {};

      await Promise.all(
        businesses.map(async (biz) => {
          try {
            const res = await fetch(
              `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/business/${biz.id}/representative`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            const data = await res.json();
            if (res.ok && data?.data) {
              reps[biz.id] = data.data;
            }
          } catch (err) {
            console.error(`Lỗi lấy người đại diện: ${biz.name}`, err);
          }
        })
      );

      setRepresentatives(reps);
    };

    if (businesses.length > 0) {
      fetchRepresentatives();
    }
  }, [businesses]);

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
        `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/admin/users/${userId}/block?isBlocked=${block}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (res.ok) {
        toast.success(
          block ? "Đã chặn tài khoản thành công!" : "Đã gỡ chặn tài khoản!"
        );
        setBusinesses((prev) =>
          prev.map((b) =>
            b.userId === userId ? { ...b, isBlocked: block } : b
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

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {loading && <p>Đang tải danh sách doanh nghiệp...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && businesses.length === 0 && (
        <p className="text-gray-500">Không có doanh nghiệp nào.</p>
      )}

      <div className="flex justify-between items-center mb-4 leading-tight h-[30px]">
        <h2 className="text-xl font-semibold">Tất cả Doanh Nghiệp</h2>
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm theo tên doanh nghiệp"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-[6px] rounded-md text-sm leading-tight border border-gray-300 focus:outline-none focus:ring-1 focus:ring-teal appearance-none"
          />
        </div>
      </div>

      {filteredBusinesses.map((biz) => (
        <div
          key={biz.id}
          className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex flex-col sm:flex-row gap-6 border border-gray-200"
        >
          <button
            onClick={() => handleBlock(biz.userId, !biz.isBlocked)}
            className={`absolute top-6 right-4 text-xs px-3 py-1 rounded-md shadow ${
              biz.isBlocked
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-red-100 text-red-600 hover:bg-red-200"
            }`}
          >
            {biz.isBlocked ? "Gỡ chặn tài khoản" : "Chặn tài khoản"}
          </button>

          <div className="w-24 h-24 flex items-center justify-center">
            {biz.logo ? (
              <img
                src={biz.logo}
                alt={biz.name}
                className="w-24 h-24 rounded-full object-cover border shadow"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = "true";
                    img.src = "/default-logo.png";
                  }
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm border">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-[40%_60%] gap-y-2 text-sm">
            <div className="space-y-2">
              <p className="mb-0 mt-0">
                <b className="text-gray-700">Tên doanh nghiệp:</b> {biz.name}
              </p>
              <p>
                <b className="text-gray-700">Địa chỉ:</b> {biz.address}
              </p>
              <p>
                <b className="text-gray-700">Giấy phép:</b>{" "}
                <a
                  href={biz.businessLicense}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Xem giấy phép
                </a>
              </p>
              {biz.portfolio_link && (
                <p>
                  <b className="text-gray-700">Portfolio:</b>{" "}
                  <a
                    href={biz.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xem portfolio
                  </a>
                </p>
              )}
            </div>

            {representatives[biz.id] && (
              <div className="space-y-1">
                <p className="mb-0 mt-0">
                  <b className="text-gray-700">Người đại diện:</b>{" "}
                  {representatives[biz.id].representativeName}
                </p>
                <p>
                  <b className="text-gray-700">Chức vụ:</b>{" "}
                  {representatives[biz.id].role}
                </p>
                <p>
                  <b className="text-gray-700">Email:</b>{" "}
                  {representatives[biz.id].representativeEmail}
                </p>
                <p>
                  <b className="text-gray-700">SĐT:</b>{" "}
                  {representatives[biz.id].representativePhoneNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
