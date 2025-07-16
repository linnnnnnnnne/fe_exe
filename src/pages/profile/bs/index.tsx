import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Headerrr from "../../../components/share/Headerrr";
import Footer from "../../../components/share/Footer";
import UpdateJob from "../../../components/profile/bs/UpdateJob";
import CreateJob from "../../../components/profile/bs/CreateJob";
import JobList from "../../../components/profile/bs/JobList";
import FileUploadAvatar from "../../../components/share/FileUploadAvatar";
import ActivityStats from "../../../components/share/ActivityStats";
import {
  Mail,
  Phone,
  MapPin,
  Pencil,
  PlusCircle,
  XCircle,
  Save,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Business {
  id?: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
}

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
  businessField?: {
    fieldId: string;
  };
  fieldName?: string;
}

interface Representative {
  representativeName: string;
  role: string;
  representativeEmail: string;
  representativePhoneNumber: string;
}

export default function ProfileBusinessPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [representative, setRepresentative] = useState<Representative | null>(
    null
  );
  const [isVerified, setIsVerified] = useState(false);
  const [currentType, setCurrentType] = useState<number | null>(null);
  const [fieldNames, setFieldNames] = useState<string[]>([]);
  const [allFields, setAllFields] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [editedBusiness, setEditedBusiness] = useState<Business | null>(null);
  const [editedRepresentative, setEditedRepresentative] =
    useState<Representative | null>(null);

  const handleEditProfile = () => {
    setIsEditingBusiness(true);
    setEditedBusiness({ ...business! });
    setEditedRepresentative({ ...representative! });

    // Gọi danh sách lĩnh vực
    fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/field/get-all")
      .then((res) => res.json())
      .then((data) => {
        if (data?.isSuccess) {
          setAllFields(data.data || []);
        }
      });

    // Gán danh sách field đang dùng của doanh nghiệp
    fetch(
      `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/field/get-all-field-of-business/${business?.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.isSuccess && Array.isArray(data.data)) {
          const ids = data.data.map((f: any) => f.fieldId);
          setSelectedFieldIds(ids);
        }
      });
  };

  const [reviews, setReviews] = useState<any[]>([]);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    if (userId && accessToken) {
      fetch(`https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/review/review-of-business/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.isSuccess) setReviews(data.data || []);
        });
    }
  }, []);

  const [influMap, setInfluMap] = useState<{ [id: string]: any }>({});
  useEffect(() => {
    const fetchInfluencersFromReviews = async () => {
      const token = localStorage.getItem("accessToken");
      const influIds = Array.from(new Set(reviews.map((r) => r.influId)));

      const newMap: { [id: string]: any } = {};
      await Promise.all(
        influIds.map(async (id) => {
          try {
            const res = await fetch(
              `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/influ/get-influ-by-id/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const data = await res.json();
            if (data.isSuccess && data.data) {
              newMap[id] = data.data;
            }
          } catch (err) {
            console.error("❌ Lỗi fetch influencer:", err);
          }
        })
      );
      setInfluMap(newMap);
    };

    if (reviews.length > 0) fetchInfluencersFromReviews();
  }, [reviews]);

  const handleSaveProfile = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast.error("Bạn chưa đăng nhập hoặc token đã hết hạn.");
      return;
    }

    // Nếu đã từng tạo job thì không cho chỉnh sửa
    if (jobs.length > 0) {
      toast.warning("Không thể chỉnh sửa hồ sơ khi đã có công việc được tạo.");
      return;
    }

    try {
      const payload = {
        email: editedBusiness?.email || "",
        name: editedBusiness?.name || "",
        description: editedBusiness?.description || "",
        address: editedBusiness?.address || "",
        logo: editedBusiness?.logo || "",
        fieldIds: selectedFieldIds,

        representativeName: editedRepresentative?.representativeName || "",
        role: editedRepresentative?.role || "",
        representativeEmail: editedRepresentative?.representativeEmail || "",
        representativePhoneNumber:
          editedRepresentative?.representativePhoneNumber || "",
      };

      const res = await fetch(
        `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/update-by-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (res.ok && json.isSuccess !== false) {
        toast.success("Cập nhật thành công!");
        setBusiness(editedBusiness);
        setRepresentative(editedRepresentative);
        setIsEditingBusiness(false);
        const selectedNames = allFields
          .filter((f) => selectedFieldIds.includes(f.id))
          .map((f) => f.name);
        setFieldNames(selectedNames);
      } else {
        toast.error(json.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi cập nhật.");
    }
  };

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
    if (!id) return;

    fetch(`https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/get-business-by-user-id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const businessData = data?.data;
        setBusiness(businessData);

        // gọi thêm membership
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("accessToken");
        if (userId && token) {
          fetch(`https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/membership/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((mem) => {
              const userData = mem?.data?.user;
              setIsVerified(userData?.isVerified || false);
              setCurrentType(mem?.data?.membershipType?.type ?? null);
            })
            .catch((err) => console.error("Lỗi membership:", err));
        }

        const businessId = businessData?.id;
        if (businessId) {
          fetch(
            `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/${businessId}/representative`
          )
            .then((res) => res.json())
            .then((repData) => setRepresentative(repData?.data));

          fetch(
            `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-job/by-business-id/${businessId}`
          )
            .then((res) => res.json())
            .then(async (jobData) => {
              const jobs: Job[] = jobData?.data || [];
              const fieldIds: string[] = Array.from(
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
                      `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/field/get-by-id/${fieldId}`
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
                  fieldMap[job.businessField?.fieldId || ""] ||
                  "Không xác định",
              }));

              setJobs(jobsWithField);
            });

          //  Thêm đoạn fetch fieldName này
          fetch(
            `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/field/get-all-field-of-business/${businessId}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (data?.isSuccess && Array.isArray(data.data)) {
                const names = data.data.map((field: any) => field.fieldName);
                setFieldNames(names);
              }
            })
            .catch((err) =>
              console.error("Lỗi lấy field của doanh nghiệp:", err)
            );
        }
      });
  }, [id]);

  if (!business)
    return <div className="text-center mt-10">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-montserrat">
      <Headerrr />

      <div className="bg-white shadow py-10 px-2 md:px-[200px] flex flex-col md:flex-row items-center justify-between gap-4 ">
        <div className="flex items-center gap-4">
          {isEditingBusiness ? (
            <FileUploadAvatar
              imageUrl={editedBusiness?.logo}
              onUploaded={(url) =>
                setEditedBusiness((prev) =>
                  prev ? { ...prev, logo: url } : prev
                )
              }
            />
          ) : business.logo ? (
            <div
              className="relative w-[104px] h-[104px] rounded-full bg-white p-[2px]"
              style={{ boxShadow: "0 0 0 3px #3b82f6" }}
            >
              <img
                src={business.logo}
                alt="logo"
                className="w-full h-full rounded-full object-cover"
              />
              {isVerified && currentType !== null && currentType > 0 && (
                <div
                  className="absolute bottom-1 right-0.5 w-6 h-6 rounded-full bg-[#3b82f6] border-2 border-white flex items-center justify-center"
                  title={
                    currentType === 1
                      ? "Gói 1 Tháng"
                      : currentType === 2
                      ? "Gói 1 Năm"
                      : "Gói Free"
                  }
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="w-[100px] h-[100px] rounded-full bg-[#E0F2FE] flex items-center justify-center text-2xl font-bold text-[#0066CC]">
              {business.name?.charAt(0) || "B"}
            </div>
          )}

          {isEditingBusiness ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="w-24 text-sm font-medium">Tên công ty:</label>
                <input
                  className="text-base border p-1 rounded w-full"
                  value={editedBusiness?.name || ""}
                  onChange={(e) =>
                    setEditedBusiness({
                      ...editedBusiness!,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="w-24 text-sm font-medium">Địa chỉ:</label>
                <input
                  className="text-sm border p-1 rounded w-full"
                  value={editedBusiness?.address || ""}
                  onChange={(e) =>
                    setEditedBusiness({
                      ...editedBusiness!,
                      address: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-[#065F46] uppercase">
                {business.name}
              </h1>
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} /> {business.address}
              </div>
            </div>
          )}
        </div>
        {isEditingBusiness ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingBusiness(false)}
              className="bg-gray text-black px-4 py-2 rounded-md flex items-center gap-2 hover:bg-lightgray transition"
            >
              <XCircle size={16} /> Huỷ
            </button>
            <button
              onClick={handleSaveProfile}
              className="bg-[#065F46] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-teal100 transition"
            >
              <Save size={16} /> Lưu
            </button>
          </div>
        ) : (
          <button
            onClick={handleEditProfile}
            className="bg-[#065F46] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-teal100 transition"
          >
            <Pencil size={16} /> Chỉnh sửa hồ sơ
          </button>
        )}
      </div>

      <div className="max-w mx-auto px-[200px] py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liên hệ + giới thiệu */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl md:px-10 p-4 shadow">
            <h2 className="text-lg font-semibold">Thông Tin Liên Hệ</h2>
            {representative && (
              <div className="text-sm space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-27 text-sm font-medium">
                    Người đại diện:
                  </span>
                  {isEditingBusiness ? (
                    <input
                      value={editedRepresentative?.representativeName || ""}
                      onChange={(e) =>
                        setEditedRepresentative({
                          ...editedRepresentative!,
                          representativeName: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span>{representative.representativeName}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-20 text-sm font-medium">Chức vụ:</span>
                  {isEditingBusiness ? (
                    <input
                      value={editedRepresentative?.role || ""}
                      onChange={(e) =>
                        setEditedRepresentative({
                          ...editedRepresentative!,
                          role: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span>{representative.role}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  {isEditingBusiness ? (
                    <input
                      value={editedRepresentative?.representativeEmail || ""}
                      onChange={(e) =>
                        setEditedRepresentative({
                          ...editedRepresentative!,
                          representativeEmail: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span>{representative.representativeEmail}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  {isEditingBusiness ? (
                    <input
                      value={
                        editedRepresentative?.representativePhoneNumber || ""
                      }
                      onChange={(e) =>
                        setEditedRepresentative({
                          ...editedRepresentative!,
                          representativePhoneNumber: e.target.value,
                        })
                      }
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span>{representative.representativePhoneNumber}</span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Lĩnh vực:</span>
                  {isEditingBusiness ? (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                      {allFields.map((field) => (
                        <label
                          key={field.id}
                          className="flex items-center gap-1 text-sm"
                        >
                          <input
                            type="checkbox"
                            value={field.id}
                            checked={selectedFieldIds.includes(field.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectedFieldIds((prev) =>
                                checked
                                  ? [...prev, field.id]
                                  : prev.filter((id) => id !== field.id)
                              );
                            }}
                          />
                          {field.name}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 text-sm">
                      {fieldNames.map((name, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-[#4B5563]">•</span>
                          <span>{name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white md:px-10 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-1">Giới thiệu</h2>
            {isEditingBusiness ? (
              <textarea
                className="text-sm leading-relaxed border p-2 rounded w-full"
                value={editedBusiness?.description || ""}
                onChange={(e) =>
                  setEditedBusiness({
                    ...editedBusiness!,
                    description: e.target.value,
                  })
                }
              />
            ) : (
              <p className="text-sm leading-relaxed break-words overflow-hidden">
                {business.description}
              </p>
            )}
          </div>
        </div>

        {/* Danh sách công việc */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="mb-0 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#065F46]">Công việc</h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(true);
                }}
                className="text-green-600 hover:text-green-800 flex items-center gap-1 bg-transparent p-1 rounded"
              >
                <PlusCircle size={20} />
                <span className="hidden md:inline">Tạo mới</span>
              </button>
            </div>

            <JobList
              jobs={jobs}
              setJobs={setJobs}
              setIsEditModalOpen={setIsEditModalOpen}
              setSelectedJob={setSelectedJob}
              getStatusLabel={getStatusLabel}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              reviews={reviews}
              influMap={influMap}
              hasMembership={currentType !== null && currentType > 0}
            />
          </div>

          <ActivityStats
            jobs={jobs}
            reviews={reviews}
            getStatusLabel={getStatusLabel}
          />
        </div>
      </div>

      {isCreateModalOpen && business?.id && (
        <CreateJob
          businessId={business.id}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={(newJob) => setJobs((prev) => [...prev, newJob])}
        />
      )}

      {/* Modal UpdateJob */}
      {isEditModalOpen && selectedJob && (
        <UpdateJob
          job={selectedJob}
          onClose={() => setIsEditModalOpen(false)}
          onSave={async (updatedJob) => {
            const accessToken = localStorage.getItem("accessToken");
            if (!accessToken) {
              toast.error("Bạn chưa đăng nhập hoặc token đã hết hạn.");
              return;
            }

            const res = await fetch(
              `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/update-job/${updatedJob.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(updatedJob),
              }
            );

            const responseText = await res.text();
            try {
              const json = JSON.parse(responseText);
              if (res.ok && json.isSuccess) {
                setJobs((prev) =>
                  prev.map((job) =>
                    job.id === updatedJob.id ? updatedJob : job
                  )
                );
                setIsEditModalOpen(false);
                toast.success("Cập nhật thành công!");
              } else {
                toast.error(json.message || "Cập nhật thất bại!");
              }
            } catch (err) {
              console.error("UPDATE ERROR:", err);
              toast.error("Lỗi khi cập nhật.");
            }
          }}
        />
      )}

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mt-[80px]">
        <Footer />
      </div>
    </div>
  );
}
