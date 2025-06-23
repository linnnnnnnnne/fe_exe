import { useEffect, useState, useRef } from "react";
import { TrendingUp, CircleArrowRight, CircleArrowLeft } from "lucide-react";

const jobs = [
  {
    title: "Mẫu Ảnh",
    image:
      "https://t4.ftcdn.net/jpg/05/88/78/59/360_F_588785999_373kOG8Fg8txf6frAr8t3WGIfCbDRZWw.jpg",
  },
  {
    title: "Review Sản Phẩm",
    image:
      "https://mia.vn/media/uploads/images/1557397036-vali-keo-nhat-ban-3.jpg",
  },
  {
    title: "Live Stream",
    image:
      "https://livestream.com.vn/wp-content/uploads/2023/03/livestream-settop2.jpg",
  },
  {
    title: "Chỉnh Sửa Video",
    image:
      "https://vbee.vn/blog/wp-content/uploads/2024/03/website-chinh-sua-video.webp",
  },
  {
    title: "Review Đồ Ăn/Ẩm Thực",
    image:
      "https://accesstrade.vn/wp-content/uploads/2023/03/food-reviewer-1.jpg",
  },
  {
    title: "MC/Host sự kiện online",
    image:
      "https://danaskills.edu.vn/upload/cach-thuc-len-kich-ban-talk-show-chuyen-nghiep.jpg",
  },
  {
    title: "Content Creator TikTok/Shorts/Reels",
    image:
      "https://assets-static.invideo.io/images/large/7_1eca727678.png",
  },
  {
    title: "Game Streamer",
    image:
      "https://cdn.tgdd.vn/Files/2018/11/21/1132768/streamer-viruss_800x450.jpg",
  },
  {
    title: "Beauty Blogger/Makeup Artist",
    image:
      "https://chaubui.net/wp-content/uploads/2022/06/5-buoc-de-mot-KOL_KOC-co-the-tiep-can-nhan-hang.png",
  },
  {
    title: "Fashion Influencer",
    image:
      "https://media.glamourmagazine.co.uk/photos/67f4e3aa7b2ff8827ab4d015/16:9/w_1920,h_1080,c_limit/FASHION%20ACCOUNTS%20TO%20FOLLOW%20080425%20MAIN.jpg",
  },
];

const PopularJobs = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = 300; // width (px) của 1 card, cần khớp Tailwind bên dưới
  const gap = 54;
  const maxIndex = jobs.length - 4; // vì hiển thị 4 cards

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <section className="bg-white py-20 relative">
      <div className="max-w-[1362px] mx-auto px-4">
        <h2 className="text-4xl font-bold text-teal flex items-center gap-3 mb-14">
          CÔNG VIỆC PHỔ BIẾN
          <TrendingUp className="w-8 h-8" />
        </h2>

        <div className="relative">
          {/* Left Button */}
          <button
            onClick={handlePrev}
            className="absolute left-[-25px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-teal hover:text-white transition"
          >
            <CircleArrowLeft className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div className="overflow-hidden">
            <div
              ref={containerRef}
              className="flex transition-transform duration-500"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
              }}
            >
              {jobs.map((job, index) => (
                <div
                  key={index}
                  className="min-w-[300px] mr-[54px] last:mr-0 rounded-[32px] overflow-hidden shadow-md relative group"
                >
                  <img
                    src={job.image}
                    alt={job.title}
                    className="w-full h-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute bottom-5 left-5 right-5 text-white font-semibold text-lg z-10">
                    {job.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Button */}
          <button
            onClick={handleNext}
            className="absolute right-[-25px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow flex items-center justify-center hover:bg-teal hover:text-white transition"
          >
            <CircleArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Indicator (optional) */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: jobs.length - 3 }).map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition ${
                idx === currentIndex ? "bg-teal" : "bg-gray-300"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularJobs;
