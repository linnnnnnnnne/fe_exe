import { useState, useCallback, useRef, useEffect } from "react";
import { useChatbotContext } from "../contexts/ChatbotContext";

interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestedMatch?: {
    id: string;
    name: string;
    type: "koc" | "business";
    matchScore: number;
    reasons: string[];
  };
}

interface InfluencerData {
  influId: string;
  userId: string;
  name: string;
  gender: number;
  nickName: string;
  dateOfBirth: string;
  phoneNumber: string;
  area: string;
  follower: number;
  bio: string;
  cccd: string;
  linkImage: string;
  portfolio_link: string;
  fieldNames?: string[]; // Will be fetched separately
}

interface BusinessData {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  businessLicense: string;
  logo: string;
  fieldName?: string; // Will be fetched separately
}

interface JobData {
  id: string;
  title: string;
  location: string;
  budget: number;
  fieldName: string;
  require: string;
  follower: number;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<AIMessage[]>(() => {
    try {
      const stored = localStorage.getItem("ai_chat_messages");
      if (stored) {
        const parsed: AIMessage[] = JSON.parse(stored);
        return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch (parseError: unknown) {
      console.warn("Failed to parse stored chat messages", parseError);
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUserType } = useChatbotContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
    } catch {
      /* ignore quota errors */
    }
  }, [messages]);

  // Scroll to bottom when new message added
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Create prompts based on user type and context
  const createKOCPrompt = useCallback(
    (
      influencersData: InfluencerData[],
      jobsData: JobData[],
      userMessage: string
    ) => {
      return `Bạn là AI Assistant chuyên nghiệp dành cho KOL/KOC trên nền tảng kết nối influencer marketing.

🎯 NHIỆM VỤ CỦA BẠN:
- Tư vấn sự nghiệp và phát triển thương hiệu cá nhân cho KOL/KOC
- Gợi ý công việc phù hợp từ database có sẵn
- Đưa ra lời khuyên để tăng cơ hội được tuyển chọn
- Hướng dẫn về xu hướng content và marketing

👤 ĐỐI TƯỢNG: KOL/KOC (Key Opinion Leader/Consumer)

💼 DANH SÁCH CÔNG VIỆC CÓ SẴN:
${JSON.stringify(jobsData.slice(0, 8), null, 2)}

🔍 KHI NÀO GỢI Ý CÔNG VIỆC:
-LUÔN gợi ý công việc khi user hỏi về:
+CHỈ gợi ý công việc NẾU user RÕ RÀNG yêu cầu tìm kiếm công việc phù hợp hoặc hỏi về:
- "tìm việc", "công việc phù hợp", "job matching", "việc làm"
- "mức lương", "thu nhập", "ngân sách", "income"
- "lĩnh vực chuyên môn", "kinh nghiệm", "expertise"
- "follower", "audience", "độ tuổi", "target"
- "cơ hội", "opportunity", "career"
- "dự án", "project", "campaign"
- "hợp tác", "collaboration", "partnership"

📊 TIÊU CHÍ MATCHING CHI TIẾT:
1. Follower requirement: Job follower ≤ KOC followers
2. Lĩnh vực phù hợp: Job fieldName match với KOC expertise  
3. Ngân sách hợp lý: Job budget phù hợp với level KOC
4. Khu vực địa lý: Job location gần KOC area
5. Thời gian phù hợp: Job timeline reasonable
6. Status: Chỉ gợi ý job có status = 0 (Available)

💰 CÔNG THỨC MATCH SCORE:
- Perfect match (tất cả tiêu chí): 85-95%
- Good match (4/6 tiêu chí): 70-84%
- Fair match (3/6 tiêu chí): 55-69%
- Poor match (≤2/6 tiêu chí): 40-54%

🎯 ĐẶC BIỆT: Ưu tiên gợi ý job có:
- Budget cao nhất trong khả năng của KOC
- FieldName match với KOC expertise
- Follower requirement phù hợp
- Status = 0 (đang tuyển)

🚨 QUY TẮC OUTPUT QUAN TRỌNG:
Chỉ khi bạn quyết định GỢI Ý một công việc thì mới thêm block sau vào cuối phản hồi, nếu không thì kết thúc bình thường mà KHÔNG có block này:

JOB_ID: [id từ data]
JOB_TITLE: [title từ data]
MATCH_SCORE: [số từ 40-95]

VÍ DỤ:
JOB_ID: job_123456
JOB_TITLE: Content Creator cho thương hiệu thời trang
MATCH_SCORE: 87

💬 Câu hỏi từ KOL/KOC: "${userMessage}"

Hãy phân tích profile KOC và GỢI Ý MỘT CÔNG VIỆC CỤ THỂ từ danh sách trên với lý do chi tiết.`;
    },
    []
  );

  const createBusinessPrompt = useCallback(
    (
      influencersData: InfluencerData[],
      businessData: BusinessData[],
      userMessage: string
    ) => {
      return `Bạn là AI Marketing Consultant chuyên nghiệp cho doanh nghiệp tìm kiếm KOL/KOC.

🏢 NHIỆM VỤ CỦA BẠN:
- Tư vấn chiến lược influencer marketing
- Gợi ý KOL/KOC phù hợp từ database có sẵn
- Dự đoán ROI và hiệu quả campaign
- Tối ưu hóa ngân sách marketing

🎯 ĐỐI TƯỢNG: Doanh nghiệp/Brand Manager

👥 DANH SÁCH KOL/KOC CÓ SẴN:
${JSON.stringify(influencersData.slice(0, 8), null, 2)}

🔍 KHI NÀO GỢI Ý KOL/KOC:
-LUÔN gợi ý KOL/KOC khi user hỏi về:
+CHỈ gợi ý KOL/KOC NẾU doanh nghiệp RÕ RÀNG yêu cầu tìm kiếm KOL/KOC phù hợp hoặc hỏi về:
- "tìm KOL", "tìm influencer", "gợi ý KOC", "recommend KOL"
- "target audience", "nhóm khách hàng mục tiêu"
- "ngân sách campaign", "chi phí marketing"
- "engagement rate", "hiệu quả quảng cáo"
- "lĩnh vực", "chuyên môn", "niche market"
- "khu vực", "địa điểm", "location"
- "followers", "người theo dõi"
- "phù hợp với thương hiệu", "matching brand"

📈 TIÊU CHÍ ĐÁNH GIÁ KOL/KOC:
1. Số lượng follower phù hợp với ngân sách
2. Lĩnh vực chuyên môn match với sản phẩm/dịch vụ
3. Khu vực địa lý phù hợp với thị trường
4. Tỷ lệ engagement rate ước tính
5. Độ tin cậy và chất lượng content
6. Cost per engagement hợp lý

💰 CÔNG THỨC ĐÁNH GIÁ:
- Micro KOC (1K-10K followers): Match Score 70-85%
- Mid-tier KOC (10K-100K followers): Match Score 60-80% 
- Macro KOL (100K+ followers): Match Score 50-75%

🎯 ĐẶC BIỆT: Hãy ưu tiên gợi ý KOL/KOC có:
- Lĩnh vực fieldNames phù hợp với yêu cầu
- Follower count phù hợp với ngân sách dự kiến
- Khu vực area phù hợp với target market

🚨 QUY TẮC OUTPUT QUAN TRỌNG:
Chỉ khi bạn quyết định GỢI Ý một KOL/KOC thì mới thêm block sau vào cuối phản hồi, nếu không thì kết thúc bình thường mà KHÔNG có block này:

KOC_ID: [userId từ data]
KOC_NAME: [name từ data]  
MATCH_SCORE: [số từ 50-95]
ROI_PREDICTION: [%]

VÍ DỤ:
KOC_ID: user_123456
KOC_NAME: Nguyễn Văn A
MATCH_SCORE: 87
ROI_PREDICTION: 250%

💬 Yêu cầu từ doanh nghiệp: "${userMessage}"

Hãy phân tích yêu cầu và GỢI Ý MỘT KOL/KOC CỤ THỂ từ danh sách trên với lý do chi tiết.`;
    },
    []
  );

  // Process AI response để extract suggestions
  const processAIResponse = useCallback(
    (responseText: string, userType: "koc" | "business") => {
      const cleanedText = responseText
        .replace(/JOB_ID:.*?\n/gi, "")
        .replace(/JOB_TITLE:.*?\n/gi, "")
        .replace(/KOC_ID:.*?\n/gi, "")
        .replace(/KOC_NAME:.*?\n/gi, "")
        .replace(/MATCH_SCORE:.*?\n/gi, "")
        .replace(/ROI_PREDICTION:.*?\n/gi, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .trim();

      let suggestedMatch = null;

      if (userType === "koc") {
        const jobIdMatch = responseText.match(/JOB_ID:\s*([^\n]+)/i);
        const jobTitleMatch = responseText.match(/JOB_TITLE:\s*([^\n]+)/i);
        const matchScoreMatch = responseText.match(/MATCH_SCORE:\s*(\d+)/i);

        if (jobIdMatch && jobTitleMatch) {
          // Clean job ID by removing any extra text after the actual ID
          const cleanJobId = jobIdMatch[1]
            .trim()
            .replace(/[^a-zA-Z0-9-].*$/, "");
          const cleanJobTitle = jobTitleMatch[1].trim().replace(/[)].*$/, "");

          suggestedMatch = {
            id: cleanJobId,
            name: cleanJobTitle,
            type: "business" as const,
            matchScore: matchScoreMatch ? parseInt(matchScoreMatch[1]) : 0,
            reasons: [
              "Phù hợp với chuyên môn",
              "Ngân sách hợp lý",
              "Yêu cầu phù hợp",
            ],
          };
        }
      } else if (userType === "business") {
        const kocIdMatch = responseText.match(/KOC_ID:\s*([^\n]+)/i);
        const kocNameMatch = responseText.match(/KOC_NAME:\s*([^\n]+)/i);
        const matchScoreMatch = responseText.match(/MATCH_SCORE:\s*(\d+)/i);

        if (kocIdMatch && kocNameMatch) {
          // Clean KOC ID by removing any extra text after the actual ID
          const cleanKocId = kocIdMatch[1]
            .trim()
            .replace(/[^a-zA-Z0-9-].*$/, "");
          const cleanKocName = kocNameMatch[1].trim().replace(/[)].*$/, "");

          suggestedMatch = {
            id: cleanKocId,
            name: cleanKocName,
            type: "koc" as const,
            matchScore: matchScoreMatch ? parseInt(matchScoreMatch[1]) : 0,
            reasons: [
              "Audience phù hợp",
              "Engagement rate cao",
              "Kinh nghiệm tốt",
            ],
          };
        }
      }

      return { cleanedText, suggestedMatch };
    },
    []
  );

