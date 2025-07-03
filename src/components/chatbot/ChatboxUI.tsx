import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbotContext } from "../../contexts/ChatbotContext";
import { useAIChat } from "../../hooks/useAIChat";
import MessageBubble from "./MessageBubble";

import ChatInput from "./ChatInput";
import {
  X,
  Bot,
  Sparkles,
  Trash2,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

const ChatboxUI: React.FC = () => {
  const { closeChatbox, currentUserType } = useChatbotContext();
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    initializeChat,
    messagesEndRef,
  } = useAIChat();

  const [inputMessage, setInputMessage] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Initialize chat when component mounts
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Handle message send với cải thiện
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim();
    setInputMessage("");

    try {
      await sendMessage(messageText);
    } catch (error) {
      console.error("Error sending message:", error);
      // Restore input if failed
      setInputMessage(messageText);
    }
  };

  // Quick suggestions based on user type với theme teal
  const getQuickSuggestions = () => {
    if (currentUserType === "koc") {
      return [
        { text: "Tìm việc phù hợp với tôi", icon: "🎯", category: "job" },
        { text: "Việc có mức lương cao", icon: "💰", category: "salary" },
        { text: "Cách tăng follower", icon: "📈", category: "growth" },
        { text: "Tips cải thiện profile", icon: "✨", category: "profile" },
      ];
    } else if (currentUserType === "business") {
      return [
        { text: "Tìm KOL/KOC phù hợp", icon: "🔍", category: "search" },
        { text: "Phân tích ROI campaign", icon: "📊", category: "analytics" },
        { text: "Chiến lược marketing", icon: "💡", category: "strategy" },
        { text: "Tối ưu ngân sách", icon: "💰", category: "budget" },
      ];
    }
    return [];
  };

  // Header colors với theme teal của hệ thống
  const getHeaderStyle = () => {
    if (currentUserType === "koc") {
      return {
        background: "linear-gradient(135deg, #0D564F 0%, #257f6d 100%)",
        boxShadow: "0 8px 32px rgba(13, 86, 79, 0.3)",
      };
    } else if (currentUserType === "business") {
      return {
        background: "linear-gradient(135deg, #04675f 0%, #0D564F 100%)",
        boxShadow: "0 8px 32px rgba(4, 103, 95, 0.3)",
      };
    }
    return {
      background: "linear-gradient(135deg, #0D564F 0%, #145959 100%)",
      boxShadow: "0 8px 32px rgba(13, 86, 79, 0.3)",
    };
  };

  const getHeaderInfo = () => {
    if (currentUserType === "koc") {
      return {
        title: "AI Career Assistant",
        subtitle: "Phát triển sự nghiệp KOL/KOC",
        icon: Target,
      };
    } else if (currentUserType === "business") {
      return {
        title: "AI Marketing Consultant",
        subtitle: "Tối ưu chiến lược Influencer",
        icon: TrendingUp,
      };
    }
    return {
      title: "AI Assistant",
      subtitle: "Hỗ trợ thông minh",
      icon: Bot,
    };
  };

  const headerInfo = getHeaderInfo();
  const HeaderIcon = headerInfo.icon;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-azure to-lightgreen shadow-2xl rounded-xl overflow-hidden border border-teal/10">
      {/* Header với theme teal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={getHeaderStyle()}
        className="px-6 py-4 text-white relative overflow-hidden flex-shrink-0"
      >
        {/* Background pattern với màu teal */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-4 w-20 h-20 rounded-full border border-lightgreen/30"></div>
          <div className="absolute bottom-2 right-4 w-16 h-16 rounded-full border border-lightgreen/30"></div>
          <div className="absolute top-1/2 right-1/3 w-8 h-8 rounded-full bg-lightgreen/20"></div>
        </div>

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-12 h-12 bg-lightgreen/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-lightgreen/30"
            >
              <HeaderIcon size={24} className="text-azure" />
            </motion.div>

            <div>
              <h3 className="font-bold text-xl font-montserrat text-white">
                {headerInfo.title}
              </h3>
              <div className="flex items-center gap-2 text-lightgreen text-sm mt-1">
                <Sparkles size={14} />
                <span className="font-montserrat">{headerInfo.subtitle}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Clear messages button với cải thiện */}
            {messages.length > 1 && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowConfirmClear(true)}
                className="w-10 h-10 bg-lightgreen/20 hover:bg-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 border border-lightgreen/20 hover:border-red-500/30"
                title="Xóa cuộc trò chuyện"
              >
                <Trash2
                  size={18}
                  className="text-azure hover:text-red-300 transition-colors"
                />
              </motion.button>
            )}

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeChatbox}
              className="w-10 h-10 bg-lightgreen/20 hover:bg-red-500/80 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 border border-lightgreen/20"
            >
              <X size={18} className="text-azure" />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Messages Area với cải thiện */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-azure/80 to-lightgreen/30 scrollbar-hide">
          {/* Welcome message và Quick suggestions */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="space-y-6"
            >
              {/* Welcome text */}
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal to-teal100 text-white px-4 py-2 rounded-full text-sm font-medium font-montserrat shadow-lg mb-4"
                >
                  <Zap size={16} />
                  <span>Thử hỏi tôi về</span>
                </motion.div>
              </div>

              {/* Suggestions grid với spacing tốt hơn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {getQuickSuggestions().map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 8px 25px rgba(13, 86, 79, 0.15)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setInputMessage(suggestion.text);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="p-4 bg-white hover:bg-lightgreen/20 border border-teal/10 hover:border-teal/30 rounded-xl transition-all duration-300 text-left group shadow-sm min-h-[80px] flex items-center"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-2xl flex-shrink-0">
                        {suggestion.icon}
                      </span>
                      <span className="text-sm font-medium text-teal group-hover:text-teal200 font-montserrat transition-colors leading-relaxed">
                        {suggestion.text}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Helpful tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <p className="text-sm text-teal/70 font-montserrat">
                  💡 Bạn có thể nhập câu hỏi tùy ý vào khung chat bên dưới
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Chat Messages */}
          <AnimatePresence>
            {messages.slice(1).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <MessageBubble message={message} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-start gap-3 mb-4"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-teal to-teal100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot size={18} className="text-white" />
              </div>
              <div className="flex items-center gap-3 bg-white rounded-2xl rounded-tl-md p-4 shadow-lg border border-teal/10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-teal border-t-transparent rounded-full"
                />
                <span className="text-teal font-medium font-montserrat text-sm">
                  AI đang suy nghĩ...
                </span>
              </div>
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <div>
                  <p className="font-medium font-montserrat">Có lỗi xảy ra</p>
                  <p className="text-sm font-montserrat mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area cố định ở bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-t border-teal/10 bg-white/90 backdrop-blur-sm p-4 flex-shrink-0"
      >
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder={
            currentUserType === "koc"
              ? "Hỏi về cơ hội việc làm, phát triển sự nghiệp..."
              : currentUserType === "business"
              ? "Hỏi về chiến lược marketing, tìm KOL/KOC..."
              : "Nhập câu hỏi của bạn..."
          }
        />
      </motion.div>

      {/* Custom confirm clear overlay */}
      {showConfirmClear && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-2xl border border-teal/20"
          >
            <h3 className="text-lg font-semibold text-teal font-montserrat mb-3 text-center">
              Xóa toàn bộ cuộc trò chuyện?
            </h3>
            <p className="text-sm text-darkgray font-montserrat mb-6 text-center">
              Hành động này sẽ không thể hoàn tác.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  clearMessages();
                  setShowConfirmClear(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-teal to-teal100 text-white rounded-lg font-montserrat shadow hover:opacity-90 transition"
              >
                Xóa
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-4 py-2 bg-lightgreen/30 text-teal rounded-lg font-montserrat shadow hover:bg-lightgreen/50 transition"
              >
                Hủy
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatboxUI;
