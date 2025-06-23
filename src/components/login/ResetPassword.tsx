import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPassword({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(""); // đây là mã xác minh
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [step, setStep] = useState<"email" | "verify" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      toast.warning("Vui lòng nhập email để đặt lại mật khẩu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/user/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok && data.isSuccess) {
        toast.success("Mã xác minh đã được gửi. Vui lòng kiểm tra email.");
        setStep("verify");
      } else {
        toast.error(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTokenSubmit = () => {
    if (!token.trim()) {
      toast.warning("Vui lòng nhập mã xác minh.");
      return;
    }

    setStep("reset");
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      toast.warning("Vui lòng nhập mật khẩu mới.");
      return;
    }

    if (newPassword.length < 6) {
      toast.warning("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (confirmPassword !== newPassword) {
      toast.warning("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/user/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await res.json();

      if (res.ok && data.isSuccess) {
        toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập.");
        onClose();
      } else {
        toast.error(data.message || "Không thể đặt lại mật khẩu.");
      }
    } catch {
      toast.error("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setResending(true);
    // Gửi lại dùng lại forgot-password
    fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/user/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then(() => {
        toast.success("Mã xác minh đã được gửi lại.");
        setResending(false);
      })
      .catch(() => {
        toast.error("Không thể gửi lại mã.");
        setResending(false);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 font-montserrat">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative text-center shadow-lg">
        <button
          className="absolute top-3 right-3 text-2xl z-10 w-10 h-10 rounded-full transition hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>

        {step === "email" && (
          <>
            <h2 className="text-3xl font-bold text-teal mb-4">
              Thiết lập lại mật khẩu
            </h2>
            <p className="text-gray-600 mb-7">Nhập email để nhận mã xác minh</p>
            <input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[370px] p-4 bg-indigo-50 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition box-border"
            />
            <button
              onClick={handleEmailSubmit}
              disabled={isSubmitting}
              className={`mb-4 px-6 py-4 rounded-lg w-[370px] transition text-white ${
                isSubmitting
                  ? "bg-teal200 cursor-not-allowed"
                  : "bg-teal hover:bg-teal200"
              }`}
            >
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <h2 className="text-3xl font-bold text-teal mb-0">
              Nhập mã xác minh
            </h2>
            <p className="text-gray-600 mb-7 p-3">
              Vui lòng kiểm tra email <strong>{email}</strong> để lấy mã
            </p>
            <input
              type="text"
              placeholder="Mã xác minh"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-[400px] p-4 bg-indigo-50 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition box-border"
            />
            <button
              onClick={handleTokenSubmit}
              className="bg-teal mb-3 text-white px-6 py-4 rounded-lg w-[400px] hover:bg-teal-700 transition"
            >
              Tiếp tục
            </button>
            <button
              onClick={handleResendCode}
              disabled={resending}
              className="text-sm text-teal font-semibold bg-transparent hover:underline mt-2 mb-2 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {resending ? "Đang gửi lại..." : "Gửi lại mã"}
            </button>
          </>
        )}

        {step === "reset" && (
          <>
            <h2 className="text-3xl font-bold text-teal mb-4">
              Đặt lại mật khẩu
            </h2>
            <p className="text-gray-600 mb-7">Nhập mật khẩu mới của bạn</p>

            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-[400px] p-4 bg-indigo-50 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition box-border"
            />

            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (newPassword && e.target.value !== newPassword) {
                  setPasswordError("Mật khẩu xác nhận không khớp.");
                } else {
                  setPasswordError("");
                }
              }}
              className={`w-[400px] p-4 bg-indigo-50 rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition box-border ${
                passwordError ? "ring-2 ring-red-400" : "focus:ring-teal-500"
              }`}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mb-4 mt-0">{passwordError}</p>
            )}
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="bg-teal mb-4 text-white px-6 py-4 rounded-lg w-[400px] hover:bg-teal-700 transition"
            >
              {loading ? "Đang đặt lại..." : "Xác nhận"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