  // Fetch data for AI analysis
  const fetchDataForAI = useCallback(async () => {
    try {
      const apiBaseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api";

      const [influencersRes, jobsRes, businessRes] = await Promise.all([
        fetch(`${apiBaseUrl}/influ/all`),
        fetch(`${apiBaseUrl}/jobs/get-all`),
        fetch(`${apiBaseUrl}/business/all`),
      ]);

      const influencersData = await influencersRes.json();
      const jobsData = await jobsRes.json();
      const businessData = await businessRes.json();

      // Process influencers data - add field information
      const processedInfluencers = Array.isArray(influencersData.data)
        ? await Promise.all(
            influencersData.data
              .slice(0, 10)
              .map(async (influ: InfluencerData) => {
                let fieldNames: string[] = [];
                try {
                  const fieldRes = await fetch(
                    `${apiBaseUrl}/field/get-all-field-of-influ/${influ.influId}`
                  );
                  const fieldJson = await fieldRes.json();
                  if (fieldJson.isSuccess && Array.isArray(fieldJson.data)) {
                    fieldNames = fieldJson.data
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      .filter((f: any) => f.name && f.name.trim() !== "")
                      .map((f: any) => f.name.trim());
                  }
                } catch (error) {
                  console.error(
                    `Error fetching fields for influencer ${influ.influId}:`,
                    error
                  );
                }

                return { ...influ, fieldNames };
              })
          )
        : [];

      return {
        influencers: processedInfluencers,
        jobs: Array.isArray(jobsData.data) ? jobsData.data.slice(0, 10) : [],
        businesses: Array.isArray(businessData.data)
          ? businessData.data.slice(0, 10)
          : [],
      };
    } catch (error) {
      console.error("Error fetching data for AI:", error);
      return { influencers: [], jobs: [], businesses: [] };
    }
  }, []);

