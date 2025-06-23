import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  password: string;
  setPassword: (value: string) => void;
}

export function PasswordInput({ password, setPassword }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex items-center justify-between px-7 py-6 mt-5 text-base bg-indigo-50 rounded-lg max-md:px-5 max-md:mt-10">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="flex-1 bg-transparent outline-none text-base appearance-none"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="text-teal bg-indigo-50"
      >
        {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
      </button>
    </div>
  );
}
