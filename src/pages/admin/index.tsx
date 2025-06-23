import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  User,
  LogOut,
  ShieldCheck,
  ShieldUser,
  FileUser,
} from "lucide-react";

// import Dashboard from "../../../components/admin/Dashboard";
// import ProjectManager from "../../../components/admin/ProjectManager";
import AccountApproval from "../../components/admin/AccountApproval";
import MembershipApproval from "../../components/admin/MembershipApproval";
import FreelancerManager from "../../components/admin/FreelancerManager";
import BusinessManager from "../../components/admin/BusinessManager";
import MembershipManager from "../../components/admin/MembershipManager";

const menuItems = [
  { label: "Tổng Quan", icon: <LayoutDashboard size={20} /> },
  { label: "Quản Lí Dự Án", icon: <Briefcase size={20} /> },
  { label: "Kiểm Duyệt Tài Khoản", icon: <ShieldCheck size={20} /> },
  { label: "Kiểm Duyệt Membership", icon: <ShieldUser size={20} /> },
  { label: "Quản Lí Membership", icon: <FileUser size={20} /> },
  { label: "Quản Lí Freelancer", icon: <User size={20} /> },
  { label: "Quản Lí Doanh Nghiệp", icon: <Users size={20} /> },
];

export default function AdminLayout() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return alert("Không tìm thấy userId");

    try {
      const res = await fetch("https://localhost:7035/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Đăng xuất thất bại: " + (data?.message || "Lỗi không xác định"));
      }
    } catch (err) {
      console.error("Lỗi khi logout:", err);
      alert("Có lỗi xảy ra khi đăng xuất.");
    }
  };

  const renderContent = () => {
  switch (activeIndex) {
    // case 0:
    //   return <Dashboard />;
    // case 1:
    //   return <ProjectManager />;
    case 2:
      return <AccountApproval />;
    case 3:
      return <MembershipApproval />;
    case 4:
      return <MembershipManager />;
    case 5:
      return <FreelancerManager />;
    case 6:
      return <BusinessManager />;
    default:
      return null;
  }
};


  return (
    <div className="flex h-screen font-montserrat bg-lightgray">
      {/* Sidebar */}
      <div className="w-70 bg-white shadow-md border-r flex flex-col">
        <div className="p-4 text-xl font-bold border-b">
          Admin{" "}
          <span className="font-buthick text-teal mb-2">InfluencerHub</span>
        </div>
        <nav className="p-2 space-y-2 flex-1">
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              onClick={() => setActiveIndex(index)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
                activeIndex === index
                  ? "bg-teal text-white shadow"
                  : "hover:bg-lightgray text-gray-800"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Logout button */}
        <div className="p-2 border-t">
          <div
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-100 text-red-600"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mt-2 mb-4">
          {menuItems[activeIndex].label}
        </h1>
        {renderContent()}
      </div>
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
}
