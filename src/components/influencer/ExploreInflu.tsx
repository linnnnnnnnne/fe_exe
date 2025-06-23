import ChatPopup from "../../components/share/ChatPopup";
import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";
import InfluList from "../../components/influencer/InfluList";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import TopInfluencer from "../../components/influencer/TopInflu";

const locationOptions = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "TP.HCM", value: "TP.HCM" },
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Cần Thơ", value: "Cần Thơ" },
  { label: "Huế", value: "Huế" },
];

const normalizeLocation = (text: string) =>
  text.toLowerCase().replace(/\./g, "").replace(/\s+/g, "");

const locationAliasMap: { [key: string]: string[] } = {
  "TP.HCM": ["hcm", "tp hcm", "tphcm", "tp.hcm"],
  "Hà Nội": ["hanoi", "hn", "hà nội"],
  "Đà Nẵng": ["danang", "đà nẵng", "đn"],
  "Cần Thơ": ["cantho", "cần thơ", "ct"],
  Huế: ["hue", "huế"],
};

export default function ExploreInflu() {
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("Tất cả");
  const [filterLocation, setFilterLocation] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [highlightInfluencer, setHighlightInfluencer] = useState<any | null>(
    null
  );
  const listRef = useRef<HTMLDivElement | null>(null);
  const [membershipUserIds, setMembershipUserIds] = useState<string[]>([]);

  const [selectedConv, setSelectedConv] = useState<any>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const MAX_FOLLOWER_LIMIT = 2147483647;
  const [minFollower, setMinFollower] = useState(0);
  const [maxFollower, setMaxFollower] = useState(MAX_FOLLOWER_LIMIT);

  const itemsPerPage = 6;
  useEffect(() => {
    const fetchMembershipUsers = async () => {
      try {
        const res = await fetch(
          "https://localhost:7035/api/membership/influencers"
        );
        const json = await res.json();

        if (json.isSuccess && Array.isArray(json.data)) {
          const ids = json.data.map((item: any) => item.userId);
          console.log("Membership userIds:", ids);
          setMembershipUserIds(ids);
        }
      } catch (err) {
        console.error("Lỗi khi fetch membership influencers:", err);
      }
    };

    fetchMembershipUsers();
  }, []);

  useEffect(() => {
    const fetchFieldOptions = async () => {
      try {
        const res = await fetch("https://localhost:7035/api/field/get-all");
        const json = await res.json();
        if (json.isSuccess && Array.isArray(json.data)) {
          const names = json.data
            .filter((f: any) => f.name && f.name.trim() !== "")
            .map((f: any) => f.name.trim());
          setFieldOptions(["Tất cả", ...names]);
        }
      } catch (err) {
        console.error("Failed to fetch fields:", err);
      }
    };

    fetchFieldOptions();
  }, []);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const res = await fetch(
          `https://localhost:7035/api/influ/search-by-follower?minFollower=${minFollower}&maxFollower=${maxFollower}`
        );
        const json = await res.json();

        if (json && Array.isArray(json.data)) {
          const mapped = await Promise.all(
            json.data.map(async (i: any) => {
              let fieldNames: string[] = [];

              try {
                const fieldRes = await fetch(
                  `https://localhost:7035/api/field/get-all-field-of-influ/${i.influId}`
                );
                const fieldJson = await fieldRes.json();
                if (fieldJson.isSuccess && Array.isArray(fieldJson.data)) {
                  fieldNames = fieldJson.data
                    .filter((f: any) => f.name && f.name.trim() !== "")
                    .map((f: any) => f.name.trim());
                }
              } catch (err) {
                console.error(
                  `Error fetching field for influencer ${i.influId}`,
                  err
                );
              }

              return {
                userId: i.userId,
                name: i.name,
                nickName: i.nickName || "Influencer",
                description: i.bio,
                followers: i.follower.toLocaleString("vi-VN"),
                area: i.area || "",
                linkImage: i.linkImage,
                fieldNames,
              };
            })
          );

          setInfluencers(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch influencers:", err);
      }
    };

    fetchInfluencers();
  }, [minFollower, maxFollower]);

  useEffect(() => {
    if (highlightInfluencer && listRef.current) {
      listRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [highlightInfluencer]);

  const handleConnect = async (influencer: any) => {
    const creatorId = localStorage.getItem("userId");
    if (!creatorId) return alert("Bạn chưa đăng nhập");

    const [resBusiness, resInflu] = await Promise.all([
      fetch("https://localhost:7035/api/business/all"),
      fetch("https://localhost:7035/api/influ/all"),
    ]);
    const businessData = await resBusiness.json();
    const influData = await resInflu.json();

    const allUsers = [
      ...(businessData?.data || []).map((u: any) => ({
        userId: u.userId,
        name: u.name,
        type: "business",
      })),
      ...(influData?.data || []).map((u: any) => ({
        userId: u.userId,
        name: u.name,
        type: "influencer",
      })),
    ];

    const currentUser = allUsers.find((u) => u.userId === creatorId);
    if (!currentUser) return alert("Không xác định được người dùng hiện tại");

    const [name1, name2] = [currentUser.name, influencer.name].sort();
    const conversationName = `${name1}__${name2}`;

    try {
      const resConv = await fetch(
        `https://localhost:7035/api/conversation/user_conversations?userId=${creatorId}`
      );
      const dataConv = await resConv.json();
      const existed = dataConv?.data?.find(
        (c: any) => c.conversationName === conversationName
      );

      if (existed) {
        const convId = existed.conversationID;

        try {
          const msgRes = await fetch(
            `https://localhost:7035/api/message/conversation_messages?conversationId=${convId}&pageNumber=1&pageSize=50`
          );
          const msgData = await msgRes.json();
          const rawMessages = msgData?.data?.items || [];

          const formatted = rawMessages.map((msg: any) => ({
            id: msg.messageID,
            sender: msg.senderID === creatorId ? "me" : "other",
            content: msg.content,
            time: msg.sentAt,
          }));

          setConversationId(convId);
          setSelectedConv({
            name: influencer.name,
            avatar: influencer.linkImage,
          });
          setMessages(formatted);
          return;
        } catch (err) {
          console.error("Lỗi lấy tin nhắn cũ:", err);
          alert("Không thể tải tin nhắn.");
          return;
        }
      }
    } catch (err) {
      console.error("Lỗi kiểm tra hội thoại:", err);
    }

    try {
      const res = await fetch(
        `https://localhost:7035/api/conversation/create?creatorId=${creatorId}&name=${conversationName}&isGroup=false`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([influencer.userId]),
        }
      );

      const data = await res.json();
      if (res.ok && data?.isSuccess) {
        const convId = data.data.conversationID;
        setConversationId(convId);
        setSelectedConv({
          name: influencer.name,
          avatar: influencer.linkImage,
        });
        setMessages([]);
      } else {
        console.error("Lỗi tạo hội thoại:", data);
        alert("Không thể tạo cuộc trò chuyện.");
      }
    } catch (err) {
      console.error("Lỗi tạo hội thoại:", err);
      alert("Không thể tạo cuộc trò chuyện.");
    }
  };

  const filteredInfluencers = influencers.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchField =
      filterField === "Tất cả" || i.fieldNames.includes(filterField);
    const matchLocation =
      filterLocation === "Tất cả" ||
      locationAliasMap[filterLocation]?.some(
        (alias) => normalizeLocation(i.area) === normalizeLocation(alias)
      );

    return matchSearch && matchField && matchLocation;
  });

  const totalPages = Math.ceil(filteredInfluencers.length / itemsPerPage);
  const currentItems = filteredInfluencers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const combinedItems = highlightInfluencer
    ? [
        highlightInfluencer,
        ...currentItems.filter((i) => i.userId !== highlightInfluencer.userId),
      ]
    : currentItems;

  return (
    <section className="w-full font-montserrat mt-0">
      <TopInfluencer onHighlight={(influ) => setHighlightInfluencer(influ)} />

      <h1 className="text-3xl font-bold text-center text-teal mt-20 mb-8">
        KHÁM PHÁ HỒ SƠ KHÁC
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 px-[40px]">
        {/* Sidebar filter */}
        <aside className="w-full lg:w-[350px] mt-[63px]">
          <div className="bg-[#C7D7D3] rounded-xl p-4 shadow-lg">
            {/* Field filter */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-teal mb-2">
                Lĩnh vực hoạt động
              </h2>
              <div className="flex flex-wrap gap-2">
                {fieldOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilterField(option);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-sm rounded-full border ${
                      filterField === option
                        ? "bg-teal text-white"
                        : "bg-white text-teal border-teal"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Follower filter */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-teal mb-2">
                Khoảng người theo dõi
              </h2>
              <div className="text-sm text-gray-700 mb-2">
                Từ {minFollower.toLocaleString()} đến{" "}
                {maxFollower.toLocaleString()} followers
              </div>
              <div className="px-2 pt-1 pb-4">
                <Slider
                  range
                  min={0}
                  max={MAX_FOLLOWER_LIMIT}
                  step={100000}
                  value={[minFollower, maxFollower]}
                  onChange={(values: number | number[]) => {
                    if (Array.isArray(values)) {
                      setMinFollower(values[0]);
                      setMaxFollower(values[1]);
                      setCurrentPage(1);
                    }
                  }}
                  trackStyle={[{ backgroundColor: "#0f766e" }]}
                  handleStyle={[
                    { borderColor: "#0f766e", backgroundColor: "#0f766e" },
                    { borderColor: "#0f766e", backgroundColor: "#0f766e" },
                  ]}
                  railStyle={{ backgroundColor: "#ccc" }}
                />
              </div>
              <div className="text-xs text-gray-500">
                Kéo 2 đầu để chọn khoảng follower mong muốn
              </div>
            </div>

            {/* Location filter */}
            <div>
              <h2 className="text-lg font-semibold text-teal mb-2">Khu vực</h2>
              <select
                value={filterLocation}
                onChange={(e) => {
                  setFilterLocation(e.target.value);
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="w-full border border-teal rounded-md px-3 py-2 text-sm leading-tight focus:outline-none focus:ring-1 focus:ring-darkseagreen"
              >
                {locationOptions.map((loc) => (
                  <option key={loc.label} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1" ref={listRef}>
          <div className="mb-6">
            <div className="flex h-[40px] rounded-2xl overflow-hidden border border-gray-300 bg-white shadow-md hover:shadow-lg transition-all duration-300">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên ..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 px-5 text-[15px] text-gray-900 placeholder-gray-500 outline-none"
              />
              <button className="bg-teal hover:bg-teal200 text-white px-5 flex items-center justify-center transition">
                <Search className="w-8 h-5 text-white" />
              </button>
            </div>
          </div>

          <InfluList
            items={combinedItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            onConnect={handleConnect}
            highlightMembershipUserIds={membershipUserIds}
          />

          {filteredInfluencers.length === 0 && (
            <p className="text-center text-darkgray mt-10">
              Không tìm thấy hồ sơ phù hợp.
            </p>
          )}
        </div>
      </div>

      {selectedConv && conversationId && (
        <ChatPopup
          conversationId={conversationId}
          conversationName={selectedConv.name}
          avatar={selectedConv.avatar}
          messages={messages}
          onClose={() => {
            setSelectedConv(null);
            setConversationId(null);
          }}
        />
      )}
    </section>
  );
}
