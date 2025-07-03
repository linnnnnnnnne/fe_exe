import React, { createContext, useContext, useState, useEffect } from "react";

interface ChatbotContextType {
  shouldShowChatbot: boolean;
  userPrefersChatbot: boolean;
  shouldOpenChatbox: boolean;
  currentUserType: "koc" | "business" | "admin" | null;
  toggleChatbotVisibility: () => void;
  openChatbox: () => void;
  closeChatbox: () => void;
  setUserType: (type: "koc" | "business" | "admin" | null) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Mặc định chatbot luôn hiển thị
  const [userPrefersChatbot, setUserPrefersChatbot] = useState(true);
  const [shouldOpenChatbox, setShouldOpenChatbox] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<
    "koc" | "business" | "admin" | null
  >(null);

  // Auto-detect user type
  useEffect(() => {
    const detectUserType = () => {
      // Kiểm tra localStorage
      const userRole = localStorage.getItem("userRole");
      const role = localStorage.getItem("role");

      // Kiểm tra URL path
      const currentPath = window.location.pathname;

      let detectedType: "koc" | "business" | "admin" | null = null;

      // Priority 1: localStorage userRole
      if (userRole === "influencer" || userRole === "Freelancer") {
        detectedType = "koc";
      } else if (userRole === "business" || userRole === "Business") {
        detectedType = "business";
      } else if (userRole === "admin") {
        detectedType = "admin";
      }

      // Priority 2: localStorage role
      if (!detectedType && role) {
        if (role === "influencer" || role === "Freelancer") {
          detectedType = "koc";
        } else if (role === "business" || role === "Business") {
          detectedType = "business";
        } else if (role === "admin") {
          detectedType = "admin";
        }
      }

      // Priority 3: URL path
      if (!detectedType) {
        if (
          currentPath.includes("/koc") ||
          currentPath.includes("/influencer") ||
          currentPath.includes("/profile/koc")
        ) {
          detectedType = "koc";
        } else if (
          currentPath.includes("/business") ||
          currentPath.includes("/bs") ||
          currentPath.includes("/profile/bs")
        ) {
          detectedType = "business";
        } else if (currentPath.includes("/admin")) {
          detectedType = "admin";
        }
      }

      // If no type detected leave null (chatbot hidden)
      setCurrentUserType(detectedType);
    };

    detectUserType();

    // Re-detect on path change
    const handlePathChange = () => {
      setTimeout(detectUserType, 100);
    };

    window.addEventListener("popstate", handlePathChange);

    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  const toggleChatbotVisibility = () => {
    setUserPrefersChatbot((prev) => {
      const newValue = !prev;
      localStorage.setItem("chatbot-visible", String(newValue));
      return newValue;
    });
  };

  const setUserType = (type: "koc" | "business" | "admin" | null) => {
    setCurrentUserType(type);
  };

  return (
    <ChatbotContext.Provider
      value={{
        shouldShowChatbot:
          userPrefersChatbot &&
          (currentUserType === "koc" || currentUserType === "business"),
        userPrefersChatbot,
        shouldOpenChatbox,
        currentUserType,
        toggleChatbotVisibility,
        openChatbox: () => setShouldOpenChatbox(true),
        closeChatbox: () => setShouldOpenChatbox(false),
        setUserType,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context)
    throw new Error("useChatbotContext must be used within ChatbotProvider");
  return context;
};
