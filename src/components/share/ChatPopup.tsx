import { useRef, useState, useEffect } from "react";
import { X, Send } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  avatar?: string;
}

interface ChatPopupProps {
  conversationId: string;
  conversationName: string;
  avatar: string;
  messages: Message[];
  onClose: () => void;
}

export default function ChatPopup({
  conversationId,
  conversationName,
  avatar,
  messages: initialMessages,
  onClose,
}: ChatPopupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  useEffect(() => {
    let isMounted = true;

    const loop = async () => {
      while (isMounted) {
        try {
          const res = await fetch(
            `https://localhost:7035/api/message/conversation_messages?conversationId=${conversationId}&pageNumber=1&pageSize=50`
          );
          if (!res.ok) return;

          const data = await res.json();
          const rawMessages = data?.data?.items || [];

          const updatedMessages: Message[] = rawMessages.map((msg: any) => ({
            id: msg.messageID,
            sender:
              msg.senderID === localStorage.getItem("userId") ? "me" : "other",
            content: msg.content,
            time: msg.sentAt,
          }));

          // Nếu khác với hiện tại thì cập nhật
          setMessages((prev) => {
            const prevIds = prev.map((m) => m.id).join(",");
            const newIds = updatedMessages.map((m) => m.id).join(",");
            return prevIds !== newIds ? updatedMessages : prev;
          });
        } catch (err) {
          console.error("Lỗi auto cập nhật tin nhắn:", err);
        }

        await new Promise((res) => setTimeout(res, 1000)); // mỗi 1 giây
      }
    };

    loop();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  // Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const content = inputRef.current?.value.trim();
    const senderId = localStorage.getItem("userId");
    if (!content || !senderId) return;

    try {
      const res = await fetch(
        `https://localhost:7035/api/message/send?senderId=${senderId}&conversationId=${conversationId}&content=${encodeURIComponent(
          content
        )}`,
        { method: "POST" }
      );

      if (!res.ok) {
        alert("Gửi tin nhắn thất bại.");
        return;
      }

      const newMessage: Message = {
        id: `${Date.now()}`,
        sender: "me",
        content,
        time: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);
      inputRef.current!.value = "";
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
    }
  };

  return (
    <div className="fixed bottom-5 right-8 w-96 h-[420px] flex flex-col bg-white shadow-[0_8px_24px_rgba(0,0,0,0.20)] rounded-xl z-50 font-montserrat">
      {/* Header */}
      <div className="p-4 pb-0 text-lg font-semibold text-gray-800 border-b bg-white rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={avatar} className="w-8 h-8 rounded-full object-cover" />
          <span>{conversationName}</span>
        </div>
        <X className="cursor-pointer" onClick={onClose} />
      </div>

      {/* Chat content */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2"
      >
        {messages
          .sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          )
          .map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 max-w-[85%] ${
                msg.sender === "me" ? "ml-auto justify-end" : "justify-start"
              }`}
            >
              {msg.sender !== "me" && (
                <img
                  src={msg.avatar || avatar || "https://via.placeholder.com/32"}
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
              <div
                className={`text-sm px-3 py-2 rounded-md ${
                  msg.sender === "me" ? "bg-blue-100" : "bg-lightgray"
                }`}
              >
                <div className="text-black">{msg.content}</div>
                <div className="text-xs text-gray-500 text-right">
                  {new Date(msg.time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 border rounded-full py-2 px-4 text-sm shadow-sm outline-none"
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="text-blue-600 hover:text-blue-800 p-2 rounded-full flex items-center justify-center"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
