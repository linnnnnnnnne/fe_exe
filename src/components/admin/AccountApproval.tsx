import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface User {
  userId: string;
  email: string;
  role: {
    id: string;
    name: string;
  };
  isVerified: boolean;
  isBlocked: boolean;
}

export default function AccountApproval() {
  const [users, setUsers] = useState<User[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [businessDetails, setBusinessDetails] = useState<
    Record<string, { logo: string; address: string; businessLicense: string }>
  >({});
  const [freelancerDetails, setFreelancerDetails] = useState<
    Record<
      string,
      {
        dateOfBirth: string;
        phoneNumber: string;
        follower: number;
        linkImage: string;
        portfolio_link: string;
      }
    >
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUnverifiedUsers = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          "https://localhost:7035/api/user/unverified",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
      } catch (err: any) {
        console.error("Lỗi khi gọi API /unverified:", err);
        setError(err.message || "Đã xảy ra lỗi.");
      } finally {
        setLoading(false);
      }
    };

    fetchUnverifiedUsers();
  }, []);

  useEffect(() => {
    const fetchDetails = async (userId: string, role: string) => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) return;

      const roleLower = role?.toLowerCase();
      let endpoint = "";

      if (roleLower === "freelancer") {
        endpoint = `https://localhost:7035/api/influ/get-influ-by-userId/${userId}`;
      } else if (roleLower === "business" || roleLower === "doanh nghiệp") {
        endpoint = `https://localhost:7035/api/business/get-business-by-user-id/${userId}`;
      } else {
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await res.json();

        if (result?.data?.name) {
          setUserNames((prev) => ({
            ...prev,
            [userId]: result.data.name,
          }));

          if (roleLower === "freelancer") {
            setFreelancerDetails((prev) => ({
              ...prev,
              [userId]: {
                dateOfBirth: result.data.dateOfBirth || "",
                phoneNumber: result.data.phoneNumber || "",
                follower: result.data.follower || 0,
                linkImage: result.data.linkImage || "",
                portfolio_link: result.data.portfolio_link || "",
              },
            }));
          }

          if (roleLower === "business" || roleLower === "doanh nghiệp") {
            setBusinessDetails((prev) => ({
              ...prev,
              [userId]: {
                logo: result.data.logo || "",
                address: result.data.address || "",
                businessLicense: result.data.businessLicense || "",
              },
            }));
          }
        }
      } catch (err) {
        console.error(`Lỗi khi lấy thông tin cho ${role}:`, err);
      }
    };

    users.forEach((user) => {
      if (!userNames[user.userId]) {
        fetchDetails(user.userId, user.role?.name);
      }
    });
  }, [users]);

  const handleApprove = async (userId: string) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Chưa đăng nhập.");
      return;
    }

    const confirm = window.confirm("Bạn có chắc muốn duyệt tài khoản này?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `https://localhost:7035/api/admin/users/${userId}/verify-account?isVerified=true`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok && result.isSuccess) {
        toast.success("Duyệt tài khoản thành công!");
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
      } else {
        toast.error(result.message || "Duyệt thất bại.");
      }
    } catch (err) {
      console.error("Lỗi duyệt:", err);
      toast.error("Đã xảy ra lỗi khi duyệt.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Danh sách tài khoản chưa kiểm duyệt
      </h2>

      {loading && <p>Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && users.length === 0 && (
        <p className="text-gray-500">Không có tài khoản cần duyệt.</p>
      )}

      <div className="space-y-6">
        {users.map((user) => {
          const roleName = user.role?.name.toLowerCase();
          const isFreelancer = roleName === "freelancer";
          const isBusiness =
            roleName === "business" || roleName === "doanh nghiệp";

          return (
            <div
              key={user.userId}
              className="border p-4 rounded-xl shadow-md bg-gray-50 relative"
            >
              {/* Freelancer display */}
              {isFreelancer && freelancerDetails[user.userId] && (
                <div className="border-t text-sm text-gray-800">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    {/* Cột 1: Avatar */}
                    <div className="flex-shrink-0 ml-2 mt-3 flex justify-center sm:justify-start">
                      <img
                        src={freelancerDetails[user.userId].linkImage}
                        alt="Avatar"
                        className="h-24 w-24 rounded-full object-cover border shadow-sm"
                      />
                    </div>

                    {/* Cột 2 + 3: Thông tin chia 2 cột ngang */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                      <p className="mb-0 mt-2">
                        <b>Họ tên:</b> {userNames[user.userId]}
                      </p>
                      <p className="mb-0 mt-2">
                        <b>Email:</b> {user.email}
                      </p>

                      <p className="mb-0 mt-2">
                        <b>Ngày sinh:</b>{" "}
                        {new Date(
                          freelancerDetails[user.userId].dateOfBirth
                        ).toLocaleDateString()}
                      </p>
                      <p className="mb-0 mt-2">
                        <b>Vai trò:</b>{" "}
                        <span className="font-bold text-teal">
                          {user.role?.name}
                        </span>
                      </p>

                      <p className="mb-0 mt-2">
                        <b>SĐT:</b> {freelancerDetails[user.userId].phoneNumber}
                      </p>
                      <p className="flex items-center gap-1 mb-0 mt-2">
                        <b>Đã xác minh:</b>{" "}
                        {user.isVerified ? (
                          <CheckCircle className="text-green-600 w-4 h-4" />
                        ) : (
                          <XCircle className="text-red-600 w-6 h-6" />
                        )}
                      </p>

                      <p className="mb-0 mt-2">
                        <b>Follower:</b>{" "}
                        {freelancerDetails[
                          user.userId
                        ].follower.toLocaleString()}
                      </p>
                      <p className="mb-0 mt-2">
                        <b>Trạng thái:</b>{" "}
                        {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                      </p>

                      <p className="col-span-2 mb-0 mt-2">
                        <b>Portfolio:</b>{" "}
                        <a
                          href={freelancerDetails[user.userId].portfolio_link}
                          className="text-blue-600 underline ml-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem hồ sơ
                        </a>
                      </p>
                    </div>

                    {/* Cột 4: Nút Duyệt */}
                    <div className="flex justify-center sm:justify-end items-start sm:items-center">
                      <button
                        onClick={() => handleApprove(user.userId)}
                        className="bg-teal hover:bg-teal200 text-white px-4 py-2 rounded shadow disabled:opacity-50"
                        disabled={user.isVerified}
                      >
                        Duyệt tài khoản
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Business display + approve button */}
              {isBusiness && businessDetails[user.userId] && (
                <div className="border-t text-sm text-gray-800 ">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                    {/* Cột 1: Logo */}
                    <div className="flex-shrink-0 ml-2 mt-3 flex justify-center sm:justify-start">
                      <img
                        src={businessDetails[user.userId].logo}
                        alt="Logo"
                        className="h-24 w-24 rounded-full object-cover border shadow-sm"
                      />
                    </div>

                    {/* Cột 2 + 3: Thông tin doanh nghiệp */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5">
                      <p className="mb-0 mt-2">
                        <b>Tên doanh nghiệp:</b> {userNames[user.userId]}
                      </p>
                      <p className="mb-0 mt-2">
                        <b>Email:</b> {user.email}
                      </p>

                      <p className="mb-0 mt-2">
                        <b>Địa chỉ:</b> {businessDetails[user.userId].address}
                      </p>
                      <p className="mb-0 mt-2">
                        <b>Vai trò:</b>{" "}
                        <span className="font-bold text-teal">
                          {user.role?.name}
                        </span>
                      </p>

                      <p className="mb-0 mt-2">
                        <b>Giấy phép KD:</b>{" "}
                        <a
                          href={businessDetails[user.userId].businessLicense}
                          className="text-blue-600 underline ml-1"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Xem giấy phép
                        </a>
                      </p>

                      <p className="flex items-center gap-1 mb-0 mt-2">
                        <b>Đã xác minh:</b>{" "}
                        {user.isVerified ? (
                          <CheckCircle className="text-green-600 w-4 h-4" />
                        ) : (
                          <XCircle className="text-red-600 w-6 h-6" />
                        )}
                      </p>

                      <p className="mb-2 mt-2">
                        <b>Trạng thái:</b>{" "}
                        {user.isBlocked ? "Đã khóa" : "Hoạt động"}
                      </p>
                    </div>

                    {/* Cột 4: Nút Duyệt */}
                    <div className="flex justify-center sm:justify-end items-start sm:items-center">
                      <button
                        onClick={() => handleApprove(user.userId)}
                        className="bg-teal hover:bg-teal200 text-white px-4 py-2 rounded shadow disabled:opacity-50"
                        disabled={user.isVerified}
                      >
                        Duyệt tài khoản
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
