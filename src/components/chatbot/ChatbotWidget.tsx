import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatbotContext } from "../../contexts/ChatbotContext";
import ChatboxUI from "./ChatboxUI";
import ChatbotToggleButton from "./ChatbotToggleButton";

// Animation variants
const chatbotVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: { duration: 0.3 },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const ChatbotWidget: React.FC = () => {
  const { shouldShowChatbot, shouldOpenChatbox, currentUserType } =
    useChatbotContext();

  // Widget state monitoring
  useEffect(() => {
    // Widget mounted - chatbot state updated
  }, [shouldShowChatbot, shouldOpenChatbox, currentUserType]);

  // Render decision
  const shouldRender = shouldShowChatbot && currentUserType;

  // Only show for KOC and Business users (admin can see for testing)
  if (!shouldRender) {
    return null;
  }

  return (
    <>
      {/* Main Chatbot Toggle Button */}
      <AnimatePresence>
        {!shouldOpenChatbox && (
          <motion.div
            key="chatbot-button"
            variants={chatbotVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover="hover"
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
            }}
          >
            <ChatbotToggleButton />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbox Overlay */}
      <AnimatePresence>
        {shouldOpenChatbox && (
          <motion.div
            key="chatbox-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
              padding: "16px",
            }}
          >
            <motion.div
              variants={chatbotVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: "100%",
                maxWidth: "800px",
                height: "90vh",
                maxHeight: "90vh",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <ChatboxUI />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
