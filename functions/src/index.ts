import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import express from "express";
import * as crypto from "crypto";
import axios from "axios";

// 初始化 Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// 建立 Express App
const app = express();
app.use(express.json()); // 使用 express.json() 處理 JSON 格式的請求

// LINE Webhook 處理函式
app.post("/webhook/:tenantId", async (req, res) => {
  const tenantId = req.params.tenantId;
  if (!tenantId) {
    console.error("❌ Missing tenantId");
    return res.status(400).send("Missing tenantId");
  }

  const signature = req.get("x-line-signature") || "";
  const rawBody = req.body; // 使用 express.json() 處理後的 req.body
  const rawBodyString = JSON.stringify(rawBody); // 將 body 轉換回 JSON 字串，用於簽章計算

  // 印出接收到的 body
  console.log("✅ Received body:", rawBodyString);

  // 取得租戶資訊
  const docSnap = await db.collection("tenants").doc(tenantId).get();
  if (!docSnap.exists) {
    console.error(`❌ Tenant not found: ${tenantId}`);
    return res.status(404).send("Tenant not found");
  }

  const cfg = docSnap.data()!;
  const secret = cfg.lineChannelSecret as string;
  const token = cfg.lineChannelAccessToken as string;

  // 計算簽章
  const hash = crypto
    .createHmac("SHA256", secret)
    .update(rawBodyString) // 使用原始 JSON 字串進行簽章計算
    .digest("base64");

  console.log("🧾 LINE Signature Header:", signature);
  console.log("🧾 Calculated Hash:", hash);

  if (hash !== signature) {
    console.warn("❌ Signature mismatch");
    return res.status(403).send("Invalid signature");
  }

  // 處理訊息
  for (const evt of rawBody.events || []) {
    if (evt.type === "message" && evt.message.type === "text") {
      console.log(
        `📩 Replying to ${evt.replyToken} with message: ${evt.message.text}`
      );

      await axios.post(
        "https://api.line.me/v2/bot/message/reply",
        {
          replyToken: evt.replyToken,
          messages: [
            {
              type: "text",
              text: `【${cfg.name}】收到：${evt.message.text}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
  }

  res.status(200).send("OK");
});

// 匯出 Function
export const api = functions
  .region("asia-east1")
  .https.onRequest(app);
