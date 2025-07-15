import { useEffect, useState } from "react";
import AvatarDropdown from "./AvatarDropdown";
import NotificationBellB from "./NotificationBellB";
import NotificationBellK from "./NotificationBellK";
import MessageList from "./MessageList";

export default function Header() {
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [influId, setInfluId] = useState<string | null>(null);

  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const navItemsByRole: Record<string, { label: string; path: string }[]> = {
    Business: [
      { label: "Tìm việc", path: "/home" },
      { label: "Influencer", path: "/influencer" },
      { label: "Gói đăng kí", path: "/upgrade_business" },
      { label: "Lịch sử", path: "/history_business" },
    ],
    Freelancer: [
      { label: "Tìm việc", path: "/home" },
      { label: "Influencer", path: "/influencer" },
      { label: "Gói đăng kí", path: "/upgrade_koc" },
      { label: "Lịch sử", path: "/history_koc" },
    ],
  };

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    const userIdFromStorage = localStorage.getItem("userId");
    const tokenFromStorage = localStorage.getItem("accessToken");

    // Nếu thiếu bất kỳ thông tin nào → tự động chuyển về login
    if (!roleFromStorage || !userIdFromStorage || !tokenFromStorage) {
      window.location.href = "/login";
      return;
    }

    setRole(roleFromStorage);
    setUserId(userIdFromStorage);
    setAccessToken(tokenFromStorage);

    const fetchUserData = async () => {
      try {
        let url = "";
        if (roleFromStorage === "Business") {
          url = `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/business/get-business-by-user-id/${userIdFromStorage}`;
        } else if (roleFromStorage === "Freelancer") {
          url = `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/influ/get-influ-by-userId/${userIdFromStorage}`;
        } else {
          return;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        });

        if (res.status === 401) {
          // Token hết hạn hoặc không hợp lệ → logout
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const data = await res.json();

        if (roleFromStorage === "Business") {
          setAvatarUrl(data?.data?.logo || "");
          setBusinessId(data?.data?.id);
        } else {
          setAvatarUrl(data?.data?.linkImage || "");
          setInfluId(data?.data?.influId);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu user:", err);
        window.location.href = "/login"; // fallback nếu có lỗi
      }
    };

    fetchUserData();
  }, []);

  return (
    <header className="w-full bg-teal h-[75px] relative">
      <div className="h-[75px] flex items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <div
            className="text-white font-bold text-[28px] font-buthick cursor-pointer"
            onClick={() => (window.location.href = "/")}
          >
            ih
          </div>
        </div>

        <div className="flex items-center gap-6 h-full">
          <nav className="relative flex items-end gap-8 text-white text-[17px] font-montserrat h-full">
            {(navItemsByRole[role || ""] || []).map((item, index) => {
              const isActive = currentPath === item.path;
              return (
                <div
                  key={index}
                  onClick={() => (window.location.href = item.path)}
                  className="h-full flex items-center cursor-pointer px-8 relative"
                >
                  {isActive && (
                    <div className="absolute inset-x-0 top-[15px] bg-[#FBFBFB] rounded-t-md h-[calc(100%-3px)] z-0" />
                  )}
                  <span
                    className={`z-10 transition-all duration-200 ${
                      isActive
                        ? "text-black mt-3 font-extrabold hover:text-teal"
                        : "text-white hover:text-lightgray"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </nav>

          {/* Chuông thông báo */}
          {userId && accessToken && role === "Business" && businessId && (
            <NotificationBellB
              userId={userId}
              accessToken={accessToken}
              businessId={businessId}
            />
          )}
          {userId && accessToken && role === "Freelancer" && influId && (
            <NotificationBellK />
          )}

          {/* Tin nhắn */}
          <div className="relative">
            <MessageList />
          </div>

          {/* Avatar */}
          <AvatarDropdown avatarUrl={avatarUrl} />
        </div>
      </div>
    </header>
  );
}
