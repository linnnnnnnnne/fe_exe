import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Transaction {
  id: string;
  userId: string;
  membershipTypeId: string;
  amount: number;
  time: string;
  paymentImageLink: string;
  status: number; // 0: Unpaid, 1: Paid, 2: Failed
}

interface User {
  userId: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
}

export default function MembershipApproval() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userMap, setUserMap] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Bạn chưa đăng nhập.");
        window.location.href = "/login";
        return;
      }

      try {
        const [transRes, userRes] = await Promise.all([
          fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/transaction/all", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
          fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/user/all", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }),
        ]);

        if (transRes.status === 401 || userRes.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn.");
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const [transData, userData] = await Promise.all([
          transRes.json(),
          userRes.json(),
        ]);

        if (Array.isArray(transData.data)) {
          setTransactions(transData.data);
        } else {
          toast.error("Không thể tải danh sách membership.");
        }

        if (Array.isArray(userData.data)) {
          const map: Record<string, User> = {};
          userData.data.forEach((u: User) => {
            map[u.userId] = u;
          });
          setUserMap(map);
        } else {
          toast.error("Không thể tải thông tin người dùng.");
        }
      } catch (err) {
        console.error("Lỗi fetch:", err);
        toast.error("Lỗi hệ thống khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleApprove = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }

    try {
      const res = await fetch(`https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/transaction/approve/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setTransactions(prev =>
          prev.map(item =>
            item.id === id ? { ...item, status: 1 } : item
          )
        );
        toast.success("Duyệt thành công!");
      } else {
        toast.error("Duyệt thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi duyệt.");
    }
  };

  const handleReject = async (id: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập.");
      return;
    }

    try {
      const res = await fetch(`https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/transaction/cancel/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        setTransactions(prev =>
          prev.map(item =>
            item.id === id ? { ...item, status: 2 } : item
          )
        );
        toast.success("Đã từ chối giao dịch.");
      } else {
        toast.error("Từ chối thất bại!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi từ chối.");
    }
  };

  const pendingTransactions = transactions.filter(t => t.status === 0);

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
      <h2 className="text-xl font-semibold mb-4">Membership chờ xử lý</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : pendingTransactions.length === 0 ? (
        <p className="text-gray-500">🎉 Không có yêu cầu nào chờ duyệt.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingTransactions.map((item) => {
            const user = userMap[item.userId];

            return (
              <div
                key={item.id}
                className="bg-white p-4 border rounded-lg shadow space-y-2"
              >
                <p className="mt-0"><strong>Membership ID:</strong> {item.membershipTypeId}</p>
                <p><strong>Số tiền:</strong> {item.amount.toLocaleString()}đ</p>
                <p><strong>Ngày:</strong> {new Date(item.time).toLocaleString()}</p>
                <p><strong>Trạng thái:</strong> {renderStatus(item.status)}</p>

                {user && (
                  <>
                    <p><strong>Người dùng:</strong> {user.email}</p>
                    <p><strong>Vai trò:</strong> {user.role?.name}</p>
                  </>
                )}

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

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex-1 px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700"
                  >
                    Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(item.id)}
                    className="flex-1 px-4 py-2 rounded text-white bg-red-600 hover:bg-red-700"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
