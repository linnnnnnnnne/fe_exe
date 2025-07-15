import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  businessId: string;
  onClose: () => void;
  onCreated: (job: any) => void;
}

interface BusinessField {
  businessFieldId: string;
  name: string;
}

function getLocalDateTime() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default function CreateJob({ businessId, onClose, onCreated }: Props) {
  const [fields, setFields] = useState<BusinessField[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    budget: 0,
    startTime: getLocalDateTime(),
    endTime: getLocalDateTime(),
    require: "",
    status: 0,
    kolBenefits: "",
    gender: 0,
    follower: 0,
    businessFieldId: "",
  });

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch(
          `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/field/get-all-field-of-business/${businessId}`
        );
        const json = await res.json();

        if (json?.isSuccess && Array.isArray(json.data)) {
          const result: BusinessField[] = json.data.map((f: any) => ({
            businessFieldId: f.businessFieldId,
            name: f.fieldName,
          }));
          setFields(result);
        } else {
          toast.error("Không lấy được danh sách lĩnh vực.");
        }
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu lĩnh vực.");
        console.error("❌ fetchFields error:", err);
      }
    };

    fetchFields();
  }, [businessId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ["budget", "follower", "gender"].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.businessFieldId) {
      return toast.error("Vui lòng chọn lĩnh vực trước khi tạo.");
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return toast.error("Bạn chưa đăng nhập.");
    }

    try {
      const res = await fetch(
        "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/jobs/add-job",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ ...form, businessId }),
        }
      );

      const json = await res.json();
      if (res.ok && json.data) {
        toast.success("Tạo công việc thành công!");
        onCreated(json.data);
        onClose();
      } else {
        toast.error(json.message || "Tạo thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi gửi dữ liệu.");
      console.error(err);
    }
  };

  const inputClass = "w-full bg-[#F1F9F9] px-3 py-2 rounded box-border";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-[500px] max-w-[95%] overflow-y-auto max-h-[90vh] scrollbar-hide">
        <h2 className="text-lg font-semibold px-6 pt-6">Tạo công việc mới</h2>

        <div className="space-y-4 px-6 py-4">
          {[
            { label: "Tiêu đề", name: "title", type: "text" },
            { label: "Mô tả công việc", name: "description", type: "textarea" },
            { label: "Địa điểm", name: "location", type: "text" },
            { label: "Ngân sách (VNĐ)", name: "budget", type: "number" },
            {
              label: "Thời gian bắt đầu",
              name: "startTime",
              type: "datetime-local",
            },
            {
              label: "Thời gian kết thúc",
              name: "endTime",
              type: "datetime-local",
            },
            { label: "Yêu cầu KOC", name: "require", type: "text" },
            { label: "Quyền lợi KOC", name: "kolBenefits", type: "text" },
            { label: "Follower tối thiểu", name: "follower", type: "number" },
          ].map(({ label, name, type }) => (
            <div key={name} className="space-y-1">
              <label className="text-sm font-medium">{label}</label>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={form[name as keyof typeof form] as string}
                  onChange={handleChange}
                  className={inputClass}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={form[name as keyof typeof form] as string | number}
                  onChange={handleChange}
                  className={inputClass}
                />
              )}
            </div>
          ))}

          {/* Lĩnh vực */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Lĩnh vực</label>
            <select
              name="businessFieldId"
              value={form.businessFieldId}
              onChange={handleChange}
              className={`${inputClass} h-[42px]`}
            >
              <option value="">-- Chọn lĩnh vực --</option>
              {fields.map((f) => (
                <option key={f.businessFieldId} value={f.businessFieldId}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Giới tính */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Giới tính</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className={`${inputClass} h-[42px]`}
            >
              <option value={0}>Không yêu cầu</option>
              <option value={1}>Nam</option>
              <option value={2}>Nữ</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Tạo
          </button>
        </div>
      </div>
    </div>
  );
}
