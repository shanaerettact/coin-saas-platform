import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import express from "express";
import * as crypto from "crypto";
import axios from "axios";

// 初始化 Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();

// Webhook 專用 raw middleware
app.post(
  "/webhook/:tenantId",
  express.raw({ type: "*/*" }),
  async (req, res) => {
    const tenantId = req.params.tenantId;
    const contentType = req.get("content-type") || "undefined";
    const signature = req.get("x-line-signature") || "";

    console.log("📩 Received webhook");
    console.log("👉 tenantId:", tenantId);
    console.log("👉 Content-Type:", contentType);
    console.log("👉 Signature:", signature);
    console.log("👉 RawBody length:", req.body?.length);

    if (!tenantId) return res.status(400).send("Missing tenantId");

    const rawBody = req.body as Buffer;

    let body: any;
    try {
      body = JSON.parse(rawBody.toString("utf8"));
      console.log("✅ Parsed body:", body);
    } catch (err) {
      console.error("❌ Invalid JSON:", err);
      return res.status(400).send("Invalid JSON");
    }

    const docSnap = await db.collection("tenants").doc(tenantId).get();
    if (!docSnap.exists) {
      console.error("❌ Tenant not found:", tenantId);
      return res.status(404).send("Tenant not found");
    }

    const cfg = docSnap.data()!;
    const secret = cfg.lineChannelSecret as string;
    const token = cfg.lineChannelAccessToken as string;

    const hash = crypto
      .createHmac("SHA256", secret)
      .update(rawBody)
      .digest("base64");

    if (hash !== signature) {
      console.error("❌ Signature mismatch");
      console.error("Expected:", hash);
      console.error("Received:", signature);
      return res.status(403).send("Invalid signature");
    }

    for (const evt of body.events || []) {
      console.log("📦 Event:", evt);
      if (evt.type === "message" && evt.message.type === "text") {
        try {
          const reply = await axios.post(
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
          console.log("✅ LINE reply success:", reply.data);
        } catch (err) {
          console.error("❌ LINE reply failed:", err);
        }
      }
    }

    return res.status(200).send("OK");
  }
);


// 匯出 Function
export const api = functions.region("asia-east1").https.onRequest(app);
