import fetch from "node-fetch";

export default async function handler(req, res) {
  // Thiết lập CORS cho mọi response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");

  // Trả lời nhanh cho pre-flight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Chỉ cho phép POST requests
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    console.log("🤖 Nhận request từ frontend:", new Date().toISOString());

    const AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
    const AI_MODEL_NAME =
      process.env.GOOGLE_AI_MODEL_NAME || "gemini-2.0-flash";
    const AI_MODEL_ENDPOINT = `https://generativelanguage.googleapis.com/v1/models/${AI_MODEL_NAME}:generateContent?key=${AI_API_KEY}`;

    // Kiểm tra API key
    if (!AI_API_KEY) {
      console.error("❌ API Key missing");
      return res.status(500).json({ error: "API Key not configured" });
    }

    console.log("📤 Gửi tới Google Gemini API...");

    const response = await fetch(AI_MODEL_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Google API Error:", data);
      return res.status(response.status).json(data);
    }

    console.log("📥 Nhận response thành công từ Gemini");
    return res.status(response.status).json(data);
  } catch (error) {
    console.error("❌ Proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
