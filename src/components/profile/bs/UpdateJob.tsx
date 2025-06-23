import { useState } from "react";

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

interface UpdateJobProps {
  job: Job;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
}

export default function UpdateJob({ job, onClose, onSave }: UpdateJobProps) {
  const [editedJob, setEditedJob] = useState<Job>({ ...job });

  const inputClass = "w-full border px-3 py-2 rounded box-border";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl w-[500px] max-w-[95%] overflow-y-auto max-h-[90vh] scrollbar-hide">
        <h2 className="text-lg font-semibold px-6 pt-6">Chỉnh sửa công việc</h2>

        <div className="space-y-4 px-6 py-4">
          {[
            { label: "Tên công việc", key: "title", type: "text" },
            { label: "Mô tả công việc", key: "description", type: "textarea" },
            { label: "Địa điểm", key: "location", type: "text" },
            { label: "Ngân sách (VNĐ)", key: "budget", type: "number" },
            { label: "Thời gian bắt đầu", key: "startTime", type: "datetime-local" },
            { label: "Thời gian kết thúc", key: "endTime", type: "datetime-local" },
            { label: "Yêu cầu", key: "require", type: "text" },
            { label: "Quyền lợi", key: "kolBenefits", type: "text" },
            { label: "Follower yêu cầu", key: "follower", type: "number" }
          ].map(({ label, key, type }) => (
            <div className="space-y-1" key={key}>
              <label className="text-sm font-medium">{label}</label>
              {type === "textarea" ? (
                <textarea
                  className={inputClass}
                  value={editedJob[key as keyof Job] as string}
                  onChange={(e) =>
                    setEditedJob({ ...editedJob, [key]: e.target.value })
                  }
                />
              ) : (
                <input
                  type={type}
                  className={inputClass}
                  value={editedJob[key as keyof Job] as string | number}
                  onChange={(e) =>
                    setEditedJob({
                      ...editedJob,
                      [key]:
                        type === "number"
                          ? parseInt(e.target.value) || 0
                          : e.target.value,
                    })
                  }
                />
              )}
            </div>
          ))}

          {/* Giới tính */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Giới tính</label>
            <select
              value={editedJob.gender}
              onChange={(e) =>
                setEditedJob({
                  ...editedJob,
                  gender: parseInt(e.target.value),
                })
              }
              className="w-full border px-3 py-2 rounded appearance-none box-border h-[42px]"
            >
              <option value={0}>Nam</option>
              <option value={1}>Nữ</option>
              <option value={2}>Bất kỳ</option>
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
            onClick={() => onSave(editedJob)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}