import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface User {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
}

interface NewMessageProps {
  onClose: () => void;
  onSelect: (user: User, conversationId: string, messages?: Message[]) => void;
}

export default function NewMessage({ onClose, onSelect }: NewMessageProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const [resBusiness, resInflu] = await Promise.all([
        fetch(
          query
            ? `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/search-by-name?name=${query}`
            : `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/business/all`
        ),
        fetch(
          query
            ? `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/influ/search-by-name?keyword=${query}`
            : `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/influ/all`
        ),
      ]);

      const businessData = await resBusiness.json();
      const influData = await resInflu.json();

      const businessList = (businessData?.data || []).map((b: any) => ({
        id: b.id,
        userId: b.userId,
        name: b.name,
        avatar: b.logo,
      }));

      const influList = (influData?.data || []).map((i: any) => ({
        id: i.influId,
        userId: i.userId,
        name: i.name,
        avatar: i.linkImage,
      }));

      setResults([...businessList, ...influList]);
    } catch (err) {
      console.error("Lỗi khi tìm người nhận:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  const handleSelect = async (user: User) => {
    const creatorId = localStorage.getItem("userId");
    if (!creatorId) return alert("Không tìm thấy userId đăng nhập");

    const currentUser = results.find((u) => u.userId === creatorId);
    if (!currentUser) return alert("Không xác định được người dùng hiện tại");

    const [name1, name2] = [currentUser.name, user.name].sort();
    const conversationName = `${name1}__${name2}`;

    // B1: Kiểm tra hội thoại đã tồn tại chưa
    try {
      const resCheck = await fetch(
        `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/conversation/user_conversations?userId=${creatorId}`
      );
      const dataCheck = await resCheck.json();
      const existed = dataCheck?.data?.find(
        (c: any) => c.conversationName === conversationName
      );

      if (existed) {
        // Nếu đã tồn tại (lấy tin nhắn cũ)
        try {
          const msgRes = await fetch(
            `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/message/conversation_messages?conversationId=${existed.conversationID}&pageNumber=1&pageSize=50`
          );
          const msgData = await msgRes.json();
          const rawMessages = msgData?.data?.items || [];

          const formatted = rawMessages.map((msg: any) => ({
            id: msg.messageID,
            sender: msg.senderID === creatorId ? "me" : "other",
            content: msg.content,
            time: msg.sentAt,
          }));

          onSelect(
            {
              ...user,
              avatar: user.avatar || "",
            },
            existed.conversationID,
            formatted
          );
          onClose();
          return;
        } catch (err) {
          console.error("Lỗi lấy tin nhắn cũ:", err);
          alert("Không thể tải tin nhắn cũ.");
          return;
        }
      }
    } catch (err) {
      console.error("Lỗi kiểm tra hội thoại:", err);
      alert("Không thể kiểm tra hội thoại.");
      return;
    }

    // B2: Nếu chưa có / Tạo mới
    try {
      const res = await fetch(
        `https://influencerhub-ftdqh8c2fagcgygt.southeastasia-01.azurewebsites.net/api/conversation/create?creatorId=${creatorId}&name=${conversationName}&isGroup=false`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([user.userId]),
        }
      );

      const data = await res.json();
      if (res.ok && data?.isSuccess && data?.data) {
        const conversationId = data.data?.conversationID;
        onSelect(user, conversationId, []);
        onClose();
      } else {
        console.error("Lỗi tạo hội thoại:", data);
        alert("Không thể tạo cuộc trò chuyện.");
      }
    } catch (err) {
      console.error("Lỗi tạo hội thoại:", err);
      alert("Không thể tạo cuộc trò chuyện.");
    }
  };

  return (
    <div className="fixed bottom-5 right-8 w-96 max-h-[500px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.20)] rounded-xl z-50 font-montserrat flex flex-col">
      {/* Header */}
      <div className="p-4 pb-2 border-b flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">Tin nhắn mới</h2>
        <X
          className="cursor-pointer text-gray-500 hover:text-black"
          size={20}
          onClick={onClose}
        />
      </div>

      {/* Search input */}
      <div className="px-4 pt-2 pb-3 border-b">
        <label className="text-sm text-gray-600 block mb-1">Đến:</label>
        <input
          type="text"
          className="w-[325px] border rounded px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-teal-500 placeholder:pl-2"
          placeholder="Nhập tên để tìm kiếm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Result list */}
      <div className="overflow-y-auto flex-1 py-2">
        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-4 py-2 hover:bg-lightgray cursor-pointer"
            onClick={() => handleSelect(user)}
          >
            <img
              src={user.avatar || "https://via.placeholder.com/40"}
              className="w-8 h-8 rounded-full object-cover"
              alt={user.name}
            />
            <span className="text-sm text-gray-800">{user.name}</span>
          </div>
        ))}
        {results.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">
            Không tìm thấy người dùng.
          </div>
        )}
      </div>
    </div>
  );
}
