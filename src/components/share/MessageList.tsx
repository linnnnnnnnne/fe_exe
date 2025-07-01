import { useState, useRef, useEffect } from "react";
import { MessageCircleMore, Plus } from "lucide-react";
import ChatPopup from "./ChatPopup";
import NewMessage from "./NewMessage";

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
}

export default function MessageList() {
  const [open, setOpen] = useState(false);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentOpenedId, setCurrentOpenedId] = useState<string | null>(null);

  const fetchConversations = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const [resBusiness, resInflu] = await Promise.all([
        fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/business/all"),
        fetch("https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/influ/all"),
      ]);
      const businessData = await resBusiness.json();
      const influData = await resInflu.json();

      const allUsers = [
        ...(businessData?.data || []).map((u: any) => ({
          userId: u.userId,
          name: u.name,
          avatar: u.logo,
        })),
        ...(influData?.data || []).map((u: any) => ({
          userId: u.userId,
          name: u.name,
          avatar: u.linkImage,
        })),
      ];

      const currentUser = allUsers.find((u) => u.userId === userId);
      const currentName = currentUser?.name;

      const res = await fetch(
        `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/conversation/user_conversations?userId=${userId}`
      );
      if (!res.ok) {
        console.error("Lỗi gọi API user_conversations:", res.status);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data?.data)) {
        const rawConvs = data.data;
        let totalUnread = 0;

        const convWithLastMsg: Conversation[] = await Promise.all(
          rawConvs.map(async (conv: any) => {
            let lastMsgContent = "";
            try {
              const msgRes = await fetch(
                `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/message/conversation_messages?conversationId=${conv.conversationID}&pageNumber=1&pageSize=1`
              );
              const msgData = await msgRes.json();
              const lastMsg = msgData?.data?.items?.[0];

              const isSentByMe = lastMsg?.senderID === userId;
              lastMsgContent = lastMsg?.content
                ? isSentByMe
                  ? `Bạn: ${lastMsg.content}`
                  : lastMsg.content
                : "";

              const isCurrentConvOpen = conv.conversationID === currentOpenedId;
              if (lastMsg?.senderID !== userId && !isCurrentConvOpen) {
                totalUnread += 1;
              }
            } catch (err) {
              console.error("Lỗi load tin nhắn cuối:", err);
            }

            const [name1, name2] = (conv.conversationName || "").split("__");
            const displayName = name1 === currentName ? name2 : name1;
            const otherUser = allUsers.find((u) => u.name === displayName);
            const avatar = otherUser?.avatar || "";

            return {
              id: conv.conversationID,
              name: displayName,
              avatar,
              lastMessage: lastMsgContent,
            };
          })
        );

        setConversations(convWithLastMsg);
        setUnreadCount(totalUnread);
      }
    } catch (err) {
      console.error("Lỗi load danh sách hội thoại:", err);
    }
  };

  useEffect(() => {
    fetchConversations(); //ngay từ đầu
  }, []);

  useEffect(() => {
    if (open) {
      fetchConversations(); // lại khi mở dropdown
    }
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openChat = async (conv: Conversation) => {
    try {
      const res = await fetch(
        `https://influencerhub1-g8dshgbwhgb9djfd.southeastasia-01.azurewebsites.net/api/message/conversation_messages?conversationId=${conv.id}&pageNumber=1&pageSize=50`
      );
      if (!res.ok) {
        console.error("Lỗi gọi API conversation_messages:", res.status);
        return;
      }

      const data = await res.json();
      const rawMessages = data?.data?.items || [];

      const msgs: Message[] = rawMessages.map((msg: any) => ({
        id: msg.messageID,
        sender:
          msg.senderID === localStorage.getItem("userId") ? "me" : "other",
        content: msg.content,
        time: msg.sentAt,
      }));

      setSelectedConv(conv);
      setConversationId(conv.id);
      setCurrentOpenedId(conv.id);
      setMessages(msgs);
      setOpen(false);
      setUnreadCount(0); //ẩn badge sau khi mở chat
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loop = async () => {
      while (isMounted) {
        await fetchConversations();
        await new Promise((res) => setTimeout(res, 3000));
      }
    };

    loop();

    return () => {
      isMounted = false;
    };
  }, [currentOpenedId]);

  return (
    <>
      <div className="relative font-montserrat" ref={dropdownRef}>
        <div
          onClick={() => setOpen((prev) => !prev)}
          className="w-9 h-9 flex items-center justify-center cursor-pointer relative"
        >
          <MessageCircleMore className="text-white w-6 h-6" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </div>
          )}
        </div>

        {open && (
          <div className="absolute right-0 top-11 w-96 max-h-[420px] overflow-y-auto scrollbar-hide bg-white shadow-[0_8px_24px_rgba(0,0,0,0.20)] rounded-xl z-50 font-montserrat">
            <div className="p-4 pb-0 text-lg font-semibold text-gray-800 border-b bg-white rounded-t-xl flex justify-between items-center">
              <span>Tin nhắn</span>
              <button
                className="bg-transparent hover:text-teal-800 transition p-0 m-0 border-none outline-none"
                onClick={() => {
                  setShowNewModal(true);
                  setOpen(false);
                }}
              >
                <Plus className="w-5 h-5 text-teal-600" />
              </button>
            </div>
            <div className="p-3">
              {conversations.length === 0 ? (
                <div className="text-sm text-gray-500">
                  Chưa có tin nhắn nào.
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-center gap-3 p-3 rounded-lg shadow-sm transition hover:bg-lightgray cursor-pointer"
                    onClick={() => openChat(conv)}
                  >
                    <img
                      src={conv.avatar || "https://via.placeholder.com/40"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{conv.name}</span>
                      <span className="text-gray-500 text-xs truncate max-w-[180px]">
                        {conv.lastMessage || "Chưa có tin nhắn"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {showNewModal && (
        <NewMessage
          onClose={() => setShowNewModal(false)}
          onSelect={(user, conversationId, messages = []) => {
            const newConv: Conversation = {
              id: conversationId,
              name: user.name,
              avatar: user.avatar,
              lastMessage: messages[messages.length - 1]?.content || "",
            };
            setSelectedConv(newConv);
            setConversationId(conversationId);
            setMessages(messages);
            setShowNewModal(false);
            setUnreadCount(0);
          }}
        />
      )}

      {selectedConv && conversationId && (
        <ChatPopup
          conversationId={conversationId}
          conversationName={selectedConv.name}
          avatar={selectedConv.avatar || ""}
          messages={messages}
          onClose={() => {
            setSelectedConv(null);
            setConversationId(null);
          }}
        />
      )}
    </>
  );
}
