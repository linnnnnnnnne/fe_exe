import React from "react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";
import Input from "../../components/share/Input";
import FieldCheckbox from "../../components/register/FieldCheckbox";
import FileUpload from "../../components/share/FileUpload";

export default function InfoFields({
  today,
  fields,
  formData,
  setFormData,
  showErrors,
}: {
  today: string;
  fields: any[];
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  showErrors: boolean;
}) {
  const handleChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [key]: e.target.value });
    };

  const passwordMismatch =
    formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <>
      {/* 1. Thông tin tài khoản đăng nhập */}
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-4">
          1. Thông tin tài khoản đăng nhập
        </h2>
        <Input
          label="Email đăng nhập *"
          type="email"
          required
          value={formData.email}
          onChange={handleChange("email")}
          error={
            showErrors
              ? !formData.email
                ? "Vui lòng nhập email"
                : !/^[^\s@]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
                    formData.email
                  )
                ? "Email không hợp lệ. Vui lòng dùng Gmail, Yahoo, Hotmail, Outlook hoặc tên miền công ty"
                : ""
              : ""
          }
        />

        <Input
          label="Mật khẩu *"
          type="password"
          required
          value={formData.password}
          onChange={handleChange("password")}
          error={
            showErrors
              ? !formData.password
                ? "Vui lòng nhập mật khẩu"
                : formData.password.length < 6
                ? "Mật khẩu phải có ít nhất 6 ký tự"
                : ""
              : ""
          }
        />

        <Input
          label={
            passwordMismatch
              ? "Xác nhận mật khẩu * (không khớp)"
              : "Xác nhận mật khẩu *"
          }
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={
            passwordMismatch
              ? "Mật khẩu không khớp"
              : showErrors && !formData.confirmPassword
              ? "Vui lòng xác nhận mật khẩu"
              : ""
          }
        />
      </div>

      {/* 2. Thông tin cá nhân */}
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-4">2. Thông tin cá nhân</h2>
        <Input
          label="CCCD hoặc số Hộ chiếu *"
          required
          value={formData.cccd}
          onChange={handleChange("cccd")}
          error={
            showErrors && !formData.cccd
              ? "Vui lòng nhập CCCD hoặc hộ chiếu"
              : ""
          }
        />
        <Input
          label="Họ và tên *"
          required
          value={formData.name}
          onChange={handleChange("name")}
          error={showErrors && !formData.name ? "Vui lòng nhập họ và tên" : ""}
        />
        <Input
          label="Nickname *"
          required
          value={formData.nickName}
          onChange={handleChange("nickName")}
          error={
            showErrors && !formData.nickName ? "Vui lòng nhập nickname" : ""
          }
        />
        <Input
          label="Bio (Mô tả ngắn)"
          value={formData.bio}
          onChange={handleChange("bio")}
        />
        <Input
          label="Ngày sinh *"
          type="date"
          max={today}
          required
          value={formData.dateOfBirth}
          onChange={handleChange("dateOfBirth")}
          error={
            showErrors && !formData.dateOfBirth ? "Vui lòng nhập ngày sinh" : ""
          }
        />

        <div className="mb-4">
          <label
            className={`block text-sm font-medium mb-1 ${
              showErrors && !formData.gender ? "text-red-500" : "text-black"
            }`}
          >
            Giới tính *
          </label>
          <select
            required
            className="w-[888px] px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
            style={{
              borderColor:
                showErrors && !formData.gender ? "#ef4444" : "#d1d5db",
            }}
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Không xác định</option>
          </select>
          {showErrors && !formData.gender && (
            <div className="text-red-500 text-sm mt-1">
              Vui lòng chọn giới tính
            </div>
          )}
        </div>

        <Input
          label="Số điện thoại *"
          required
          value={formData.phoneNumber}
          onChange={handleChange("phoneNumber")}
          error={
            showErrors
              ? !formData.phoneNumber
                ? "Vui lòng nhập số điện thoại"
                : !/^0\d{9}$/.test(formData.phoneNumber)
                ? "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0"
                : ""
              : ""
          }
        />
        <Input
          label="Nơi sinh sống"
          placeholder="VD: TP.HCM, Hà Nội..."
          value={formData.area}
          onChange={handleChange("area")}
        />

        <FieldCheckbox
          fields={fields}
          selected={formData.fieldIds}
          onChange={(newIds) => setFormData({ ...formData, fieldIds: newIds })}
          showError={showErrors}
        />

        <Input
          label="Số người theo dõi cao nhất mà bạn có:"
          type="number"
          placeholder="VD: 10000"
          value={formData.follower}
          onChange={handleChange("follower")}
        />

        <div className="max-w-[832px]">
          <div className="mb-1 text-sm font-medium text-black">Mạng xã hội:</div>
          {showErrors &&
            !(formData.facebook || formData.instagram || formData.tiktok) && (
              <div className="text-red-500 text-sm mb-2">
                Vui lòng nhập ít nhất một mạng xã hội
              </div>
            )}
          <div className="pl-8">
            <Input
              label="Facebook"
              placeholder="https://www.facebook.com/abc"
              icon={FaFacebook}
              value={formData.facebook}
              onChange={handleChange("facebook")}
            />
            <Input
              label="Instagram"
              placeholder="https://www.instagram.com/abc"
              icon={FaInstagram}
              value={formData.instagram}
              onChange={handleChange("instagram")}
            />
            <Input
              label="TikTok"
              placeholder="https://www.tiktok.com/abc"
              icon={FaTiktok}
              value={formData.tiktok}
              onChange={handleChange("tiktok")}
            />
          </div>
        </div>

        <FileUpload
          label="Ảnh đại diện *"
          onUploaded={(url) => setFormData({ ...formData, linkImage: url })}
          error={
            showErrors && !formData.linkImage ? "Vui lòng tải lên ảnh" : ""
          }
        />

        <Input
          label="Portfolio link *"
          required
          value={formData.portfolio_link}
          onChange={handleChange("portfolio_link")}
          error={
            showErrors && !formData.portfolio_link
              ? "Vui lòng nhập link portfolio"
              : ""
          }
        />
      </div>
    </>
  );
}
