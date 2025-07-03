import React from "react";
import { motion } from "framer-motion";
import { Bot, User, Clock, CheckCircle } from "lucide-react";
import KOCCard from "./KOCCard";
import BusinessCard from "./BusinessCard";

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

interface MessageBubbleProps {
  message: AIMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Enhanced text formatting function
  const formatAIText = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (trimmedLine === "") {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      // Handle numbered lists (1., 2., etc.)
      if (/^\d+\.\s/.test(trimmedLine)) {
        const match = trimmedLine.match(/^(\d+)\.\s(.+)$/);
        if (match) {
          elements.push(
            <div
              key={index}
              className="flex items-start gap-3 mb-3 p-3 bg-lightgreen/20 rounded-lg border-l-4 border-teal100"
            >
              <div className="w-6 h-6 bg-teal100 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {match[1]}
              </div>
              <span className="text-sm leading-relaxed">{match[2]}</span>
            </div>
          );
        }
        return;
      }

      // Handle bullet points with enhanced styling
      if (
        trimmedLine.startsWith("•") ||
        trimmedLine.startsWith("-") ||
        trimmedLine.startsWith("*")
      ) {
        const content = trimmedLine.replace(/^[•\-\*]\s*/, "");
        elements.push(
          <div key={index} className="flex items-start gap-3 mb-2 ml-2">
            <div className="w-2 h-2 bg-teal100 rounded-full mt-2 flex-shrink-0" />
            <span className="text-sm leading-relaxed flex-1">{content}</span>
          </div>
        );
        return;
      }

      // Handle headings (lines starting with ##, ###, or emojis)
      if (
        trimmedLine.startsWith("##") ||
        /^[🎯🔍💡📊🚀💰⭐🌟✨💎🎪🎨🔥💯]+/.test(trimmedLine)
      ) {
        const content = trimmedLine.replace(/^#+\s*/, "");
        elements.push(
          <div key={index} className="mb-4 mt-6 first:mt-0">
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-teal/10 to-teal100/10 rounded-lg border border-teal/20">
              <div className="w-1 h-6 bg-teal100 rounded-full" />
              <h3 className="font-bold text-teal200 text-base">{content}</h3>
            </div>
          </div>
        );
        return;
      }

      // Handle bold text (**text**)
      if (trimmedLine.includes("**")) {
        const parts = trimmedLine.split("**");
        const formattedParts = parts.map((part, i) =>
          i % 2 === 1 ? (
            <strong
              key={i}
              className="font-semibold text-teal200 bg-lightgreen/30 px-1 rounded"
            >
              {part}
            </strong>
          ) : (
            <span key={i}>{part}</span>
          )
        );

        elements.push(
          <p key={index} className="mb-3 text-sm leading-relaxed">
            {formattedParts}
          </p>
        );
        return;
      }

      // Handle special sections (lines with colons like "Kết luận:")
      if (trimmedLine.includes(":") && trimmedLine.length < 50) {
        elements.push(
          <div key={index} className="mb-2 mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal/10 rounded-full border border-teal/20">
              <CheckCircle size={14} className="text-teal100" />
              <span className="font-semibold text-teal200 text-sm">
                {trimmedLine}
              </span>
            </div>
          </div>
        );
        return;
      }

      // Regular paragraphs
      elements.push(
        <p key={index} className="mb-3 text-sm leading-relaxed text-gray-700">
          {trimmedLine}
        </p>
      );
    });

    return elements;
  };

  // Animation variants for messages
  const messageVariants = {
    hidden: { opacity: 0, x: message.isUser ? 20 : -20, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  if (message.isUser) {
    // User message bubble
    return (
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className="flex items-end justify-end gap-3 mb-6"
      >
        <div className="max-w-[75%] lg:max-w-[60%]">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-r from-teal to-teal100 text-white p-4 rounded-2xl rounded-br-md shadow-lg"
          >
            <p className="text-sm leading-relaxed font-montserrat">
              {message.text}
            </p>
          </motion.div>

          <div className="flex items-center justify-end gap-1 mt-2 text-xs text-darkgray font-montserrat">
            <Clock size={10} />
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-9 h-9 bg-gradient-to-r from-teal to-teal100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
        >
          <User size={18} className="text-white" />
        </motion.div>
      </motion.div>
    );
  }

  // AI message bubble
  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3 mb-6"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-9 h-9 bg-gradient-to-br from-teal to-teal100 rounded-full flex items-center justify-center flex-shrink-0 shadow-md mt-1"
      >
        <Bot size={18} className="text-white" />
      </motion.div>

      <div className="max-w-[75%] lg:max-w-[80%] flex-1">
        <motion.div
          whileHover={{ scale: 1.005 }}
          className="bg-white border border-teal/10 p-5 rounded-2xl rounded-tl-md shadow-lg"
        >
          {/* Enhanced AI response formatting */}
          <div className="text-teal font-montserrat">
            {formatAIText(message.text)}
          </div>
        </motion.div>

        {/* Render KOC Card if AI suggested a KOL/KOC */}
        {message.suggestedMatch && message.suggestedMatch.type === "koc" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mt-4"
          >
            <KOCCard
              kocId={message.suggestedMatch.id}
              kocName={message.suggestedMatch.name}
              matchScore={message.suggestedMatch.matchScore}
            />
          </motion.div>
        )}

        {/* Render Business Card if AI suggested a Job/Business */}
        {message.suggestedMatch &&
          message.suggestedMatch.type === "business" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-4"
            >
              <BusinessCard
                jobId={message.suggestedMatch.id}
                jobTitle={message.suggestedMatch.name}
                matchScore={message.suggestedMatch.matchScore}
              />
            </motion.div>
          )}

        <div className="flex items-center gap-1 mt-2 text-xs text-darkgray font-montserrat">
          <Clock size={10} />
          <span>{formatTime(message.timestamp)}</span>
          {message.suggestedMatch && (
            <>
              <span className="mx-1">•</span>
              <div className="flex items-center gap-1">
                <CheckCircle size={10} className="text-teal100" />
                <span className="text-teal100 font-medium">Có gợi ý</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
