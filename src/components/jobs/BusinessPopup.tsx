import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface BusinessPopupProps {
  businessId: string;
  businessName: string;
  businessAddress?: string;
  businessLogo?: string;
  onClose: () => void;
}

interface Representative {
  name: string;
  role: string;
  email: string;
  phoneNumber: string;
}

export default function BusinessPopup({
  businessId,
  businessName,
  businessAddress,
  businessLogo,
  onClose,
}: BusinessPopupProps) {
  const [representative, setRepresentative] = useState<Representative | null>(
    null
  );

  useEffect(() => {
    const fetchRepresentative = async () => {
      try {
        const res = await fetch(
          `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/${businessId}/representative`
        );
        const json = await res.json();
        if (json?.data) {
          setRepresentative({
            name: json.data.representativeName,
            role: json.data.role,
            email: json.data.representativeEmail,
            phoneNumber: json.data.representativePhoneNumber,
          });
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin đại diện:", err);
      }
    };

    fetchRepresentative();
  }, [businessId]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white font-montserrat rounded-xl p-8 w-full max-w-xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full transition"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-1">
          Thông tin người đại diện doanh nghiệp:
        </h2>
        <p className="text-center text-2xl font-medium text-teal mt-2 mb-5">{businessName}</p>

        <div className="flex items-start gap-6 mb-4">
          {businessLogo && (
            <img
              src={businessLogo}
              alt="Logo"
              className="w-40 h-40 object-cover rounded"
            />
          )}
          <div className="text-sm text-gray-700 space-y-2 mt-2">
            <p className="mt-0 mb-2">
              <strong className="text-black">Địa chỉ:</strong>{" "}
              {businessAddress || "Chưa cập nhật"}
            </p>
            {representative ? (
              <>
                <p>
                  <strong className="text-black">Người đại diện:</strong>{" "}
                  {representative.name}
                </p>
                <p>
                  <strong className="text-black">Chức vụ:</strong>{" "}
                  {representative.role}
                </p>
                <p>
                  <strong className="text-black">Email:</strong>{" "}
                  {representative.email}
                </p>
                <p>
                  <strong className="text-black">SĐT:</strong>{" "}
                  {representative.phoneNumber}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">
                Không có thông tin người đại diện.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
