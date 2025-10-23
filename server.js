import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const GEMINI_API_KEY = "YOUR_GEMINI_KEY"; // thay bằng key thật

app.post("/generate", async (req, res) => {
  try {
    const { base64 } = req.body;
    if (!base64) return res.status(400).json({ error: "Missing image data" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Hãy mô tả ngắn gọn bức ảnh này bằng tiếng Việt tự nhiên." },
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64.replace(/^data:image\/jpeg;base64,/, ""),
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini proxy failed" });
  }
});

app.listen(3000, () => console.log("✅ Gemini proxy running on port 3000"));
