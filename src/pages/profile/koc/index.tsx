import ReviewCard from "../../../components/profile/koc/ReviewCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Headerrr from "../../../components/share/Headerrr";
import Footer from "../../../components/share/Footer";
import FileUploadAvatar from "../../../components/share/FileUploadAvatar";
import { Phone, MapPin, Pencil, Save, XCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Review {
  id: string;
  feedback: string;
  rating: number;
  businessId: string;
  createdAt?: string;
}

interface KOCProfile {
  influId: string;
  userId: string;
  name: string;
  nickName: string;
  area: string;
  follower: number;
  bio: string;
  linkImage: string;
  phoneNumber: string;
  portfolio_link: string;
  gender: number;
  dateOfBirth: string;
}

const getGenderLabel = (gender: number) => {
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

export default function ProfileKOC() {
  const { id } = useParams();
  const [koc, setKoc] = useState<KOCProfile | null>(null);
  const [editedKoc, setEditedKoc] = useState<KOCProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [currentType, setCurrentType] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [businessMap, setBusinessMap] = useState<
    Record<string, { name: string; logo: string; jobTitle: string }>
  >({});

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");

  const [reviewPage, setReviewPage] = useState(1);
  const totalPages = Math.ceil(reviews.length / 4);

  useEffect(() => {
    if (!id) return;

    fetch(`https://localhost:7035/api/review/review-of-influ/${id}`)
      .then((res) => res.json())
      .then(async (data) => {
        if (data?.isSuccess && Array.isArray(data.data)) {
          setReviews(data.data);

          const reviewList = data.data as { businessId: string }[];
          const uniqueBusinessIds: string[] = [
            ...new Set(reviewList.map((r) => r.businessId)),
          ];

          const businessMapTemp: Record<
            string,
            { name: string; logo: string; jobTitle: string }
          > = {};

          const fetchJobs = uniqueBusinessIds.map(async (bid: string) => {
            try {
              const res = await fetch(
                `https://localhost:7035/api/jobs/get-job/by-business-id/${bid}`
              );
              const json = await res.json();
              if (json?.isSuccess && Array.isArray(json.data)) {
                const job = json.data.find(
                  (j: any) => j.business?.name && j.business?.logo && j.title
                );
                if (job) {
                  businessMapTemp[bid] = {
                    name: job.business.name,
                    logo: job.business.logo,
                    jobTitle: job.title,
                  };
                }
              }
            } catch (err) {
              console.error("Lỗi fetch job:", err);
            }
          });

          await Promise.all(fetchJobs);
          setBusinessMap(businessMapTemp);
        }
      })
      .catch((err) => console.error("Lỗi tải đánh giá:", err));
  }, [id]);

  if (userId && token) {
    fetch(`https://localhost:7035/api/membership/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((mem) => {
        const userData = mem?.data?.user;
        setIsVerified(userData?.isVerified || false);
        setCurrentType(mem?.data?.membershipType?.type ?? null);
      })
      .catch((err) => console.error("Lỗi membership:", err));
  }

  const handleEdit = () => {
    setEditedKoc({ ...koc! });
    setIsEditing(true);
  };

  const handleAvatarUpload = (url: string) => {
    setEditedKoc((prev) => (prev ? { ...prev, linkImage: url } : prev));
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập hoặc token đã hết hạn.");
      return;
    }

    const payload = {
      email: "",
      nickName: editedKoc?.nickName || "",
      phoneNumber: editedKoc?.phoneNumber || "",
      follower: editedKoc?.follower || 0,
      bio: editedKoc?.bio || "",
      linkImage: editedKoc?.linkImage || "",
      portfolio_link: editedKoc?.portfolio_link || "",
      area: editedKoc?.area || "",
      linkmxh: [],
      fieldIds: [],
    };

    try {
      const res = await fetch(
        `https://localhost:7035/api/influ/update-by-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        console.warn("Không có nội dung JSON hợp lệ trả về.");
      }

      if (res.status === 401) {
        toast.error("Không có quyền cập nhật (401 Unauthorized)");
      } else if (res.ok && json?.isSuccess !== false) {
        toast.success("Cập nhật thành công!");
        setKoc(editedKoc);
        setIsEditing(false);
      } else {
        toast.error(json?.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật.");
    }
  };

  useEffect(() => {
    if (!id) return;

    fetch(`https://localhost:7035/api/influ/get-influ-by-userId/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setKoc(data.data);
      });
  }, [id]);

  if (!koc) return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-montserrat">
      <Headerrr />

      <div className="bg-white shadow-sm py-10 px-2 md:px-[200px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <FileUploadAvatar
              imageUrl={editedKoc?.linkImage}
              onUploaded={(url) =>
                setEditedKoc((prev) =>
                  prev ? { ...prev, linkImage: url } : prev
                )
              }
            />
          ) : koc.linkImage ? (
            <div
              className="relative w-[104px] h-[104px] rounded-full bg-white p-[2px]"
              style={{ boxShadow: "0 0 0 3px #3b82f6" }}
            >
              <img
                src={koc.linkImage}
                alt="avatar"
                className="w-full h-full rounded-full object-cover"
              />
              {isVerified && currentType !== null && currentType > 0 && (
                <div
                  className="absolute bottom-1 right-0.5 w-6 h-6 rounded-full bg-[#3b82f6] border-2 border-white flex items-center justify-center"
                  title={
                    currentType === 1
                      ? "Gói 1 Tháng"
                      : currentType === 2
                      ? "Gói 1 Năm"
                      : "Gói Free"
                  }
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-[#E0F2FE] flex items-center justify-center text-2xl font-bold text-[#0066CC]">
              {koc.name?.charAt(0) || "K"}
            </div>
          )}

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-sm font-medium">Tên:</label>
                <input
                  className="text-base border p-1 rounded w-full"
                  value={editedKoc?.name || ""}
                  onChange={(e) =>
                    setEditedKoc({ ...editedKoc!, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Biệt danh:</label>
                <input
                  className="text-sm border p-1 rounded w-full"
                  value={editedKoc?.nickName || ""}
                  onChange={(e) =>
                    setEditedKoc({ ...editedKoc!, nickName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Giới thiệu:</label>
                <input
                  className="text-sm border p-1 rounded w-full"
                  value={editedKoc?.bio || ""}
                  onChange={(e) =>
                    setEditedKoc({ ...editedKoc!, bio: e.target.value })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-[#065F46] uppercase mb-1">
                {koc.name}{" "}
                <span className="text-base font-normal">({koc.nickName})</span>
              </h1>
              <p className="text-sm italic text-gray-600 mt-0 mb-1">
                {koc.bio}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} /> {koc.area}
              </div>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-lightgray transition"
            >
              <XCircle size={16} /> Huỷ
            </button>
            <button
              onClick={handleSave}
              className="bg-[#065F46] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-teal100 transition"
            >
              <Save size={16} /> Lưu
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="bg-[#065F46] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-teal100 transition"
          >
            <Pencil size={16} /> Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      <div className="max-w mx-auto px-[200px] py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl md:px-10 p-4 shadow">
            <h2 className="text-lg font-semibold">Thông Tin Liên Hệ</h2>
            <div className="text-sm space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                {isEditing ? (
                  <input
                    value={editedKoc?.phoneNumber || ""}
                    onChange={(e) =>
                      setEditedKoc({
                        ...editedKoc!,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <span>{koc.phoneNumber}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="w-32">Ngày sinh:</span>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedKoc?.dateOfBirth.slice(0, 10) || ""}
                    onChange={(e) =>
                      setEditedKoc({
                        ...editedKoc!,
                        dateOfBirth: e.target.value,
                      })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <span>{`${koc.dateOfBirth.slice(
                    8,
                    10
                  )}/${koc.dateOfBirth.slice(5, 7)}/${koc.dateOfBirth.slice(
                    0,
                    4
                  )}`}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="w-32">Giới tính:</span>
                {isEditing ? (
                  <select
                    className="border p-1 rounded w-full"
                    value={editedKoc?.gender}
                    onChange={(e) =>
                      setEditedKoc({
                        ...editedKoc!,
                        gender: Number(e.target.value),
                      })
                    }
                  >
                    <option value={1}>Nam</option>
                    <option value={2}>Nữ</option>
                    <option value={3}>Giới tính khác</option>
                  </select>
                ) : (
                  <span>{getGenderLabel(koc.gender)}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="w-32">Khu vực:</span>
                {isEditing ? (
                  <input
                    value={editedKoc?.area || ""}
                    onChange={(e) =>
                      setEditedKoc({
                        ...editedKoc!,
                        area: e.target.value,
                      })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <span>{koc.area}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="w-32">Người theo dõi:</span>
                {isEditing ? (
                  <input
                    type="number"
                    value={editedKoc?.follower || 0}
                    onChange={(e) =>
                      setEditedKoc({
                        ...editedKoc!,
                        follower: Number(e.target.value),
                      })
                    }
                    className="border p-1 rounded w-full"
                  />
                ) : (
                  <span>{koc.follower.toLocaleString()}</span>
                )}
              </div>

              <div className="flex items-start gap-2">
                <span className="w-32 mt-1">Portfolio:</span>
                {isEditing ? (
                  <input
                    value={editedKoc?.portfolio_link || ""}
                    onChange={(e) =>
                      setEditedKoc({
                        ...editedKoc!,
                        portfolio_link: e.target.value,
                      })
                    }
                    className="border p-1 rounded w-full break-all"
                  />
                ) : (
                  <a
                    href={koc.portfolio_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 mt-1 underline break-all"
                  >
                    {koc.portfolio_link}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-2 space-y-6">
          <div>
            <h2 className="text-lg font-semibold mt-7 mb-4">
              Đánh giá từ doanh nghiệp
            </h2>
            {reviews.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                "Hãy nâng cấp tài khoản để xem đánh giá từ đối tác của bạn"
              </p>
            )}
          </div>

          {reviews.length > 0 && (
            <>
              {/* Hiển thị 4 review mỗi lần */}
              <div className="grid grid-cols-1 gap-6">
                {reviews
                  .slice((reviewPage - 1) * 4, reviewPage * 4)
                  .map((review) => {
                    const business = businessMap[review.businessId];
                    if (!business) return null;

                    return (
                      <ReviewCard
                        key={review.id}
                        name={business.name}
                        avatar={business.logo}
                        rating={review.rating}
                        feedback={review.feedback}
                        jobTitle={business.jobTitle}
                      />
                    );
                  })}
              </div>

              {/* Nút chuyển trang */}
              <div className="flex justify-center items-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === reviewPage;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setReviewPage(pageNum)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isActive
                          ? "bg-teal text-white font-semibold"
                          : "text-gray-700 hover:text-teal"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mt-[80px]">
        <Footer />
      </div>
    </div>
  );
}
