import { type FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ImpactSection: FunctionComponent = () => {
  const navigate = useNavigate();

  const handleJoinClick = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div className="w-full py-[80px] flex items-center justify-center bg-white">
      <div className="relative w-full max-w-screen-xl mx-auto px-10 h-[1533px] text-center text-[64px] text-white font-montserrat">
        {/* sứ mệnh & tầm nhìn  */}
        <div className="absolute top-[630px] left-0 w-full h-[500px]">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover "
            alt="Ảnh nền bóng đèn"
            src="https://article.talentbank.co.kr/wp-content/uploads/2022/02/IT_tc00580000064_l.jpg"
          />
          <div className="absolute top-[400px] left-[700px] w-[600px] h-[340px] text-left">
            <div className="absolute top-0 left-0 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[20px] bg-teal100 w-full h-full" />
            <b className="absolute top-[30px] left-[calc(50%-140px)] text-[64px] text-white capitalize">
              SỨ MỆNH
            </b>
            <div className="absolute top-[110px] left-[calc(50%-250px)] text-[26px] leading-[42px] w-[500px] text-white text-center">
              Xây dựng một nền tảng minh bạch, đáng tin cậy giúp các doanh
              nghiệp nhỏ lựa chọn đúng KOL, tối ưu chi phí marketing và nâng cao
              hiệu quả truyền thông.
            </div>
          </div>

          <div className="absolute top-[50px] left-[158px] w-[584px] h-[140px] text-[38px] text-darkslategray-100">
            <div className="absolute top-[0px] left-[0px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[78px] bg-white w-[584px] h-[140px]" />
            <b className="absolute top-[28px] left-[calc(50%_-_262px)] leading-[45px] inline-block whitespace-pre-wrap w-[512px] h-[100px]">
              “Chọn đúng người, truyền đúng giá trị.”
            </b>
          </div>

          <div className="absolute top-[280px] left-[50px] w-[600px] h-[340px]">
            <div className="absolute top-0 left-0 shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[20px] bg-teal100 w-full h-full" />
            <b className="absolute top-[30px] left-[calc(50%-150px)] text-[64px] text-white capitalize">
              TẦM NHÌN
            </b>
            <div className="absolute top-[110px] left-[calc(50%-250px)] text-[26px] leading-[42px] w-[500px] text-white text-center">
              Trở thành nền tảng chuẩn hóa quy trình đánh giá, kết nối và giám
              sát KOLs hàng đầu Việt Nam, đặc biệt phục vụ cho thị trường SMEs
              và micro-influencers.
            </div>
          </div>

          {/* button */}
          <div
            className="absolute top-[800px] left-[calc(50%-200px)] w-[346px] h-[55px] cursor-pointer transition duration-200 ease-in-out hover:scale-105"
            onClick={handleJoinClick}
          >
            <div className="w-full h-full rounded-lg bg-darkslategray-200 hover:bg-darkslategray-300 flex items-center justify-center gap-2 px-4 transition duration-200 ease-in-out">
              <span className="text-white font-poppins font-bold text-[20px] leading-none">
                Tham gia
              </span>
              <span className="text-white font-buthick text-[23px] leading-none">
                InfluencerHub
              </span>
              <span className="text-white font-poppins font-bold text-[20px] leading-none">
                ngay
              </span>
            </div>
          </div>
        </div>

        {/* tiềm năng  */}
        <div className="absolute top-[0px] left-[0px] w-[1363px] h-[512px] text-left text-3xl">
          <div className="absolute top-[336px] left-[358px] w-[1005px] h-44">
            <div className="absolute top-[0px] left-[0px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[20px] bg-teal100 w-[1005px] h-44" />
            <div className="absolute top-[calc(50%_-_60px)] left-[57px] leading-10 inline-block w-[917px] h-[120px]">
              <p className="m-0">
                <b>InfluenceHub là cầu nối</b>
              </p>
              <p className="m-0">
                Chúng tôi tạo ra nơi doanh nghiệp tìm đúng người – Influencer
                tìm đúng việc, tất cả minh bạch và nhanh chóng.
              </p>
            </div>
          </div>
          <div className="absolute top-[0px] left-[358px] w-[1005px] h-[119px]">
            <div className="absolute top-[0px] left-[0px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[20px] bg-paleturquoise w-[1005px] h-[119px]" />
            <div className="absolute top-[calc(50%_-_39.5px)] left-[57px] leading-10 flex items-center w-[898px] h-20">
              <span className="w-full">
                <p className="m-0">
                  <b>Thị trường đang rất “khát” KOL chất lượng</b>
                </p>
                <p className="m-0">
                  Doanh nghiệp cần influencer thật sự phù hợp.
                </p>
              </span>
            </div>
          </div>
          <div className="absolute top-[149px] left-[358px] w-[1005px] h-[156px]">
            <div className="absolute top-[0px] left-[0px] shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] rounded-[20px] bg-darkseagreen w-[1005px] h-[156px]" />
            <div className="absolute top-[calc(50%_-_61px)] left-[61px] leading-10 inline-block w-[894px] h-[120px]">
              <p className="m-0">
                <b>Người làm nghề cần cơ hội công bằng hơn</b>
              </p>
              <p className="m-0">
                Nhiều KOL/KOC giỏi vẫn chưa được biết đến vì thiếu nền tảng kết
                nối và thể hiện năng lực rõ ràng.
              </p>
            </div>
          </div>
          <div className="absolute top-[0px] left-[0px] w-80 h-[512px] text-[64px]">
            <img
              className="absolute top-[0px] left-[0px] w-80 h-[512px] object-cover"
              alt=""
              src="https://i.pinimg.com/1200x/ea/8c/e7/ea8ce7a453508511f50644ad903526c7.jpg"
              style={{
                filter: `
                        sepia(1.8)           /* Giảm chút sepia để không quá vàng */
                        hue-rotate(100deg)    /* Điều chỉnh nhẹ hue cho màu xanh ngọc hơn */
                        saturate(1.9)        /* Tăng saturation chút nữa để rực hơn */
                        brightness(1.1)     /* Giữ sáng vừa đủ, tránh quá chói */
                        contrast(1.2)       /* Tăng độ tương phản để nét hơn */
                        drop-shadow(0 10px 20px rgba(0, 0, 0, 0.45))  /* Bóng đổ mềm mại */
                      `,
              }}
            />
            <b className="absolute top-[calc(50%-210px)] left-[69px] capitalize text-white text-[64px] leading-tight text-center whitespace-pre-line">
              TIỀM{"\n"}NĂNG
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactSection;
