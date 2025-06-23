import { useState } from "react";
import { Edit } from "lucide-react"; 

interface FileUploadAvatarProps {
  onUploaded: (url: string) => void;
  imageUrl?: string;
}

export default function FileUploadAvatar({ onUploaded, imageUrl }: FileUploadAvatarProps) {
  const [loading, setLoading] = useState(false);

  const cloudName = "dr4oue4bl";
  const uploadPreset = "imageExe";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File vượt quá 5MB!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        onUploaded(data.secure_url);
      } else {
        alert("Upload thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Đã xảy ra lỗi khi upload.");
    }

    setLoading(false);
  };

  return (
    <div className="relative group w-[100px] h-[100px]">
      <img
        src={imageUrl || "/default-avatar.png"}
        alt="avatar"
        className="w-full h-full rounded-full object-cover border border-lightgray"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="upload-avatar"
      />
      <label
        htmlFor="upload-avatar"
        className="absolute bottom-1 right-0 bg-lightgray hover:bg-lightgreen text-black rounded-full w-8 h-8 flex items-center justify-center text-xs cursor-pointer group-hover:flex"
        title="Thay ảnh"
      >
        <Edit size={14} /> 
      </label>
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full text-xs text-gray-600">
          ...
        </div>
      )}
    </div>
  );
}
