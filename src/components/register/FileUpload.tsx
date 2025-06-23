import { useState } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

interface FileUploadProps {
  label: string;
  onUploaded: (url: string) => void;
  error?: string;
}

export default function FileUpload({
  label,
  onUploaded,
  error,
}: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null); // ID ảnh cũ để xoá

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File vượt quá 5MB!");
      return;
    }

    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];

      console.log("Gửi oldFileId:", fileId);

      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbz7EwAWJZtwQbgl232pxAZex6wsfkbpqC-KG3xpAM5LOVzNt3xXa85EIG2HkRDx3Mzx/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            fileContent: base64,
            fileName: file.name,
            mimeType: file.type,
            oldFileId: fileId || "", // Gửi file cũ để xoá
          }),
        }
      );

      const result = await res.json();
      console.log("Upload response:", result);

      if (result.url) {
        if (result.fileId) {
          setFileId(result.fileId); // Lưu lại ID ảnh mới
        }
        setFileUrl(result.url);
        onUploaded(result.url);
      } else {
        alert("Upload thất bại. Vui lòng thử lại.");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const displayLabel = error || label;
  const formattedLabel = displayLabel.replace(
    /\*$/,
    (match) => `<span class="text-red-500">${match}</span>`
  );

  return (
    <div className="mb-4 ml-0 w-full max-w-[886px]">
      {/* Label */}
      <label
        className={`block mb-2 text-sm font-medium ${
          error ? "text-red-500" : "text-black"
        }`}
        dangerouslySetInnerHTML={{ __html: formattedLabel }}
      />

      {/* Container */}
      <div
        className={`bg-white text-black rounded-md px-1 py-2 text-sm text-gray-500 text-center border border-dashed ${
          error ? "border-red-500" : "border"
        }`}
      >
        <div className="mt-4 mb-2">Kéo & thả hình ảnh</div>
        <div className="mb-2">JPEG, PNG. File tối đa là 5 MB</div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id={`upload-${label}`}
        />

        {/* Upload button */}
        <label
          htmlFor={`upload-${label}`}
          className={`mt-4 mb-3 inline-flex items-center gap-2 justify-center px-4 py-2 rounded transition text-sm font-medium
            ${
              loading
                ? "bg-gray-300 text-black cursor-wait"
                : fileUrl
                ? "bg-green-500 text-white cursor-pointer hover:bg-green-600"
                : "bg-gainsboro-100 text-black cursor-pointer hover:bg-darkgray"
            }
          `}
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              Vui lòng chờ...
            </>
          ) : fileUrl ? (
            <>
              <FaCheckCircle className="text-white" />
              Tải lên thành công (bấm để thay đổi)
            </>
          ) : (
            "Upload ảnh"
          )}
        </label>
      </div>
    </div>
  );
}