  // Fetch current logged-in user's profile for personalization
  const fetchCurrentUserProfile = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      const role =
        localStorage.getItem("role") || localStorage.getItem("userRole");
      const token = localStorage.getItem("accessToken");
      const apiBase =
        "https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api";
      if (!userId || !role) return null;

      if (role === "Business" || role === "business") {
        const res = await fetch(
          `${apiBase}/business/get-business-by-user-id/${userId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const json = await res.json();
        if (json.isSuccess) return { type: "business", data: json.data };
      } else if (role === "Freelancer" || role === "influencer") {
        const res = await fetch(
          `${apiBase}/influ/get-influ-by-userId/${userId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        const json = await res.json();
        if (json.isSuccess) return { type: "koc", data: json.data };
      }
    } catch (err) {
      console.warn("Could not fetch current user profile", err);
    }
    return null;
  }, []);

  // Helper to check if the user message explicitly requests a match suggestion
  const isMatchRequest = (
    userType: "koc" | "business",
    msg: string
  ): boolean => {
    const text = msg.toLowerCase();
    if (userType === "koc") {
      return /\b(tìm|job|việc|công việc|apply|ứng tuyển|match)\b/.test(text);
    }
    // business
    return /\b(kol|koc|influencer|tìm|gợi ý|phù hợp|recommend|influ)\b/.test(
      text
    );
  };

  // Main function to send message to AI
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || !currentUserType) return;

      setIsLoading(true);
      setError(null);

      // Add user message
      const userMsgId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          text: userMessage,
          isUser: true,
          timestamp: new Date(),
        },
      ]);

      try {
        // Fetch data for AI analysis
        const { influencers, jobs, businesses } = await fetchDataForAI();
        const currentProfile = await fetchCurrentUserProfile();

        // Create appropriate prompt based on user type
        let prompt = "";
        if (currentUserType === "koc") {
          prompt = createKOCPrompt(influencers, jobs, userMessage);
        } else if (currentUserType === "business") {
          prompt = createBusinessPrompt(influencers, businesses, userMessage);
        }

        // Call AI via proxy server
        const aiProxyUrl =
          import.meta.env.VITE_AI_PROXY_URL ||
          "http://localhost:3001/api/ai-proxy";

        // Get AI configuration from environment
        const response = await fetch(aiProxyUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: parseFloat(
                import.meta.env.VITE_AI_TEMPERATURE || "0.7"
              ),
              maxOutputTokens: parseInt(
                import.meta.env.VITE_AI_MAX_TOKENS || "1000"
              ),
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message || `HTTP ${response.status}`
          );
        }

        const data = await response.json();
        const aiResponseText =
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Xin lỗi, tôi không thể trả lời lúc này.";

        // Process response and extract suggestions
        let cleanedText = aiResponseText;
        let suggestedMatch = null;

        if (currentUserType === "koc" || currentUserType === "business") {
          const result = processAIResponse(aiResponseText, currentUserType);
          cleanedText = result.cleanedText;
          suggestedMatch = result.suggestedMatch;

          // Filter suggestedMatch if the user didn't explicitly request matching
          if (!isMatchRequest(currentUserType, userMessage)) {
            suggestedMatch = null;
          }
        }

        // Add AI response
        const aiMsgId = (Date.now() + 1).toString();
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            text: cleanedText as string,
            isUser: false,
            timestamp: new Date(),
            suggestedMatch: suggestedMatch || undefined,
          },
        ]);

        setTimeout(scrollToBottom, 100);
      } catch (err: unknown) {
        console.error("AI Chat Error:", err);

        let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
        if (
          (err instanceof Error && err.message.includes("network")) ||
          err instanceof TypeError
        ) {
          errorMessage = "Lỗi kết nối. Vui lòng kiểm tra internet.";
        } else if (err instanceof Error && err.message.includes("401")) {
          errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
        }

        setError(errorMessage);

        // Add error message
        const errorMsgId = (Date.now() + 1).toString();
        setMessages((prev) => [
          ...prev,
          {
            id: errorMsgId,
            text: errorMessage,
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentUserType,
      createKOCPrompt,
      createBusinessPrompt,
      processAIResponse,
      fetchDataForAI,
      scrollToBottom,
    ]
  );

  // Clear conversation
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem("ai_chat_messages");
    } catch {
      /* ignore remove errors */
    }
  }, []);

  // Initialize with welcome message
  const initializeChat = useCallback(() => {
    if (messages.length === 0 && currentUserType) {
      const welcomeText =
        currentUserType === "koc"
          ? "👋 Chào bạn! Tôi là AI Assistant, sẵn sàng giúp bạn tìm kiếm công việc phù hợp và phát triển sự nghiệp KOL/KOC. Hãy cho tôi biết bạn đang tìm kiếm gì?"
          : "👋 Chào bạn! Tôi là AI Assistant, chuyên tư vấn influencer marketing. Tôi sẽ giúp bạn tìm kiếm KOL/KOC phù hợp và tối ưu hóa chiến lược marketing. Bạn cần hỗ trợ gì?";

      setMessages([
        {
          id: "welcome",
          text: welcomeText,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length, currentUserType]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    initializeChat,
    messagesEndRef,
  };
};
