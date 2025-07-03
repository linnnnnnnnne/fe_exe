import fetch from "node-fetch";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");

  // Pre-flight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const AI_API_KEY = process.env.GOOGLE_AI_API_KEY;
    const AI_MODEL_NAME =
      process.env.GOOGLE_AI_MODEL_NAME || "gemini-2.0-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${AI_MODEL_NAME}:generateContent?key=${AI_API_KEY}`;

    if (!AI_API_KEY) {
      return res.status(500).json({ error: "API Key not configured" });
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
