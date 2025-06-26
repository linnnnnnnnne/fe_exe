import { useEffect, useState, useCallback } from "react";
import { Undo2 } from "lucide-react";
import InfoFields from "../../../components/register/InfoFields";
import { createInflu } from "../../../api/influ";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const genderMap = {
  male: 1,
  female: 2,
  other: 3,
};

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
  name: "",
  gender: "",
  nickName: "",
  dateOfBirth: "",
  phoneNumber: "",
  follower: 0,
  bio: "",
  cccd: "",
  linkImage: "",
  portfolio_link: "",
  area: "",
  facebook: "",
  instagram: "",
  tiktok: "",
  fieldIds: [],
};

export default function RegisterKOCForm() {
  const [agree, setAgree] = useState(false);
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [showErrors, setShowErrors] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/field/get-all")
      .then((res) => res.json())
      .then((data) => setFields(data.data))
      .catch((err) => console.error("Failed to fetch fields:", err));
  }, []);

const isValidForm = () => {
  const requiredFields = [
    "email",
    "password",
    "confirmPassword",
    "cccd",
    "name",
    "nickName",
    "dateOfBirth",
    "gender",
    "phoneNumber",
    "linkImage",
    "portfolio_link",
  ];

  const allFilled = requiredFields.every((key) => (formData as any)[key]);
  const hasSelectedField = formData.fieldIds.length > 0;
  const hasSocial = formData.facebook || formData.instagram || formData.tiktok;
  const passwordMatch = formData.password === formData.confirmPassword;
  const passwordLengthValid = formData.password.length >= 6;
  const validPhone = /^0\d{9}$/.test(formData.phoneNumber);
  const validEmail = /^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
    formData.email
  );

  return (
    allFilled &&
    hasSocial &&
    passwordMatch &&
    passwordLengthValid &&
    validPhone &&
    validEmail &&
    hasSelectedField
  );
};


  const handleSubmit = useCallback(async () => {
    if (!isValidForm()) {
      console.log("Form không hợp lệ", formData);
      setShowErrors(true);

      toast.warning("Vui lòng kiểm tra lại các thông tin đã nhập!", {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
      });

      return;
    }

    try {
      const payload = {
        ...formData,
        gender: genderMap[formData.gender as keyof typeof genderMap] || 3,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
        follower: Number(formData.follower) || 0,
        linkmxh: [
          formData.facebook,
          formData.instagram,
          formData.tiktok,
        ].filter(Boolean),
      };

      delete (payload as any).confirmPassword;
      delete (payload as any).facebook;
      delete (payload as any).instagram;
      delete (payload as any).tiktok;

      await createInflu(payload);

      toast.success(
        "Tài khoản của bạn đã được tạo thành công. Vui lòng chờ duyệt!"
      );
    } catch (err: any) {
      toast.error(err.message || "Đăng ký thất bại, vui lòng thử lại!");
    }
  }, [formData]);

  return (
    <div className="bg-lightgray min-h-screen px-4 py-10">
      <div className="bg-white shadow-xl rounded-2xl max-w-4xl mx-auto p-10 text-black font-montserrat">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-teal hover:text-teal100 font-medium mb-6 px-4 py-2 rounded-xl"
        >
          <Undo2 className="w-5 h-5" />
          <span className="text-base">Trở lại</span>
        </button>

        <h1 className="text-3xl font-bold text-center mb-10 text-teal">
          FORM ĐĂNG KÍ TRỞ THÀNH KOC
        </h1>

        <InfoFields
          today={today}
          fields={fields}
          formData={formData}
          setFormData={setFormData}
          showErrors={showErrors}
        />

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
          className="w-full bg-teal text-white text-lg font-semibold py-3 rounded-xl disabled:opacity-50"
          disabled={!agree}
          onClick={handleSubmit}
        >
          Đăng kí
        </button>

        {/* Toast container */}
        <ToastContainer
          position="top-right"
          autoClose={false}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </div>
  );
}
