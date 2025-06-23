"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Business {
  id: string;
  name: string;
  address: string;
  businessLicense: string;
  logo: string;
  fieldIds: string[];
  portfolio_link?: string;
}

export default function BusinessManager() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await res.json();

        if (res.ok && Array.isArray(result.data)) {
          setBusinesses(result.data);
        } else {
          setBusinesses([]);
          toast.warn("Không có dữ liệu doanh nghiệp.");
        }
      } catch (err: any) {
        console.error("Lỗi khi tải danh sách doanh nghiệp:", err);
        toast.error("Đã xảy ra lỗi khi tải danh sách doanh nghiệp.");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return (
    <div>
      {loading && <p>Đang tải danh sách doanh nghiệp...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && businesses.length === 0 && (
        <p className="text-gray-500">Không có doanh nghiệp nào.</p>
      )}

      <div className="space-y-4">
        {businesses.map((biz) => (
          <div
            key={biz.id}
            className="bg-white rounded-xl shadow-md p-4 flex flex-row items-start gap-6"
          >
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src={biz.logo}
                alt={biz.name}
                className="w-20 h-20 mt-5 rounded-full object-cover border"
              />
            </div>

            {/* Nội dung */}
            <div className="flex-1">
              <p className="text-lg font-semibold">{biz.name}</p>
              <p className="text-sm text-gray-700">{biz.address}</p>
              <p className="text-sm mt-1">
                <b>Giấy phép:</b>{" "}
                <a
                  href={biz.businessLicense}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Xem giấy phép
                </a>
              </p>

              {biz.portfolio_link && (
                <p className="text-sm mt-1">
                  <b>Portfolio:</b>{" "}
                  <a
                    href={biz.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Xem portfolio
                  </a>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
