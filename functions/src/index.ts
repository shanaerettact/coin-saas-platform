import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as crypto from 'crypto'
import axios from 'axios'

admin.initializeApp()
const db = admin.firestore()

export const lineWebhook = functions.https.onRequest(async (req, res) => {
  const tenantId = req.path.split('/').pop() // e.g. /line-webhook/tenant_demo

  if (!tenantId) {
    res.status(400).send('Missing tenantId')
    return
  }

  const signature = req.headers['x-line-signature'] as string
  const rawBody = req.rawBody
  const body = JSON.parse(rawBody.toString('utf8'))

  // 取得租戶資料
  const tenantDoc = await db.collection('tenants').doc(tenantId).get()
  if (!tenantDoc.exists) {
    res.status(404).send('Tenant not found')
    return
  }

  const tenantData = tenantDoc.data()
  const channelSecret = tenantData?.lineChannelSecret
  const accessToken = tenantData?.lineChannelAccessToken

  // 驗證簽名
  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(rawBody)
    .digest('base64')

  if (hash !== signature) {
    res.status(403).send('Invalid signature')
    return
  }

  const events = body.events
  for (const event of events) {
    if (event.type === 'message' && event.message.type === 'text') {
      const replyToken = event.replyToken
      const userMessage = event.message.text

      await axios.post(
        'https://api.line.me/v2/bot/message/reply',
        {
          replyToken,
          messages: [
            {
              type: 'text',
              text: `【${tenantData?.name}】回覆你：${userMessage}`,
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
    }
  }

  res.status(200).send('OK')
})
