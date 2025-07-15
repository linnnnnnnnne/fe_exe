import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, MapPin, Eye, Star, ChevronRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { useChatbotContext } from "../../contexts/ChatbotContext";

interface KOCCardProps {
  kocId: string;
  kocName: string;
  matchScore: number;
}

interface InfluencerData {
  influId: string;
  userId: string;
  name: string;
  nickName: string;
  area: string;
  linkImage: string;
  follower: number;
  bio: string;
  dateOfBirth?: string;
  gender?: number;
  phoneNumber?: string;
  portfolio_link?: string;
  linkmxh?: string[];
  fieldNames?: string[];
}

const KOCCard: React.FC<KOCCardProps> = ({
  kocId,
  kocName: _kocName,
  matchScore,
}) => {
  const navigate = useNavigate();
  const { closeChatbox } = useChatbotContext();
  const [influencerData, setInfluencerData] = useState<InfluencerData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchInfluencerData = async () => {
      try {
        setLoading(true);
        const apiBase =
          "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api";

        // Fetch full influencer data by userId
        const res = await fetch(
          `${apiBase}/influ/get-influ-by-userId/${kocId}`
        );
        const json = await res.json();

        if (json.isSuccess && json.data) {
          const influ = json.data;

          // Fetch field names
          let fieldNames: string[] = [];
          try {
            const fieldRes = await fetch(
              `${apiBase}/field/get-all-field-of-influ/${influ.influId}`
            );
            const fieldJson = await fieldRes.json();
            if (fieldJson.isSuccess && Array.isArray(fieldJson.data)) {
              fieldNames = fieldJson.data
                .filter((f: any) => f.name && f.name.trim() !== "")
                .map((f: any) => f.name.trim());
            }
          } catch (fieldErr) {
            console.warn("Could not fetch field names:", fieldErr);
          }

          setInfluencerData({ ...influ, fieldNames });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching influencer data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (kocId) {
      fetchInfluencerData();
    }
  }, [kocId]);

  const handleNavigateToDetail = async () => {
    if (!influencerData) return;

    // Close chatbot before navigation
    closeChatbox();

    try {
      const apiBase =
        "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api";

      // Fetch jobs data for the influencer
      const [completed, inProgress] = await Promise.all([
        fetch(
          `${apiBase}/freelance-jobs/influencer/${influencerData.influId}/jobs/completed`
        ).then((r) => r.json()),
        fetch(
          `${apiBase}/freelance-jobs/influencer/${influencerData.influId}/jobs/in-progress`
        ).then((r) => r.json()),
      ]);

      const jobs = [
        ...(completed?.data || []).map((j: any) => j.job),
        ...(inProgress?.data || []).map((j: any) => j.job),
      ];

      // Navigate to detail page with complete data
      navigate("/influ_detail", {
        state: {
          influencer: {
            influId: influencerData.influId,
            userId: influencerData.userId,
            name: influencerData.name,
            nickName: influencerData.nickName,
            area: influencerData.area,
            linkImage: influencerData.linkImage,
            dateOfBirth: influencerData.dateOfBirth,
            gender: influencerData.gender,
            phoneNumber: influencerData.phoneNumber,
            portfolio_link: influencerData.portfolio_link,
            linkmxh: influencerData.linkmxh || [],
            follower: influencerData.follower || 0,
            bio: influencerData.bio,
            jobs,
          },
        },
      });
    } catch (err) {
      console.error("Error navigating to detail:", err);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getMatchScoreText = (score: number) => {
    if (score >= 80) return "Rất phù hợp";
    if (score >= 60) return "Khá phù hợp";
    return "Tạm phù hợp";
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-teal/20 p-4 shadow-lg max-w-sm"
      >
        <div className="flex items-center justify-center gap-2 text-teal100">
          <Loader className="animate-spin" size={20} />
          <span className="text-sm font-montserrat">Đang tải thông tin...</span>
        </div>
      </motion.div>
    );
  }

  if (error || !influencerData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-red-200 p-4 shadow-lg max-w-sm"
      >
        <div className="text-center text-red-600">
          <User size={24} className="mx-auto mb-2" />
          <p className="text-sm font-montserrat">
            Không thể tải thông tin KOL/KOC
          </p>
          <p className="text-xs text-gray-500 mt-1">ID: {kocId}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white to-lightgreen/10 rounded-xl border border-teal/20 p-5 shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm font-montserrat"
    >
      {/* Header with match score */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getMatchScoreColor(
            matchScore
          )}`}
        >
          {matchScore}% • {getMatchScoreText(matchScore)}
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-medium">Gợi ý AI</span>
        </div>
      </div>

      {/* Avatar and basic info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal/20 shadow-md">
            <img
              src={influencerData.linkImage || "/default-avatar.png"}
              alt={influencerData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default-avatar.png";
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-teal200 leading-tight">
            {influencerData.name}
          </h3>
          <p className="text-sm text-gray-600 italic">
            @{influencerData.nickName || "influencer"}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={12} />
            <span>{influencerData.area || "Không rõ"}</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {influencerData.bio && (
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">
          "{influencerData.bio}"
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 p-3 bg-lightgreen/20 rounded-lg">
        <div className="text-center">
          <div className="flex items-center gap-1 text-teal100">
            <Eye size={14} />
            <span className="text-xs font-medium">Followers</span>
          </div>
          <p className="text-sm font-bold text-teal200">
            {influencerData.follower?.toLocaleString() || "0"}
          </p>
        </div>

        {influencerData.fieldNames && influencerData.fieldNames.length > 0 && (
          <div className="text-center flex-1 ml-4">
            <div className="text-xs text-gray-600 mb-1">Lĩnh vực</div>
            <div className="flex flex-wrap gap-1">
              {influencerData.fieldNames.slice(0, 2).map((field, index) => (
                <span
                  key={index}
                  className="text-xs bg-teal/10 text-teal200 px-2 py-1 rounded-full"
                >
                  {field}
                </span>
              ))}
              {influencerData.fieldNames.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{influencerData.fieldNames.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNavigateToDetail}
        className="w-full bg-gradient-to-r from-teal to-teal100 text-white px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-200"
      >
        <span>Xem chi tiết profile</span>
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

export default KOCCard;
