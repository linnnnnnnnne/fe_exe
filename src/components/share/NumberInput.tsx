//input follower

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
}

export default function NumberInput({ label, value, onChange, required }: NumberInputProps) {
  return (
    <div className="mb-4 ml-4">
      <label className="block text-sm font-medium mb-1 text-black">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-white text-black rounded-md px-1 py-2 w-[860px] max-w-full border border-gray-300"
      />
    </div>
  );
}
