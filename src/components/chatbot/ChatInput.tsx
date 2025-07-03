import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Nhập tin nhắn...",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // Max 120px
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSend();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 1000) {
      // Limit to 1000 characters
      onChange(newValue);
    }
  };

  const inputVariants = {
    focus: {
      scale: 1.01,
      boxShadow: "0 0 0 3px rgba(13, 86, 79, 0.1)",
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      boxShadow: "0 0 0 0px rgba(13, 86, 79, 0)",
      transition: { duration: 0.2 },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { scale: 1, opacity: 0.5 },
  };

  const isReadyToSend = !disabled && value.trim().length > 0;

  return (
    <div className="relative">
      <motion.div
        variants={inputVariants}
        whileFocus="focus"
        className="relative flex items-end gap-3 p-3 bg-white border-2 border-teal/20 rounded-2xl focus-within:border-teal/50 transition-all shadow-sm"
      >
        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full bg-transparent border-none outline-none resize-none text-sm text-teal placeholder-teal/50 max-h-[120px] overflow-y-auto font-montserrat scrollbar-hide"
            style={{
              minHeight: "24px",
              lineHeight: "1.5",
            }}
          />

          {/* Character counter */}
          <AnimatePresence>
            {value.length > 800 && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className={`absolute -bottom-6 right-0 text-xs font-montserrat ${
                  value.length >= 1000 ? "text-red-500" : "text-teal/60"
                }`}
              >
                {value.length}/1000
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Send button */}
        <motion.button
          variants={buttonVariants}
          animate={isReadyToSend ? "idle" : "disabled"}
          whileHover={isReadyToSend ? "hover" : "disabled"}
          whileTap={isReadyToSend ? "tap" : "disabled"}
          onClick={onSend}
          disabled={!isReadyToSend}
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isReadyToSend
              ? "bg-gradient-to-r from-teal to-teal100 hover:from-teal100 hover:to-teal200 cursor-pointer shadow-md"
              : "bg-lightgreen/30 cursor-not-allowed"
          }`}
          title={
            disabled
              ? "Đang xử lý..."
              : value.trim()
              ? "Gửi tin nhắn (Enter)"
              : "Nhập tin nhắn để gửi"
          }
        >
          {disabled ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-teal border-t-transparent rounded-full"
            />
          ) : (
            <motion.div
              animate={isReadyToSend ? { scale: [1, 1.1, 1] } : {}}
              transition={{
                duration: 0.3,
                repeat: isReadyToSend ? Infinity : 0,
                repeatDelay: 2,
              }}
            >
              <Send
                size={18}
                className={`${
                  isReadyToSend ? "text-white" : "text-teal/40"
                } transition-colors`}
              />
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Quick suggestions removed as per user request */}

      {/* Typing indicator */}
      <AnimatePresence>
        {disabled && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-teal/60 font-montserrat"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 bg-teal100 rounded-full"
            />
            <span>AI đang trả lời...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatInput;
