interface Field {
  id: string;
  name?: string;
  title?: string;
  fieldName?: string;
}

interface Props {
  fields: Field[];
  selected: string[];
  onChange: (updated: string[]) => void;
  showError?: boolean;
}

export default function FieldCheckboxGroup({
  fields,
  selected,
  onChange,
  showError,
}: Props) {
  const toggle = (id: string) => {
    const updated = selected.includes(id)
      ? selected.filter((x) => x !== id)
      : [...selected, id];
    onChange(updated);
  };

  const hasError = showError && selected.length === 0;

  // Hiển thị label có tô đỏ dấu * nếu lỗi
  const rawLabel = hasError ? "Vui lòng chọn ít nhất một lĩnh vực" : "Lĩnh vực hoạt động *";
  const formattedLabel = rawLabel.replace(
    /\*$/,
    (match) => `<span class="text-red-500">${match}</span>`
  );

  return (
    <div className="mb-4">
      <label
        className={`block text-sm font-medium mb-2 ${hasError ? "text-red-500" : "text-black"}`}
        dangerouslySetInnerHTML={{ __html: formattedLabel }}
      />

      <div className="grid grid-cols-2 gap-2">
        {fields.map((field) => (
          <label key={field.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 accent-teal"
              checked={selected.includes(field.id)}
              onChange={() => toggle(field.id)}
            />
            {field.name || field.title || field.fieldName || `ID: ${field.id}`}
          </label>
        ))}
      </div>
    </div>
  );
}
