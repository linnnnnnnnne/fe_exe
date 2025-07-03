import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import handler from "./ai-proxy.js";

// Khởi tạo dotenv
dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:5175",
    ], // Thêm port 5175
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.send("AI Proxy Server is running");
});

// Test endpoint
app.get("/api/ai-proxy/test", (req, res) => {
  res.json({ status: "success", message: "AI Proxy is working" });
});

// Main AI endpoint - sử dụng handler từ ai-proxy.js
app.post("/api/ai-proxy", handler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 AI Proxy Server đang chạy trên http://localhost:${PORT}`);
  console.log(
    `🤖 Model: ${process.env.GOOGLE_AI_MODEL_NAME || "gemini-2.0-flash"}`
  );
  console.log(
    `🔑 API Key: ${
      process.env.GOOGLE_AI_API_KEY ? "✅ Configured" : "❌ Missing"
    }`
  );
  console.log("✅ Sẵn sàng nhận request từ frontend!");
});
 