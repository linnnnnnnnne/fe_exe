import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PasswordInput } from "./Pass";
import PopAsk from "./PopAsk";
import ResetPassword from "./ResetPassword";
import { jwtDecode } from "jwt-decode";

interface DecodedJWT {
  [key: string]: any;
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopAsk, setShowPopAsk] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const validateInputs = () => {
    let valid = true;
    if (!email) {
      toast.error("Vui lòng nhập email", {
        position: "bottom-left",
        autoClose: 5000,
      });
      valid = false;
    }
    if (!password) {
      toast.error("Vui lòng nhập mật khẩu", {
        position: "bottom-left",
        autoClose: 5000,
      });
      valid = false;
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      console.log("Server response:", data);

      if (data.isSuccess === false || data.businessCode === 404) {
        const msg = data.message?.toLowerCase() || "";

        if (msg.includes("chưa được admin phê duyệt")) {
          toast.info(
            "Tài khoản chưa được duyệt!!! Vui lòng chờ admin duyệt hồ sơ của bạn.",
            { position: "bottom-left", autoClose: 5000 }
          );
          return;
        } else if (msg.includes("not verified")) {
          toast.warning(
            "Tài khoản chưa xác minh. Vui lòng kiểm tra hộp thư gmail.",
            { position: "bottom-left", autoClose: 5000 }
          );
          setTimeout(() => {
            window.open("https://mail.google.com", "_blank");
          }, 2500);
        } else if (msg.includes("email") || msg.includes("mật khẩu")) {
          toast.error(data.message || "Email hoặc mật khẩu không đúng.", {
            position: "bottom-left",
            autoClose: 5000,
          });
        } else {
          toast.error("Đăng nhập thất bại. Vui lòng thử lại.", {
            position: "bottom-left",
            autoClose: 5000,
          });
        }
        return;
      }

      // Thành công
      const accessToken = data.data.accessToken;
      const decoded: DecodedJWT = jwtDecode(accessToken);
      console.log("Decoded JWT:", decoded);

      const role =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || "";

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("userId", data.data.userId);
      localStorage.setItem("influId", data.data.influId || "");
      localStorage.setItem("businessId", data.data.businessId || "");
      localStorage.setItem("role", role); // ⬅ "Admin", "Business", "Freelancer".

      if (role === "Admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/home";
      }
    } catch (err) {
      toast.error("Không thể kết nối tới máy chủ. Vui lòng thử lại sau.", {
        position: "bottom-left",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      {showPopAsk && <PopAsk onClose={() => setShowPopAsk(false)} />}
      {showResetPassword && (
        <ResetPassword onClose={() => setShowResetPassword(false)} />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
        className="flex flex-col w-full text-base font-montserrat text-teal"
      >
        <h1 className="text-3xl font-bold text-teal mt-0 mb-2">Đăng nhập</h1>

        <div className="flex flex-col mb-2">
          <input
            type="email"
            name="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-7 py-6 text-base bg-indigo-50 rounded-lg"
            required
          />
        </div>

        <div className="flex flex-col mb-2">
          <PasswordInput password={password} setPassword={setPassword} />
        </div>

        <button
          type="button"
          onClick={() => setShowResetPassword(true)}
          className="self-end mt-4 text-sm text-darkgray bg-white"
        >
          Quên mật khẩu?
        </button>

        <button
          type="submit"
          disabled={loading}
          className="py-6 mt-7 font-montserrat text-white bg-teal rounded-lg text-[18px] hover:bg-teal-700 transition"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <p className="self-start mt-6 mb-2 text-teal">
          Nếu bạn không có tài khoản hãy đăng ký
        </p>

        <p className="self-start">
          <span className="text-teal">Bạn có thể đăng ký </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setShowPopAsk(true);
            }}
            className="font-bold text-teal no-underline cursor-pointer"
          >
            tại đây!
          </a>
        </p>
      </form>
    </>
  );
}
