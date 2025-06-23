"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Transaction {
  id: string;
  userId: string;
  membershipTypeId: string;
  amount: number;
  time: string;
  paymentImageLink: string;
  status: number;
}

export default function MembershipManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllTransactions = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        toast.error("Bạn chưa đăng nhập.");
        return;
      }

      try {
        const res = await fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/transaction/all", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.data)) {
          setTransactions(data.data);
        } else {
          toast.error("Không thể tải danh sách giao dịch.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Lỗi khi tải danh sách.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, []);

  const renderStatus = (status: number) => {
    switch (status) {
      case 0:
        return <span className="text-yellow-600 font-semibold">Chờ xử lý</span>;
      case 1:
        return <span className="text-green-600 font-semibold">Đã duyệt</span>;
      case 2:
        return <span className="text-red-600 font-semibold">Đã từ chối</span>;
      default:
        return <span className="text-gray-600">Không xác định</span>;
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tất cả Membership giao dịch</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-500">Không có giao dịch nào.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transactions.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 border rounded-lg shadow space-y-2"
            >
              <p><strong>Membership ID:</strong> {item.membershipTypeId}</p>
              <p><strong>Số tiền:</strong> {item.amount.toLocaleString()}đ</p>
              <p><strong>Ngày:</strong> {new Date(item.time).toLocaleString()}</p>
              <p><strong>Trạng thái:</strong> {renderStatus(item.status)}</p>
              <p>
                <strong>Ảnh chuyển khoản:</strong>{" "}
                <a
                  href={item.paymentImageLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Xem ảnh
                </a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
