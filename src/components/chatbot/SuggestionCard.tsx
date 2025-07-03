import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Star, Users, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuggestedMatch {
  id: string;
  name: string;
  type: "koc" | "business";
  matchScore: number;
  reasons: string[];
}

interface SuggestionCardProps {
  suggestion: SuggestedMatch;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (suggestion.type === "business" && suggestion.id) {
      // Navigate đến chi tiết job
      navigate(`/jobs/${suggestion.id}`);
    } else if (suggestion.type === "koc" && suggestion.id) {
      // Navigate đến profile KOC
      navigate(`/profileKOC/${suggestion.id}`);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Rất phù hợp";
    if (score >= 60) return "Phù hợp";
    return "Có thể phù hợp";
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4 },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center"
          >
            {suggestion.type === "business" ? (
              <Briefcase size={16} className="text-white" />
            ) : (
              <Users size={16} className="text-white" />
            )}
          </motion.div>

          <div>
            <h4 className="font-semibold text-gray-800 text-sm">
              {suggestion.type === "business"
                ? "💼 Công việc được gợi ý"
                : "👤 KOL/KOC được gợi ý"}
            </h4>
            <p className="text-xs text-gray-600">
              {suggestion.type === "business"
                ? "Dựa trên profile của bạn"
                : "Dựa trên yêu cầu của bạn"}
            </p>
          </div>
        </div>

        {/* Match Score */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`px-3 py-1 rounded-full text-xs font-bold ${getScoreColor(
            suggestion.matchScore
          )}`}
        >
          {suggestion.matchScore}% - {getScoreText(suggestion.matchScore)}
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Name */}
        <div>
          <h5 className="font-semibold text-gray-900 text-base mb-1">
            {suggestion.name}
          </h5>
        </div>

        {/* Reasons */}
        <div>
          <p className="text-xs font-medium text-gray-600 mb-2">
            ✨ Lý do phù hợp:
          </p>
          <div className="space-y-1">
            {suggestion.reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 text-xs text-gray-700"
              >
                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                <span>{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-1"
          >
            <ExternalLink size={12} />
            {suggestion.type === "business"
              ? "Xem chi tiết job"
              : "Xem profile KOC"}
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Độ phù hợp</span>
          <span>{suggestion.matchScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${suggestion.matchScore}%` }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className={`h-2 rounded-full ${
              suggestion.matchScore >= 80
                ? "bg-gradient-to-r from-green-400 to-green-500"
                : suggestion.matchScore >= 60
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                : "bg-gradient-to-r from-red-400 to-red-500"
            }`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SuggestionCard;
 