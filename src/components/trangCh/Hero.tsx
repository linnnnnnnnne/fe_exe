import { Search } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-[100px] bg-[#8BB5B1] text-darkslategray-900 relative">
      <div className="max-w-[1440px] mx-auto px-10 flex flex-col lg:flex-row items-center">
        <div className="flex-1 space-y-6 translate-x-[90px] -translate-y-[20px]">
          <h1 className="text-[48px] lg:text-[64px] font-bold leading-tight">
            <div className="relative w-full flex flex-col items-start justify-start gap-[25px] text-left text-8xl text-white font-montserrat">
              <div className="relative capitalize font-buthick text-teal">
                Influencehub
              </div>
              <div className="relative text-[90px] capitalize font-extrabold [transform:_rotate(0.3deg)]">
                <p className="m-0">bạn là KOC</p>
                <p className="m-0">muốn tìm Việc</p>
              </div>
              <div className="relative text-5xl capitalize font-semibold [transform:_rotate(0.3deg)]">
                hãy để chúng tôi giúp bạn!
              </div>
            </div>
          </h1>
          <div className="flex bg-white rounded-lg overflow-hidden w-full max-w-[620px] h-[50px] shadow">
            <input
              type="text"
              placeholder="Tìm kiếm công việc phù hợp"
              className="flex-1 px-4 py-3 outline-none text-black text-lg placeholder:text-[#B5B5B5]"
            />
            <button className="bg-teal text-white px-6 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </button>
          </div>
          <button
            className="mt-2 bg-teal text-white px-6 py-3 rounded-xl text-lg font-semibold w-fit"
            onClick={() => {
              const roleFromStorage = localStorage.getItem("role");
              const userIdFromStorage = localStorage.getItem("userId");
              const tokenFromStorage = localStorage.getItem("accessToken");

              if (roleFromStorage && userIdFromStorage && tokenFromStorage) {
                window.location.href = "/home";
              } else {
                window.location.href = "/login";
              }
            }}
          >
            XEM THÊM
          </button>
        </div>
        <div className="flex-1 flex justify-center mt-10 lg:mt-0 relative">
          <img
            src="trangCh.png"
            alt="Hero"
            className="w-[50%] object-contain relative z-10 translate-x-[90px]"
          />
          <img
            src="trangCh2.png"
            alt="Decor"
            className="absolute bottom-0 w-[80%] object-contain z-0"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
