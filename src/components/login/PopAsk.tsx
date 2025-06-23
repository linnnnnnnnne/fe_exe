import { useNavigate } from "react-router-dom";

export default function PopAsk({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();

  const handleBusinessClick = () => navigate("/register_business");
  const handleKocClick = () => navigate("/register_koc");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#D2E4DE] rounded-xl p-6 max-w-xl w-full relative text-center">
        <button
          className="absolute top-3 right-3 text-2xl z-10 w-10 h-10 rounded-full transition duration-200 ease-in-out hover:bg-gray hover:text-red-500"
          onClick={onClose}
        >
          ×
        </button>

        <p className="text-2xl font-montserrat font-bold text-teal mt-0 mb-6">
          Bạn là doanh nghiệp hay
          <br />
          người sáng tạo nội dung?
        </p>

        <div className="flex gap-6">
          {/* BUSINESS Card */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between items-center h-[300px] transition duration-200 hover:shadow-xl hover:-translate-y-1">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/7d97fa8483ef1de6dc20e58dc1ef9338bd73473c?placeholderIfAbsent=true&apiKey=87394bd0cd7a4add8bf680009e12faa5"
              alt="Business"
              className="max-h-56 object-contain mb-[0px]"
            />
            <button
              onClick={handleBusinessClick}
              className="bg-teal text-white font-montserrat font-semibold px-6 py-3 rounded-lg w-full transition duration-200 ease-in-out hover:bg-teal hover:scale-105 transform"
            >
              BUSINESS
            </button>
          </div>

          {/* KOL-KOC Card */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between items-center h-[300px] transition duration-200 hover:shadow-xl hover:-translate-y-1">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/1de78d4a2e4dce770897aa476823506409a286cc?placeholderIfAbsent=true&apiKey=87394bd0cd7a4add8bf680009e12faa5"
              alt="KOL-KOC"
              className="max-h-56 object-contain mb-[0px]"
            />
            <button
              onClick={handleKocClick}
              className="bg-teal text-white font-montserrat font-semibold px-6 py-3 rounded-lg w-full transition duration-200 ease-in-out hover:bg-teal hover:scale-105 transform"
            >
              KOL-KOC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
