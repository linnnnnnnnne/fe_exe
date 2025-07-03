import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChatbotContext } from "../../contexts/ChatbotContext";
import { MessageCircle, Target, TrendingUp, Sparkles, X } from "lucide-react";

const ChatbotToggleButton: React.FC = () => {
  const { currentUserType, shouldOpenChatbox, openChatbox, closeChatbox } =
    useChatbotContext();

  // Toggle button for chatbot

  // Config với theme teal
  const getUserTypeConfig = () => {
    if (currentUserType === "koc") {
      return {
        gradient: "from-teal to-teal100",
        icon: Target,
        label: "InfluenceHub AI",
        subtitle: "Tư vấn sự nghiệp KOC",
        bgColor: "#0D564F",
        shadowColor: "rgba(13, 86, 79, 0.4)",
      };
    } else if (currentUserType === "business") {
      return {
        gradient: "from-teal200 to-teal",
        icon: TrendingUp,
        label: "InfluenceHub AI",
        subtitle: "Tư vấn Marketing",
        bgColor: "#04675f",
        shadowColor: "rgba(4, 103, 95, 0.4)",
      };
    }
    // Default fallback
    return {
      gradient: "from-teal to-darkslategray-100",
      icon: MessageCircle,
      label: "InfluenceHub AI",
      subtitle: "Hỗ trợ thông minh",
      bgColor: "#0D564F",
      shadowColor: "rgba(13, 86, 79, 0.4)",
    };
  };

  const config = getUserTypeConfig();
  const IconComponent = config.icon;

  const handleToggle = () => {
    if (shouldOpenChatbox) {
      closeChatbox();
    } else {
      openChatbox();
    }
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999]"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
      }}
    >
      <AnimatePresence>
        {!shouldOpenChatbox ? (
          // Main Button
          <motion.div
            key="collapsed"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.6 }}
            className="relative"
          >
            {/* Ping Animation với theme teal */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-teal opacity-20"
            />

            {/* Main Button */}
            <motion.button
              onClick={handleToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-16 h-16 bg-gradient-to-br ${config.gradient} text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300`}
              style={{
                background: config.bgColor,
                boxShadow: `0 10px 30px ${config.shadowColor}`,
              }}
            >
              {/* InfluenceHub Avatar */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative z-10"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-md">
                  <img
                    src="/InfluenceHub.jpg"
                    alt="InfluenceHub AI"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextElementSibling?.classList.remove(
                        "hidden"
                      );
                    }}
                  />
                  <div className="hidden w-full h-full bg-white/20 flex items-center justify-center">
                    <IconComponent size={20} className="text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Sparkles */}
              <Sparkles
                size={12}
                className="absolute top-2 right-2 text-white/60"
              />
            </motion.button>

            {/* Simple Tooltip với theme teal */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-teal text-white px-3 py-2 rounded-lg shadow-xl pointer-events-none whitespace-nowrap text-sm font-montserrat">
              {config.label}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-0 h-0 border-l-4 border-l-teal border-t-2 border-t-transparent border-b-2 border-b-transparent" />
            </div>

            {/* Badge với theme teal */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal200 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold font-montserrat">
                AI
              </span>
            </div>
          </motion.div>
        ) : (
          // Close Button với theme teal
          <motion.div
            key="expanded"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <motion.button
              onClick={handleToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-teal hover:bg-teal200 text-white rounded-full shadow-2xl flex items-center justify-center"
              style={{
                boxShadow: `0 8px 25px ${config.shadowColor}`,
              }}
            >
              <X size={24} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatbotToggleButton;
