import { X, Star } from "lucide-react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Props {
  influencer: {
    influAvatar: string;
    influName: string;
    jobId?: string; // dùng khi type === "influ"
    freelanceJobId?: string; // dùng khi type === "business"
  };
  accessToken: string;
  onClose: () => void;
  onReviewed?: () => void;
  type?: "business" | "influ"; // "influ" = business → influencer, "business" = influencer → business
}

export default function ReviewPopup({
  influencer,
  accessToken,
  onClose,
  onReviewed,
  type = "influ",
}: Props) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập!");
      return;
    }

    const endpoint =
      type === "business"
        ? "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/review/influ-review-business"
        : "https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/review/business-review-influ";

    const body =
      type === "business"
        ? {
            freelanceJobId: influencer.freelanceJobId,
            feedback: comment,
            rating: rating,
          }
        : {
            jobId: influencer.jobId,
            feedback: comment,
            rating: rating,
          };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });

      console.log("DATA SENT:", body);

      const data = await res.json();

      if (res.ok && data?.isSuccess) {
        toast.success("Đã gửi đánh giá thành công!");
        if (onReviewed) onReviewed();
        setTimeout(() => onClose(), 1500);
      } else {
        toast.warning(data.message || "Không thể gửi đánh giá.");
      }
    } catch (err) {
      toast.error("Lỗi khi kết nối tới máy chủ.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 font-montserrat">
      <div className="bg-white w-[400px] rounded-xl p-6 shadow-xl relative">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar
          closeOnClick
          draggable
          pauseOnHover
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {type === "business" ? "Đánh giá Business" : "Đánh giá Influencer"}
          </h2>
          <X
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={onClose}
          />
        </div>

        {/* Avatar + Tên */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={influencer.influAvatar}
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />
          <span className="font-semibold text-base text-gray-800">
            {influencer.influName}
          </span>
        </div>

        {/* Chọn sao */}
        <div className="flex justify-between w-full max-w-[260px] mx-auto mb-3">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoverRating || rating);
            return (
              <Star
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                stroke="#f59e0b"
                fill={isActive ? "#f59e0b" : "none"}
                className="w-8 h-8 cursor-pointer"
              />
            );
          })}
        </div>

        {/* Nhận xét */}
        <div className="mb-5">
          <label className="block text-sm text-gray-700 mb-1">Nhận xét:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="bg-lightgray rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal"
            rows={4}
            placeholder="Nhận xét của bạn..."
            style={{ width: "100%", maxWidth: 375 }}
          />
        </div>

        {/* Gửi */}
        <button
          onClick={handleSubmit}
          className="w-full bg-teal text-white font-semibold py-2 rounded-lg hover:bg-teal-700 transition"
        >
          Gửi đánh giá
        </button>
      </div>
    </div>
  );
}
