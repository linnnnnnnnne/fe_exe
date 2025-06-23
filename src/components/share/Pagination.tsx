import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-8 text-white">
      {/* Nút trái */}
      <button
        className="w-10 h-10 rounded-full bg-teal100 flex items-center justify-center hover:bg-teal200 text-white transition disabled:opacity-40"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Vùng nhập trang */}
      <div className="flex items-center px-4 py-2.5 bg-teal100 rounded-full gap-2 text-sm">
        <span>Trang</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const newPage = parseInt(e.target.value);
            if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
              onPageChange(newPage);
            }
          }}
          className="w-10 text-center bg-transparent border border-gray-500 rounded-md text-white outline-none"
        />
        <span>/ {totalPages}</span>
      </div>

      {/* Nút phải */}
      <button
        className="w-10 h-10 rounded-full bg-teal100 flex items-center justify-center hover:bg-teal200 text-white transition disabled:opacity-40"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
