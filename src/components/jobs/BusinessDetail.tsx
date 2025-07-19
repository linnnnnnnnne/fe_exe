import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Headerrr from "../share/Headerrr";
import Footer from "../share/Footer";
import ActivityStats from "../share/ActivityStats";
import JobListPublic from "../profile/bs/JobListPublic";
import { Mail, Phone, MapPin } from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  kolBenefits: string;
  location: string;
  budget: number;
  gender: number;
  follower: number;
  startTime: string;
  endTime: string;
  require: string;
  status: number;
  businessField?: { fieldId: string };
  fieldName?: string;
}

interface Representative {
  representativeName: string;
  role: string;
  representativeEmail: string;
  representativePhoneNumber: string;
}

export default function BusinessDetail() {
  const { state } = useLocation();
  const {
    businessId,
    businessUserId,
    businessName,
    businessAddress,
    businessLogo,
  } = state || {};

  const [representative, setRepresentative] = useState<Representative | null>(
    null
  );
  const [description, setDescription] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [influMap, setInfluMap] = useState<{ [id: string]: any }>({});
  const [hasMembership, setHasMembership] = useState(false);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Available";
      case 1:
        return "Đang thực hiện";
      case 2:
        return "Hoàn thành";
      case 3:
        return "Đã hủy";
      case 4:
        return "Hết hạn đăng ký";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    if (!businessId) return;

    fetch(
      `https://localhost:7035/api/business/${businessId}/representative`
    )
      .then((res) => res.json())
      .then((rep) => {
        if (rep?.data) setRepresentative(rep.data);
      });

    if (businessUserId) {
      fetch(
        `https://localhost:7035/api/business/get-business-by-user-id/${businessUserId}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.description) setDescription(data.data.description);
        });
    }

    fetch(
      `https://localhost:7035/api/jobs/get-job/by-business-id/${businessId}`
    )
      .then((res) => res.json())
      .then(async (jobRes) => {
        const jobs: Job[] = jobRes?.data || [];
        const fieldIds = Array.from(
          new Set(
            jobs
              .map((j) => j.businessField?.fieldId)
              .filter((id): id is string => !!id)
          )
        );

        const fieldMap: { [key: string]: string } = {};
        await Promise.all(
          fieldIds.map(async (fieldId) => {
            try {
              const res = await fetch(
                `https://localhost:7035/api/field/get-by-id/${fieldId}`
              );
              const data = await res.json();
              if (data?.data?.name) fieldMap[fieldId] = data.data.name;
            } catch {
              fieldMap[fieldId] = "Không xác định";
            }
          })
        );

        const jobsWithField = jobs.map((job) => ({
          ...job,
          fieldName:
            fieldMap[job.businessField?.fieldId || ""] || "Không xác định",
        }));

        setJobs(jobsWithField);
      });
  }, [businessId, businessUserId]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const viewerId = localStorage.getItem("userId");

    if (!token || !viewerId) return;

    fetch(
      `https://localhost:7035/api/membership/user/${viewerId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((mem) => {
        const type = mem?.data?.membershipType?.type ?? 0;
        setHasMembership(type > 0);
      })
      .catch((err) => {
        console.error("Lỗi kiểm tra membership:", err);
      });
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("accessToken");
      const viewerId = localStorage.getItem("userId");

      if (!businessUserId || !token || !viewerId) return;

      try {
        const res = await fetch(
          `https://localhost:7035/api/review/review-of-business/${viewerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (json?.isSuccess && Array.isArray(json.data)) {
          const filtered = json.data.filter(
            (r: any) => r.businessId === businessId
          );
          setReviews(filtered);

          const influIds = [...new Set(json.data.map((r: any) => r.influId))];
          const map: { [id: string]: any } = {};

          await Promise.all(
            influIds.map(async (id) => {
              const r = await fetch(
                `https://localhost:7035/api/influ/get-influ-by-id/${id}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              const d = await r.json();
              if (d?.isSuccess && d.data) map[id as string] = d.data;
            })
          );

          setInfluMap(map);
        }
      } catch (err) {
        console.error("❌ Lỗi lấy review hoặc influencer:", err);
      }
    };

    fetchReviews();
  }, [businessUserId]);

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-montserrat">
      <Headerrr />

      <div className="bg-white shadow py-10 px-2 md:px-[200px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {businessLogo ? (
            <div
              className="relative w-[104px] h-[104px] rounded-full bg-white p-[2px]"
              style={{ boxShadow: "0 0 0 3px #3b82f6" }}
            >
              <img
                src={businessLogo}
                alt="logo"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-[#E0F2FE] flex items-center justify-center text-2xl font-bold text-[#0066CC]">
              {businessName?.charAt(0) || "B"}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-[#065F46] uppercase">
              {businessName}
            </h1>
            {businessAddress && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} /> {businessAddress}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w mx-auto px-[200px] py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl md:px-10 p-4 shadow">
            <h2 className="text-lg font-semibold">Thông Tin Liên Hệ</h2>
            {representative && (
              <div className="text-sm space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-32">Người đại diện:</span>
                  <span>{representative.representativeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-32">Chức vụ:</span>
                  <span>{representative.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{representative.representativeEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{representative.representativePhoneNumber}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white md:px-10 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-1">Giới thiệu</h2>
            <p className="text-sm leading-relaxed break-words overflow-hidden whitespace-pre-wrap">
              {description || "Chưa có mô tả giới thiệu."}
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 mb-20">
          <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-bold text-[#065F46] mb-4">Công việc</h2>
            <JobListPublic
              jobs={jobs}
              getStatusLabel={getStatusLabel}
              currentPage={1}
              setCurrentPage={() => {}}
              itemsPerPage={100}
              reviews={reviews}
              influMap={influMap}
              hasMembership={hasMembership}
            />
          </div>

          <ActivityStats
            jobs={jobs}
            reviews={reviews}
            getStatusLabel={getStatusLabel}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
