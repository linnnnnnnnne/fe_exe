import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  avatar: string;
  rating: number;
  feedback?: string;
  jobTitle?: string;
}

export default function ReviewCard({
  name,
  avatar,
  rating,
  feedback,
  jobTitle,
}: ReviewCardProps) {
  return (
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt="avatar"
          className="w-12 h-12 mt-0 ml-1 mb-6 rounded-full object-cover"
        />
        <div className="flex flex-col ml-1">
          <h3 className="font-semibold text-gray-800 leading-tight mb-1 mt-0">
            {name}
          </h3>
          {jobTitle && (
            <p className="text-xs text-gray-800 mt-0 mb-1">
              <span className="font-medium text-gray-600">Công việc:</span>{" "}
              {jobTitle}
            </p>
          )}
          <div className="flex gap-1  text-orange-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`stroke-orange-400 ${
                  i < rating ? "fill-orange-400" : "fill-transparent"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-700 italic mt-2 mb-0 ">
        “{feedback?.trim() || "Không có nhận xét"}”
      </p>
        </div>


    </div>
  );
}
