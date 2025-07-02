import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Headerrr from "../share/Headerrr";
import Footer from "../share/Footer";
import { Phone, MapPin } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import ActivityStats from "../share/ActivityStats";
import ReviewCard from "../../components/profile/koc/ReviewCard";

interface Review {
  id: string;
  businessId: string;
  rating: number;
  feedback: string;
  influId: string;
}

export default function InfluDetail() {
  const { state } = useLocation();
  const data = state?.influencer;

  const [currentType, setCurrentType] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessMap, setBusinessMap] = useState<
    Record<string, { name: string; logo: string; jobTitle: string }>
  >({});
  const [reviewPage, setReviewPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / 4);

  const viewerId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!viewerId || !token) return;

    fetch(`https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/membership/user/${viewerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((mem) => {
        setCurrentType(mem?.data?.membershipType?.type ?? null);
      })
      .catch((err) => console.error("Lỗi membership:", err));
  }, [viewerId, token]);

  useEffect(() => {
    if (!data?.influId || !token) return;

    fetch(`https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/review/review-of-influ/${viewerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res?.isSuccess && Array.isArray(res.data)) {
          const reviewList = res.data as Review[];
          const filtered = reviewList.filter(r => r.influId === data.influId);
          setReviews(filtered);

          const uniqueBusinessIds = [
            ...new Set(filtered.map((r) => r.businessId)),
          ];

          const tempMap: Record<
            string,
            { name: string; logo: string; jobTitle: string }
          > = {};

          await Promise.all(
            uniqueBusinessIds.map(async (bid: string) => {
              const jobRes = await fetch(
                `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/jobs/get-job/by-business-id/${bid}`
              );
              const jobJson = await jobRes.json();
              if (jobJson?.isSuccess && Array.isArray(jobJson.data)) {
                const job = jobJson.data.find(
                  (j: any) => j.business?.name && j.business?.logo && j.title
                );
                if (job) {
                  tempMap[bid] = {
                    name: job.business.name,
                    logo: job.business.logo,
                    jobTitle: job.title,
                  };
                }
              }
            })
          );

          setBusinessMap(tempMap);
        }
      })
      .catch((err) => console.error("Lỗi lấy review:", err));
  }, [data?.userId, data?.influId, token]);

  const getGenderLabel = (gender: number | undefined) => {
    switch (gender) {
      case 1:
        return "Nam";
      case 2:
        return "Nữ";
      case 3:
        return "Giới tính khác";
      default:
        return "Không rõ";
    }
  };

  if (!data) {
    return (
      <p className="text-center text-red-500 mt-20">
        Không có dữ liệu Influencer
      </p>
    );
  }

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-montserrat">
      <Headerrr />

      <div className="bg-white shadow py-10 px-2 md:px-[200px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-[104px] h-[104px] rounded-full bg-white p-[2px]"
            style={{ boxShadow: "0 0 0 3px #3b82f6" }}
          >
            <img
              src={data.linkImage || "/default-avatar.png"}
              alt="avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#065F46] uppercase mb-1">
              {data.name}
              <span className="text-base font-normal"> ({data.nickName})</span>
            </h1>
            <p className="text-sm italic text-gray-600 mt-0 mb-1">{data.bio}</p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} /> {data.area}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w mx-auto px-[200px] py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl md:px-10 p-4 shadow">
            <h2 className="text-lg font-semibold">Thông Tin Liên Hệ</h2>
            <div className="text-sm space-y-2 mb-4 text-gray-800">
              <div className="flex items-center gap-2">
                <Phone size={16} /> {data.phoneNumber || "Không có"}
              </div>
              <div>
                <strong>Ngày sinh:</strong>{" "}
                {data.dateOfBirth && !isNaN(Date.parse(data.dateOfBirth))
                  ? new Date(data.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Không có"}
              </div>
              <div>
                <strong>Giới tính:</strong> {getGenderLabel(data.gender)}
              </div>
              <div>
                <strong>Khu vực:</strong> {data.area || "Không rõ"}
              </div>
              <div>
                <strong>Người theo dõi:</strong>{" "}
                {data.follower?.toLocaleString() || "Không có"}
              </div>
              <div>
                <strong>Portfolio:</strong>{" "}
                {data.portfolio_link ? (
                  <a
                    href={data.portfolio_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline break-all"
                  >
                    {data.portfolio_link}
                  </a>
                ) : (
                  "Không có"
                )}
              </div>
              <div className="flex gap-4 items-center pt-1">
                {[FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaWhatsapp].map(
                  (Icon, idx) => {
                    const platform = [
                      "facebook",
                      "instagram",
                      "youtube",
                      "tiktok",
                      "whatsapp",
                    ][idx];
                    const link = data.linkmxh?.find((url: string) =>
                      url.toLowerCase().includes(platform)
                    );
                    return (
                      link && (
                        <a
                          key={platform}
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          title={platform}
                          className="text-teal hover:text-teal-600"
                        >
                          <Icon size={24} />
                        </a>
                      )
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {data.jobs && data.jobs.length > 0 && (
            <ActivityStats
              jobs={data.jobs}
              reviews={reviews}
              getStatusLabel={(status) => {
                switch (status) {
                  case 0:
                    return "Đang chờ duyệt";
                  case 1:
                    return "Đang thực hiện";
                  case 2:
                    return "Hoàn thành";
                  default:
                    return "Không xác định";
                }
              }}
            />
          )}

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Đánh giá từ doanh nghiệp
            </h2>
            {!currentType || currentType <= 0 ? (
              <p className="text-sm text-gray-500 italic">
                Hãy nâng cấp tài khoản để xem đánh giá từ đối tác
              </p>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Hiện tại chưa có đánh giá nào.
              </p>
            ) : (
              <>
                <div className="space-y-4">
                  {reviews
                    .slice((reviewPage - 1) * 4, reviewPage * 4)
                    .map((review: Review) => {
                      const business = businessMap[review.businessId];
                      if (!business) return null;
                      return (
                        <div
                          key={review.id}
                          className="p-4 rounded-xl border border-gray-300 shadow bg-[#F0FAFA]"
                        >
                          <ReviewCard
                            name={business.name}
                            avatar={business.logo}
                            rating={review.rating}
                            feedback={review.feedback}
                            jobTitle={business.jobTitle}
                          />
                        </div>
                      );
                    })}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-4">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setReviewPage(pageNum)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                            pageNum === reviewPage
                              ? "bg-teal text-white font-semibold"
                              : "text-gray-700 hover:text-teal"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-[80px]">
        <Footer />
      </div>
    </div>
  );
}