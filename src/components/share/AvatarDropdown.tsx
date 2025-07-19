import { useState, useRef, useEffect } from "react";
import { LogOut, CircleUser } from "lucide-react";

export default function AvatarDropdown({ avatarUrl }: { avatarUrl: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return alert("Không tìm thấy userId");

    try {
      const res = await fetch(
        "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/user/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.clear();
        window.location.href = "/";
      } else {
        alert("Đăng xuất thất bại: " + (data?.message || "Lỗi không xác định"));
      }
    } catch (err) {
      console.error("Lỗi khi logout:", err);
      alert("Có lỗi xảy ra khi đăng xuất.");
    }
  };

  const handleProfileClick = () => {
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (!role || !userId) {
      alert("Không thể xác định người dùng");
      return;
    }

    if (role === "Freelancer") {
      window.location.href = `/profileKOC/${userId}`;
    } else if (role === "Business") {
      window.location.href = `/profileBusiness/${userId}`;
    } else {
      alert("Role không hợp lệ");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div
        className="relative cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 animate-pulse" />
          )}
        </div>

        {/* Chấm xanh online */}
        <div className="absolute bottom-0 right-0 w-[10px] h-[10px] bg-green-400 border-2 border-white rounded-full z-10" />
      </div>

      {menuOpen && (
        <div className="absolute font-montserrat right-0 top-[45px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.20)] rounded-xl overflow-hidden z-50 min-w-[200px] text-lg">
          {" "}
          {/* ← chỉnh từ text-base sang text-lg */}
          <button
            onClick={handleProfileClick}
            className="flex bg-white font-montserrat font-bold items-center gap-3 w-full text-left px-4 py-3 hover:bg-lightgray"
          >
            <CircleUser className="w-6 h-6" />
            Trang cá nhân
          </button>
          <button
            onClick={handleLogout}
            className="flex bg-white font-montserrat font-bold items-center gap-3 w-full text-left px-4 py-3 hover:bg-lightgray"
          >
            <LogOut className="w-6 h-6" />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
