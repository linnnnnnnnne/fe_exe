import { useEffect, useState } from "react";
import Headerrr from "../../components/share/Headerrr";
import ListJobs from "../../components/jobs/ListJobs";
import type { Job } from "../../components/jobs/ListJobs";
import Footer from "../../components/share/Footer";
import { Search } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

interface Field {
  id: string;
  name: string;
}

export default function JobPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  useEffect(() => {
    fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/field/get-all")
      .then((res) => res.json())
      .then((data) => {
        const fieldList = Array.isArray(data) ? data : data.data;
        setFields(fieldList || []);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API field:", err);
        setFields([]);
      });
  }, []);

  const enrichJobsWithFieldName = (jobList: Job[]) => {
    return jobList.map((job) => {
      const fieldId = job.businessField?.fieldId;
      const matchedField = fields.find((f) => f.id === fieldId);
      return {
        ...job,
        fieldName: matchedField?.name || "Không rõ",
      };
    });
  };

  useEffect(() => {
    const fetchJobsByField = async () => {
      setLoading(true);
      try {
        let result: Job[] = [];
        if (selectedField === "") {
          const res = await fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-all");
          const data = await res.json();
          result = Array.isArray(data) ? data : data.data || [];
        } else {
          const res = await fetch(
            `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/search/by-field-name?fieldName=${encodeURIComponent(
              selectedField
            )}`
          );
          const data = await res.json();
          result = Array.isArray(data) ? data : data.data || [];
        }
        setJobs(enrichJobsWithFieldName(result));
      } catch (err) {
        console.error("Lỗi khi lọc theo lĩnh vực:", err);
      }
      setLoading(false);
    };

    fetchJobsByField();
  }, [selectedField, fields]);

  const handleFilter = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-all");
      const data = await res.json();
      let allJobs: Job[] = Array.isArray(data) ? data : data.data || [];

      allJobs = enrichJobsWithFieldName(allJobs);

      let result = allJobs;

      if (minBudget || maxBudget) {
        const min = parseFloat(minBudget) || 0;
        const max = parseFloat(maxBudget) || Infinity;
        result = result.filter((job) => {
          const budget = Number(job.budget || 0);
          return budget >= min && budget <= max;
        });
      }

      if (selectedField && selectedField !== "Tất cả") {
        const keyword = selectedField.toLowerCase();
        result = result.filter((job) =>
          job.fieldName?.toLowerCase().includes(keyword)
        );
      }

      setJobs(result);
    } catch (err) {
      console.error("Lỗi lọc ngân sách:", err);
    }
    setLoading(false);
  };

  const handleSearchByName = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/search/by-business-name?businessName=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      const result = Array.isArray(data) ? data : data.data || [];
      setJobs(enrichJobsWithFieldName(result));
    } catch (err) {
      console.error("Search by name failed:", err);
    }
    setLoading(false);
  };

  const handleSearchByLocation = async () => {
    if (!locationQuery.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/filter/by-location?location=${encodeURIComponent(
          locationQuery
        )}`
      );
      const data = await res.json();
      const result = Array.isArray(data) ? data : data.data || [];
      setJobs(enrichJobsWithFieldName(result));
    } catch (err) {
      console.error("Search by location failed:", err);
    }
    setLoading(false);
  };

  const handleSearchByStatus = async (statusValue: string) => {
    if (statusValue === "") return;
    setLoading(true);
    try {
      const res = await fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-all");
      const data = await res.json();
      const allJobs: Job[] = Array.isArray(data) ? data : data.data || [];

      const filtered = allJobs.filter(
        (job) => job.status === Number(statusValue)
      );

      setJobs(enrichJobsWithFieldName(filtered));
    } catch (err) {
      console.error("Search by status failed:", err);
    }
    setLoading(false);
  };

  const handleCombinedSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/jobs/get-all");
      const data = await res.json();
      let allJobs: Job[] = Array.isArray(data) ? data : data.data || [];

      if (searchQuery.trim()) {
        const keyword = searchQuery.trim().toLowerCase();
        allJobs = allJobs.filter(
          (job) =>
            job.business?.name?.toLowerCase().includes(keyword) ||
            job.title?.toLowerCase().includes(keyword)
        );
      }

      if (locationQuery.trim()) {
        const location = locationQuery.trim().toLowerCase();
        allJobs = allJobs.filter((job) =>
          job.location?.toLowerCase().includes(location)
        );
      }

      if (selectedField.trim()) {
        const field = selectedField.toLowerCase();
        allJobs = allJobs.filter(
          (job) =>
            job.title?.toLowerCase().includes(field) ||
            job.business?.name?.toLowerCase().includes(field)
        );
      }

      if (minBudget || maxBudget) {
        allJobs = allJobs.filter((job: any) => {
          const budget = job?.budget || 0;
          const min = minBudget ? parseFloat(minBudget) : 0;
          const max = maxBudget ? parseFloat(maxBudget) : Infinity;
          return budget >= min && budget <= max;
        });
      }

      if (selectedStatus !== "") {
        allJobs = allJobs.filter(
          (job) => String(job.status) === selectedStatus
        );
      }

      setJobs(enrichJobsWithFieldName(allJobs));
    } catch (err) {
      console.error("Combined full search failed:", err);
    }
    setLoading(false);
  };
  return (
    <div className="bg-[#FBFBFB] min-h-screen">
      <Headerrr />

      <div className="max-w-full mx-auto px-4 pt-7">
        <h1 className="text-3xl font-bold text-teal mb-6 font-montserrat text-center">
          TOP CÔNG VIỆC PHỔ BIẾN
        </h1>

        <div className="flex gap-[60px] items-stretch font-montserrat mb-20 px-[30px]">
          <aside className="w-full lg:w-[440px] mt-[25px]">
            <div className="bg-[#C7D7D3] rounded-xl p-4 shadow-lg">
              <div className="px-6 pt-0 text-teal space-y-6 mb-1.75">
                <div>
                  <p className="font-bold text-xl mb-3">Lĩnh vực hoạt động</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedField("")}
                      className={`px-4 py-1 rounded-full border transition duration-200 hover:scale-105 ${
                        selectedField === ""
                          ? "bg-teal text-white"
                          : "bg-white text-teal"
                      }`}
                    >
                      Tất cả
                    </button>
                    {fields.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => setSelectedField(field.name)}
                        className={`px-4 py-1 text-sm rounded-full border transform transition-transform duration-150 ease-out hover:scale-105 ${
                          selectedField === field.name
                            ? "bg-teal text-white"
                            : "bg-white text-teal"
                        }`}
                      >
                        {field.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Mức lương kỳ vọng (dùng thanh trượt, không có nút áp dụng) */}
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-teal mb-2">
                      Mức lương kỳ vọng
                    </h2>
                    <div className="text-sm text-gray-700 mb-2">
                      Từ {Number(minBudget).toLocaleString()} đến{" "}
                      {Number(maxBudget || 50000000).toLocaleString()} VND
                    </div>
                    <div className="px-2 pt-1 pb-4">
                      <Slider
                        range
                        min={0}
                        max={50000000}
                        step={100000}
                        value={[
                          Number(minBudget) || 0,
                          Number(maxBudget) || 50000000,
                        ]}
                        onChange={(values: number | number[]) => {
                          if (Array.isArray(values)) {
                            setMinBudget(values[0].toString());
                            setMaxBudget(values[1].toString());
                          }
                        }}
                        onAfterChange={handleFilter}
                        trackStyle={[{ backgroundColor: "#0f766e" }]}
                        handleStyle={[
                          {
                            borderColor: "#0f766e",
                            backgroundColor: "#0f766e",
                          },
                          {
                            borderColor: "#0f766e",
                            backgroundColor: "#0f766e",
                          },
                        ]}
                        railStyle={{ backgroundColor: "#ccc" }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      Kéo 2 đầu để chọn khoảng lương mong muốn
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="w-[70%]">
            <div className="mb-6 w-full">
              <div className="flex gap-4 items-end flex-wrap">
                <div className="flex-1 min-w-[260px]">
                  <label className="block text-sm font-medium text-teal mb-1">
                    Từ khóa
                  </label>
                  <div className="flex h-[50px] rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-md">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tên công ty, từ khóa"
                      className="flex-1 px-5 text-[15px] text-gray-900 placeholder-gray-500 outline-none"
                    />
                    <button
                      onClick={handleSearchByName}
                      className="bg-white text-teal w-[50px] h-[50px] flex items-center justify-center hover:text-teal-700 transition"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-[260px]">
                  <label className="block text-sm font-medium text-teal mb-1">
                    Khu vực
                  </label>
                  <div className="flex h-[50px] rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-md">
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      placeholder="Thành phố, quận, huyện"
                      className="flex-1 px-5 text-[15px] text-gray-900 placeholder-gray-500 outline-none"
                    />
                    <button
                      onClick={handleSearchByLocation}
                      className="bg-white text-teal w-[50px] h-[50px] flex items-center justify-center hover:text-teal-700 transition"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-[220px]">
                  <label className="block text-sm font-medium text-teal mb-1">
                    Trạng thái
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedStatus(value);
                      if (value !== "") {
                        handleSearchByStatus(value); // truyền giá trị trực tiếp
                      }
                    }}
                    className="w-full h-[50px] text-[14px] px-4 rounded-2xl border border-gray-300 bg-white text-gray-900 shadow-md outline-none"
                  >
                    <option value="">Tất cả</option>
                    <option value="0">Available</option>
                    <option value="1">Đang thực hiện</option>
                    <option value="2">Đã Hoàn thành</option>
                    <option value="4">Hết hạn đăng ký</option>
                  </select>
                </div>

                <div className="self-end">
                  <button
                    onClick={handleCombinedSearch}
                    className="h-[50px] text-[15px] px-6 bg-teal200 text-white rounded-2xl hover:bg-teal transition"
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </div>

            <ListJobs jobs={jobs} loading={loading} />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
