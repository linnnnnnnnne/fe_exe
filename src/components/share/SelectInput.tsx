
interface SelectInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  required?: boolean;
  error?: string;
}

export default function SelectInput({
  label,
  value,
  onChange,
  options,
  error,
}: SelectInputProps) {
  const displayLabel = error || label;
  const formattedLabel = displayLabel.replace(
    /\*$/,
    () => (error ? "" : `<span class="text-red-500">*</span>`)
  );

  return (
    <div className="mb-4 ml-4">
      <label
        className={`block text-sm font-medium mb-1 ${
          error ? "text-red-500" : "text-black"
        }`}
        dangerouslySetInnerHTML={{ __html: formattedLabel }}
      />
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-md px-1 py-2 focus:outline-none w-[860px] max-w-full"
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
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
