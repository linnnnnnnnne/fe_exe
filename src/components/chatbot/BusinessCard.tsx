import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building,
  MapPin,
  DollarSign,
  Star,
  ChevronRight,
  Loader,
  Users,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useChatbotContext } from "../../contexts/ChatbotContext";

interface BusinessCardProps {
  jobId: string;
  jobTitle: string;
  matchScore: number;
}

interface JobData {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  follower: number;
  startTime: string;
  endTime: string;
  require: string;
  status: number;
  businessId: string;
  business?: {
    id: string;
    name: string;
    address: string;
    logo: string;
    userId: string;
    description?: string;
  };
  fieldName?: string;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ jobId, matchScore }) => {
  const navigate = useNavigate();
  const { closeChatbox } = useChatbotContext();
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);
        const apiBase =
          "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api";

        // Fetch all jobs and find the specific job by ID
        const res = await fetch(`${apiBase}/jobs/get-all`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        const allJobs = Array.isArray(json) ? json : json.data || [];

        // Find the specific job by ID
        const foundJob = allJobs.find((job: any) => job.id === jobId);

        if (foundJob) {
          const jobWithField = foundJob;

          // Fetch field name if businessField exists
          if (foundJob.businessField?.fieldId) {
            try {
              const fieldRes = await fetch(
                `${apiBase}/field/get-by-id/${foundJob.businessField.fieldId}`
              );
              const fieldJson = await fieldRes.json();
              if (fieldJson.isSuccess && fieldJson.data?.name) {
                jobWithField.fieldName = fieldJson.data.name;
              }
            } catch (fieldErr) {
              console.warn("Could not fetch field name:", fieldErr);
              jobWithField.fieldName = "Không xác định";
            }
          }

          setJobData(jobWithField);
        } else {
          console.warn(`Job with ID ${jobId} not found`);
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching job data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId]);

  const handleNavigateToDetail = () => {
    if (!jobData || !jobData.business) return;

    // Close chatbot before navigation
    closeChatbox();

    // Navigate to business detail page with proper state structure
    navigate("/business_detail", {
      state: {
        businessId: jobData.businessId,
        businessName: jobData.business.name,
        businessAddress: jobData.business.address,
        businessLogo: jobData.business.logo,
        businessUserId: jobData.business.userId,
      },
    });
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

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Đang tuyển";
      case 1:
        return "Đang thực hiện";
      case 2:
        return "Hoàn thành";
      case 3:
        return "Đã hủy";
      case 4:
        return "Hết hạn đăng ký";
      default:
        return "Không xác định";
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("vi-VN");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không rõ";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return "Không rõ";
    }
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

  if (error || !jobData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-red-200 p-4 shadow-lg max-w-sm"
      >
        <div className="text-center text-red-600">
          <Building size={24} className="mx-auto mb-2" />
          <p className="text-sm font-montserrat">
            Không thể tải thông tin công việc
          </p>
          <p className="text-xs text-gray-500 mt-1">ID: {jobId}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-white to-blue-50/30 rounded-xl border border-teal/20 p-5 shadow-lg hover:shadow-xl transition-all duration-300 max-w-sm font-montserrat"
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

      {/* Company logo and basic info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative">
          {jobData.business?.logo ? (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal/20 shadow-md">
              <img
                src={jobData.business.logo}
                alt={jobData.business.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              <div className="hidden w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {jobData.business.name?.charAt(0) || "B"}
              </div>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-teal/20 shadow-md">
              {jobData.business?.name?.charAt(0) || "B"}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-teal200 leading-tight">
            {jobData.title}
          </h3>
          <p className="text-sm text-gray-600 italic">
            {jobData.business?.name || "Không rõ"}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={12} />
            <span>
              {jobData.location || jobData.business?.address || "Không rõ"}
            </span>
          </div>
        </div>
      </div>

      {/* Job description */}
      {jobData.description && (
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-2">
          {jobData.description}
        </p>
      )}

      {/* Job details */}
      <div className="space-y-3 mb-4">
        {/* Budget and status */}
        <div className="flex items-center justify-between p-3 bg-lightgreen/20 rounded-lg">
          <div className="text-center">
            <div className="flex items-center gap-1 text-teal100">
              <DollarSign size={14} />
              <span className="text-xs font-medium">Ngân sách</span>
            </div>
            <p className="text-sm font-bold text-teal200">
              {jobData.budget
                ? `${formatCurrency(jobData.budget)} VNĐ`
                : "Thỏa thuận"}
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center gap-1 text-teal100">
              <Users size={14} />
              <span className="text-xs font-medium">Followers</span>
            </div>
            <p className="text-sm font-bold text-teal200">
              {jobData.follower
                ? `${formatCurrency(jobData.follower)}+`
                : "Không yêu cầu"}
            </p>
          </div>
        </div>

        {/* Field and timeline */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {jobData.fieldName && (
            <div className="bg-teal/10 text-teal200 px-2 py-1 rounded-lg text-center">
              <span className="font-medium">{jobData.fieldName}</span>
            </div>
          )}
          <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-center">
            <span className="font-medium">
              {getStatusLabel(jobData.status)}
            </span>
          </div>
        </div>

        {/* Timeline */}
        {(jobData.startTime || jobData.endTime) && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar size={12} />
            <span>
              {formatDate(jobData.startTime)} - {formatDate(jobData.endTime)}
            </span>
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
        <span>Xem chi tiết công ty</span>
        <ChevronRight size={16} />
      </motion.button>
    </motion.div>
  );
};

export default BusinessCard;
