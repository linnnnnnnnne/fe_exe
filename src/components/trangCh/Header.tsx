import { useEffect, useState, type FunctionComponent } from "react";
import { Users } from "lucide-react";
import PopAsk from "../login/PopAsk";

const Header: FunctionComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPopAskOpen, setIsPopAskOpen] = useState(false);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem("role");
    const userIdFromStorage = localStorage.getItem("userId");
    const tokenFromStorage = localStorage.getItem("accessToken");

    if (roleFromStorage && userIdFromStorage && tokenFromStorage) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isPopAskOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isPopAskOpen]);

  return (
    <header className="w-full bg-[#FFFFFFA3] shadow-md fixed z-50">
      <div className="max-w-[1400px] mx-auto px-8 h-[90px] flex items-center justify-between">
        {/* Logo chuyển về trang /h */}
        <div
          className="cursor-pointer"
          onClick={() => (window.location.href = "/h")}
        >
          <img src="logo.png" alt="logo" className="h-[70px]" />
        </div>

        <nav className="flex items-center gap-10 text-teal text-xl font-semibold">
          <a href=" " className="relative font-poppins text-teal no-underline">
            <b>Khám phá</b>
          </a>

          {isLoggedIn ? (
            <a
              href="/home"
              className="flex items-center gap-2 bg-[#04675F] hover:bg-[#03504A] text-white px-5 py-2 rounded-lg  text-xl no-underline transition-colors duration-200"
            >
              <span>Tiếp tục tìm kiếm đối tác của bạn</span>
              <Users className="w-6 h-6" stroke="currentColor" />
            </a>
          ) : (
            <>
              <a href="/login" className="relative text-teal no-underline">
                Đăng nhập
              </a>
              <button
                onClick={() => setIsPopAskOpen(true)}
                className="flex items-center gap-2 bg-[#04675F] hover:bg-[#03504A] text-white px-5 py-2 rounded-lg font-poppins text-xl no-underline transition-colors duration-200"
              >
                <span>Tham gia</span>
                <Users className="w-6 h-6" stroke="currentColor" />
              </button>
            </>
          )}
        </nav>
      </div>

      {isPopAskOpen && <PopAsk onClose={() => setIsPopAskOpen(false)} />}
    </header>
  );
};

export default Header;
