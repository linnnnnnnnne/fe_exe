import { useEffect, useState } from "react";

interface TopInfluencerProps {
  onHighlight?: (influ: any) => void;
}

const getOffsetImage = (base: number, offset: number, images: string[]) => {
  const len = images.length;
  return images[(base + offset + len) % len];
};

export default function TopInfluencer({ onHighlight }: TopInfluencerProps) {
  const [index, setIndex] = useState(0);
  const [showCarousel, setShowCarousel] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);

  useEffect(() => {
    const fetchMembershipInfluencers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return;

        const res = await fetch(
          "https://localhost:7035/api/membership/influencers",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const data = await res.json();
        if (res.ok && data?.isSuccess && Array.isArray(data.data)) {
          const userIds = data.data.map((item: any) => item.userId);

          const imagePromises = userIds.map(async (userId: string) => {
            const res = await fetch(
              `https://localhost:7035/api/influ/get-influ-by-userId/${userId}`
            );
            const json = await res.json();
            if (json?.isSuccess && json.data?.linkImage) {
              return json.data.linkImage;
            }
            return null;
          });

          const images = (await Promise.all(imagePromises)).filter(Boolean);
          if (images.length > 0) {
            setImageList(images);
            setShowCarousel(true);
          }
        }
      } catch (err) {
        console.error("Lỗi fetch top influencers:", err);
      }
    };

    fetchMembershipInfluencers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imageList.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [imageList]);

  const handleClick = async () => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role"); // "Business" hoặc "Freelancer"

    if (!userId || !accessToken || !role) return;

    try {
      const res = await fetch(
        `https://localhost:7035/api/membership/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const data = await res.json();

      if (res.ok && data?.isSuccess && data?.data) {
        const infoRes = await fetch(
          `https://localhost:7035/api/influ/get-influ-by-userId/${userId}`
        );
        const infoJson = await infoRes.json();

        if (infoJson?.isSuccess && infoJson.data) {
          const influ = infoJson.data;

          // Fetch thêm fieldNames
          let fieldNames: string[] = [];
          try {
            const fieldRes = await fetch(
              `https://localhost:7035/api/field/get-all-field-of-influ/${influ.influId}`
            );
            const fieldJson = await fieldRes.json();
            if (fieldJson.isSuccess && Array.isArray(fieldJson.data)) {
              fieldNames = fieldJson.data.map((f: any) => f.name);
            }
          } catch {}

          onHighlight?.({
            userId: influ.userId,
            name: influ.name,
            nickName: influ.nickName || "Influencer",
            description: influ.bio || "Không có",
            followers: influ.follower?.toLocaleString("vi-VN") || "0",
            area: influ.area || "Không rõ",
            linkImage: influ.linkImage || "",
            fieldNames,
          });
        }
      } else {
        if (role === "Business") {
          window.location.href = "/upgrade_business";
        } else if (role === "Freelancer") {
          window.location.href = "/upgrade_koc";
        } else {
          alert("Không xác định được vai trò người dùng.");
        }
      }
    } catch (err) {
      console.error("Lỗi kiểm tra membership:", err);
    }
  };

  if (!showCarousel || imageList.length === 0) return null;

  return (
    <section className="w-full relative flex flex-col items-center font-montserrat pt-6">
      <h1 className="text-3xl font-bold text-teal mb-8">TOP INFLUENCER</h1>
      <div className="flex justify-center items-center w-full max-w-7xl gap-2 relative">
        {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
          const src = getOffsetImage(index, offset, imageList);
          const baseClass =
            "object-cover rounded-xl transition-all duration-500 ease-in-out";
          const sizeClass =
            {
              "-3": "w-[130px] h-[120px] opacity-30 scale-90 shadow-lg",
              "-2": "w-[210px] h-[180px] opacity-50 shadow-lg",
              "-1": "w-[280px] h-[250px] opacity-70 shadow-lg",
              "0": "w-[380px] h-[320px] opacity-100 z-10 shadow-lg",
              "1": "w-[280px] h-[250px] opacity-70 shadow-lg",
              "2": "w-[210px] h-[180px] opacity-50 shadow-lg",
              "3": "w-[130px] h-[120px] opacity-30 scale-90 shadow-lg",
            }[offset.toString()] || "";

          return (
            <img
              key={offset}
              src={src}
              alt={`Influencer ${offset}`}
              className={`${baseClass} ${sizeClass}`}
            />
          );
        })}

        <div className="absolute h-[170px] w-[265px] left-[-80px] top-1/2 -translate-y-1/2 z-20 text-white bg-gradient-to-r from-[rgba(13,148,136,0.5)] to-[rgba(13,148,136,0.01)] px-4 py-2 rounded-lg backdrop-blur-sm">
          <h3 className="font-bold text-2xl mt-7 mb-3 drop-shadow-[2px_2px_3px_rgba(0,0,0,0.7)]">
            HỒ SƠ NỔI BẬT
          </h3>
          <p className="text-sm mt-0 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.6)]">
            Trả phí để xuất hiện
          </p>
          <button
            onClick={handleClick}
            className="mt-3 px-5 py-2 text-sm bg-teal100 hover:bg-teal200 text-white rounded-lg drop-shadow-lg"
          >
            Tại Đây
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-10">
        {imageList.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-2 rounded-full ${
              i === index ? "bg-teal100" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </section>
  );
}
