import React from "react";
import type { IconType } from "react-icons";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: IconType; // optional icon
}

export default function Input({
  label,
  error,
  icon: Icon,
  ...props
}: InputProps) {
  const displayLabel = error || label;
  const formattedLabel = displayLabel.replace(
    /\*$/,
    (match) => (error ? "" : `<span class="text-red-500">${match}</span>`)
  );

  return (
    <div className="mb-4 w-full max-w-[860px]">
      <label
        className={`block text-sm font-medium mb-1 ${
          error ? "text-red-500" : "text-black"
        }`}
        dangerouslySetInnerHTML={{ __html: formattedLabel }}
      />
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          {...props}
          className={`pr-3 py-2 rounded-md w-full text-sm focus:outline-none ${Icon ? "pl-10" : "pl-3"}`}
          style={{
            backgroundColor: "white",
            color: "black",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: error ? "#ef4444" : "#d1d5db",
            outline: "none",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = error ? "#ef4444" : "#257f6d")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = error ? "#ef4444" : "#d1d5db")
          }
        />
      </div>
    </div>
  );
}
