import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Chuyên Gia Tuyển Dụng",
    desc: "Hãy tin tưởng vào người quản lý tài khoản để tìm cho bạn nhân tài phù hợp và đáp ứng mọi nhu cầu của dự án.",
  },
  {
    title: "Đảm Bảo Sự Hài Lòng",
    desc: "Booking một cách tự tin, đảm bảo hoàn lại tiền nếu giao hàng không đạt yêu cầu.",
  },
  {
    title: "Công Cụ Quản Lý Nâng Cao",
    desc: "Tích hợp người làm việc tự do một cách liền mạch vào nhóm và dự án của bạn.",
  },
  {
    title: "Mô Hình Thanh Toán Linh Hoạt",
    desc: "Thanh toán theo dự án hoặc lựa chọn mức lương theo giờ để tạo điều kiện hợp tác lâu dài.",
  },
];

const BusinessPlan = () => {
  return (
    <section className="py-10 bg-white">
      <div className="bg-[#D2E4DE] rounded-3xl px-[100px] py-16 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* LEFT CONTENT */}
          <div className="flex-1 w-full">
            <h3 className="text-xl font-semibold font-montserrat text-black">
              Influence <span className="font-bold text-teal">Pro.</span>
            </h3>
            <h2 className="text-[40px] font-bold leading-tight mt-2 mb-10 whitespace-nowrap">
              <span className="text-teal">Nâng Cấp</span> Giải Pháp Cho Doanh
              Nghiệp
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <CheckCircle className="text-green-500 w-6 h-6 shrink-0 " />
                  <div>
                    <h4 className="text-lg font-bold m-0">{item.title}</h4>
                    <p className="text-gray-700 text-sm mt-[23px]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-10 px-6 py-3 bg-teal text-white font-semibold rounded-md hover:opacity-90 transition">
              Thử Ngay
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex-1 w-full flex justify-center">
            <img
              src="https://5ac7a397a9cdce6ee24685b64d3ecb28.cdn.bubble.io/cdn-cgi/image/w=512,h=357,f=auto,dpr=1.25,fit=contain/f1736777427654x250934054490853820/d43b740d9456a4da21b20e0b984dc0ee.png"
              alt="Business Visual"
              className="rounded-xl w-[490px] h-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPlan;
