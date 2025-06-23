"use client";
import { useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import FileUpload from "../../components/share/FileUpload";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Membership {
  id: string;
  type: number;
  price: number;
  name: string;
}

interface Plan {
  id: string;
  type: number;
  name: string;
  price: string;
  benefits: string[];
}

const planDescriptions: Record<number, { name: string; benefits: string[] }> = {
  0: {
    name: "Gói Free",
    benefits: [
      "Tạo hồ sơ cơ bản (ảnh, lĩnh vực, kênh hoạt động)",
      "Nhận tin nhắn từ doanh nghiệp",
      "Theo dõi các cơ hội tuyển chọn mở",
    ],
  },
  1: {
    name: "Gói 1 Tháng",
    benefits: [
      "Hiển thị hồ sơ nổi bật & xuất hiện trong kết quả tìm kiếm ưu tiên",
      "Truy cập điểm Reliability Score & lịch sử hợp tác",
      "Tham gia chương trình hỗ trợ phát triển thương hiệu cá nhân (mentorship, cộng đồng)",
      "Nhận đề xuất chiến dịch phù hợp tự động",
    ],
  },
  2: {
    name: "Gói 1 Năm",
    benefits: [
      "Bao gồm tất cả quyền lợi gói 1 tháng",
      "Ưu tiên nhận chiến dịch độc quyền từ doanh nghiệp lớn",
      "Nhận thư giới thiệu từ InfluenceHub nếu có yêu cầu hợp tác brand lớn",
    ],
  },
};

export default function PlanKOC() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentImage, setPaymentImage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentType, setCurrentType] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(
          "https://localhost:7035/api/MembershipType/Get-all-membershiptype-kol"
        );
        const data: Membership[] = await res.json();

        const mappedPlans: Plan[] = data.map((item) => ({
          id: item.id,
          type: item.type,
          name: planDescriptions[item.type]?.name ?? item.name,
          price:
            item.price === 0
              ? "0Đ"
              : new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                  .format(item.price)
                  .replace("₫", "Đ"),
          benefits: planDescriptions[item.type]?.benefits ?? [],
        }));

        const sortedPlans = [0, 1, 2]
          .map((type) => mappedPlans.find((plan) => plan.type === type))
          .filter(Boolean) as Plan[];

        setPlans(sortedPlans);
      } catch (error) {
        toast.error("Lỗi khi tải gói KOC!");
        console.error(error);
      }
    };

    const fetchMembershipInfo = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("accessToken");

      if (!userId || !token) return;

      try {
        const res = await fetch(
          `https://localhost:7035/api/membership/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const json = await res.json();
        setIsVerified(json.data?.user?.isVerified || false);
        setCurrentType(json.data?.membershipType?.type ?? null);
      } catch (error) {
        console.error("Lỗi khi lấy Membership:", error);
      }
    };

    fetchPlans();
    fetchMembershipInfo();
  }, []);

  const handleUpgrade = async () => {
    if (!selectedPlan || !paymentImage) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Không tìm thấy tài khoản người dùng.");
      return;
    }

    const body = {
      userId,
      membershipTypeId: selectedPlan.id,
      paymentImageLink: paymentImage,
    };

    try {
      setIsSubmitting(true);
      const res = await fetch(
        "https://localhost:7035/api/MembershipRegistration/register-membership",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const resultText = await res.text();
      console.log("Server response:", resultText);

      if (!res.ok) {
        toast.error("Đăng ký thất bại!");
        return;
      }

      toast.success(
        "Đăng ký gói thành công! Vui lòng chờ Admin kiểm tra và sẽ nâng cấp giúp bạn lên PRO."
      );
      setSelectedPlan(null);
      setPaymentImage("");
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error("Lỗi khi gửi đăng ký!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 px-4 flex flex-col items-center font-montserrat">
      <h1 className="text-3xl font-bold text-teal mb-12">
        NÂNG CẤP TÀI KHOẢN KOC & KOL
      </h1>
      <div className="flex flex-col lg:flex-row gap-12 justify-center items-stretch w-full max-w-6xl">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`
              flex-1 bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.10)] p-6 flex flex-col justify-between
              transition-transform duration-300 hover:scale-[1.15] hover:shadow-[0_8px_24px_rgba(0,0,0,0.20)]
              ${plan.type === 1 ? "scale-[1.05] shadow-lg" : ""}
            `}
          >
            <div>
              <div className="text-center">
                <h2 className="text-4xl font-bold text-teal mt-5 mb-0">
                  {plan.name}
                </h2>
                <p className="text-3xl font-bold text-teal mt-3 mb-2">
                  {plan.price}
                </p>
              </div>

              <ul className="text-gray-700 space-y-2 text-sm m-0 p-5">
                {plan.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 leading-relaxed"
                  >
                    <CircleCheck className="w-4 h-4 text-teal mt-[2px] shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {isVerified && plan.type === currentType ? (
              <button
                className="mt-2 mb-2 bg-lightgreen text-gray-600 text-[15px] py-3 rounded-md cursor-not-allowed"
                disabled
              >
                Gói hiện tại của bạn
              </button>
            ) : (
              <button
                onClick={() => setSelectedPlan(plan)}
                className="mt-2 mb-2 bg-teal text-white text-[15px] py-3 rounded-md hover:bg-teal200 transition"
              >
                Nâng cấp
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal đăng ký */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-6xl h-[80vh] flex shadow-xl overflow-hidden relative">
            <button
              onClick={() => {
                setSelectedPlan(null);
                setPaymentImage("");
              }}
              className="absolute top-3 right-3 text-2xl z-10 w-10 h-10 rounded-full transition hover:bg-gray hover:text-red-500"
              aria-label="Đóng"
            >
              ×
            </button>

            <div className="w-1/2 h-full">
              <img
                src="/qr.jpg"
                alt="Chuyển khoản"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-1/2 h-full p-3 flex flex-col gap-6 overflow-y-auto">
              <div>
                <h2 className="text-2xl font-bold text-teal mb-4">
                  {selectedPlan.name}
                </h2>
                <p className="text-xl font-semibold text-gray-800 mb-2">
                  Giá: {selectedPlan.price}
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {selectedPlan.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>

                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Tải ảnh chuyển khoản:
                  </p>
                  <FileUpload
                    label="Ảnh chuyển khoản *"
                    onUploaded={(link) => setPaymentImage(link)}
                  />
                  {paymentImage && (
                    <p className="text-green-600 text-sm mt-2">
                      Đã tải ảnh thành công.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={handleUpgrade}
                  className="px-6 py-3 bg-teal text-white rounded hover:bg-teal200 disabled:opacity-50"
                  disabled={!paymentImage || isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Xác nhận đăng ký"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={false} />
    </section>
  );
}
