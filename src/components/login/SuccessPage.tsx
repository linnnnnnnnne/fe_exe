import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { GiPartyPopper } from "react-icons/gi"; 

export default function SuccessPage() {
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const Button = ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
    >
      {children}
    </button>
  );

  return (
    <div
      className="relative w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-pink-200 text-center"
      style={{ fontFamily: "'Montserrat', sans-serif" }}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={300}
      />

      <div className="relative z-20 p-10 bg-white rounded-2xl shadow-2xl max-w-xl">
        <h1 className="text-4xl font-bold text-green-700 mb-4 flex items-center justify-center gap-2">
          <GiPartyPopper size={32} /> Chúc mừng bạn! <GiPartyPopper size={32} />
        </h1>

        <p className="text-2xl text-gray-700 mb-6">
          Bạn đã đăng ký tài khoản thành công. Hãy khám phá{" "}
          <span className="font-buthick text-teal">InfluencerHub</span> ngay!
        </p>

        <Button onClick={() => (window.location.href = "/login")}>Tiếp tục</Button>
      </div>
    </div>
  );
}
