import { useState, useEffect } from "react";
import { Undo2 } from "lucide-react";
import Input from "../../../components/share/Input";
import FileUpload from "../../../components/share/FileUpload";
import FieldCheckbox from "../../../components/register/FieldCheckbox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Field {
  id: string;
  name: string;
}

export default function RegisterBusinessForm() {
  const [agree, setAgree] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "",
    description: "",
    address: "",
    businessLicense: "",
    logo: "",
    fieldIds: [] as string[],
    representativeName: "",
    representativeEmail: "",
    representativePhoneNumber: "",
  });

  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    fetch("https://localhost:7035/api/field/get-all")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res.data)) {
          setFields(res.data);
        } else {
          console.error("Dữ liệu lĩnh vực không hợp lệ:", res);
          setFields([]);
        }
      })
      .catch((err) => {
        console.error("Lỗi gọi API field:", err);
        setFields([]);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getError = (field: string) => {
    if (!showErrors) return "";
    switch (field) {
      case "email":
        if (!formData.email) return "Vui lòng nhập email";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
          return "Email không hợp lệ!";
        return "";
      case "password":
        if (!formData.password) return "Vui lòng nhập mật khẩu";
        if (formData.password.length < 6)
          return "Mật khẩu phải ít nhất 6 ký tự!";
        return "";
      case "confirmPassword":
        if (!formData.confirmPassword) return "Vui lòng xác nhận mật khẩu";
        if (formData.password !== formData.confirmPassword)
          return "Mật khẩu không khớp";
        return "";
      case "name":
        return formData.name ? "" : "Vui lòng nhập tên doanh nghiệp";
      case "address":
        return formData.address ? "" : "Vui lòng nhập địa chỉ trụ sở";
      case "representativeName":
        return formData.representativeName
          ? ""
          : "Vui lòng nhập tên người đại diện";
      case "representativeEmail":
        if (!formData.representativeEmail) return "Vui lòng nhập email";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.representativeEmail))
          return "Email không hợp lệ!";
        return "";
      case "representativePhoneNumber":
        if (!formData.representativePhoneNumber)
          return "Vui lòng nhập số điện thoại";
        if (!/^0\d{9}$/.test(formData.representativePhoneNumber))
          return "Số điện thoại phải bắt đầu bằng 0 và gồm 10 số!";
        return "";
      case "businessLicense":
        return formData.businessLicense
          ? ""
          : "Vui lòng tải lên giấy phép kinh doanh";
      case "logo":
        return formData.logo ? "" : "Vui lòng tải lên logo công ty";
      default:
        return "";
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return; // chặn bấm nhiều lần

    setIsSubmitting(true);
    setShowErrors(true);

    const hasError = [
      "email",
      "password",
      "confirmPassword",
      "name",
      "address",
      "representativeName",
      "representativeEmail",
      "representativePhoneNumber",
      "businessLicense",
      "logo",
    ].some((field) => getError(field) !== "");

    const isValid =
      formData.logo &&
      formData.businessLicense &&
      agree &&
      formData.fieldIds.length > 0 &&
      !hasError;

    if (!isValid) {
      toast.error("Vui lòng kiểm tra lại các trường thông tin.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("https://localhost:7035/api/business/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.isSuccess) {
        toast.success("Đăng ký thành công! Vui lòng đợi duyệt.");
      } else {
        toast.error(result.message || "Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối đến máy chủ!");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-lightgray min-h-screen px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl max-w-4xl mx-auto p-10 text-black font-montserrat">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-teal hover:text-teal100 font-medium mb-6 px-4 py-2 rounded-xl"
        >
          <Undo2 className="w-5 h-5 mb-0.5" />
          <span className="text-base">Trở lại</span>
        </button>

        <h1 className="text-3xl font-bold text-center mb-10 text-teal uppercase">
          FORM ĐĂNG KÍ TRỞ THÀNH DOANH NGHIỆP
        </h1>

        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4">
            1. Thông tin tài khoản đăng nhập
          </h2>
          <Input
            label="Email đăng nhập *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={getError("email")}
          />
          <Input
            label="Mật khẩu *"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={getError("password")}
          />
          <Input
            label="Xác nhận mật khẩu *"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={getError("confirmPassword")}
          />
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4">
            2. Thông tin doanh nghiệp
          </h2>
          <Input
            label="Tên doanh nghiệp *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={getError("name")}
          />
          <Input
            label="Mô tả về doanh nghiệp"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input
            label="Địa chỉ trụ sở *"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={getError("address")}
          />
          <FieldCheckbox
            fields={fields}
            selected={formData.fieldIds}
            onChange={(newIds) =>
              setFormData((prev) => ({ ...prev, fieldIds: newIds }))
            }
            showError={showErrors && formData.fieldIds.length === 0}
          />
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4">
            4. Thông tin người đại diện
          </h2>
          <Input
            label="Họ và tên *"
            name="representativeName"
            value={formData.representativeName}
            onChange={handleChange}
            error={getError("representativeName")}
          />
          <Input
            label="Chức danh người đại diện "
            name="role"
            value={formData.role}
            onChange={handleChange}
          />
          <Input
            label="Email liên hệ *"
            name="representativeEmail"
            type="email"
            value={formData.representativeEmail}
            onChange={handleChange}
            error={getError("representativeEmail")}
          />
          <Input
            label="Số điện thoại liên hệ *"
            name="representativePhoneNumber"
            value={formData.representativePhoneNumber}
            onChange={handleChange}
            error={getError("representativePhoneNumber")}
          />

          <FileUpload
            label="Giấy phép kinh doanh của doanh nghiệp *"
            onUploaded={(url) =>
              setFormData((prev) => ({ ...prev, businessLicense: url }))
            }
            error={getError("businessLicense")}
          />

          <FileUpload
            label="Logo của công ty *"
            onUploaded={(url) =>
              setFormData((prev) => ({ ...prev, logo: url }))
            }
            error={getError("logo")}
          />
        </div>

        <div className="mb-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="w-5 h-5 border border-gray-300"
          />
          <span className="text-sm">
            Tôi đồng ý với [Điều khoản sử dụng] và [Chính sách bảo mật]
          </span>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-teal text-white text-lg font-semibold py-3 rounded-xl disabled:opacity-50"
          disabled={!agree || isSubmitting}
        >
          {isSubmitting ? "Đang gửi..." : "Đăng ký"}
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
