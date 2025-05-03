// seed.js
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { Timestamp } from 'firebase-admin/firestore'

// 這邊換成你的 Firebase Admin SDK private key JSON
const serviceAccount = {
  // "type": "service_account",
  // "project_id": process.env.FIREBASE_PROJECT_ID,
  // "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  // "private_key": process.env.FIREBASE_PRIVATE_KEY, // 處理 \n 換行符,
  // "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  // "client_id": process.env.FIREBASE_CLIENT_ID,
  // "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  // "token_uri": "https://oauth2.googleapis.com/token",
  // "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  // "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
  // "universe_domain": "googleapis.com"
  "type": "service_account",
  "project_id": "coin-saas-platform",
  "private_key_id": "ff797ee1026e136a8f85b7d15417e39676524307",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPYlIl03HoqE/S\npLeIXvBfC1ZuL4pVyI5AGO94JrosJK9SchiORSUPIKwLXCde+b7zuow9vHEE5IGO\nIH/8/LAGOuIbj5/h+3c9MNf26UsbpAd2V0vAu3eRkY5l2Fi2VHw6IBENfww0tpYK\nYpawRky4mOZU6zCjpWBtJuxeP/gKPHwFdQOJM2exMNbg3VkU2QTN3H2q7po9/Dht\nl4tij3asWZ5MgFlpvPk3+ICO8FZ/0GJIZmOkgDn5t4BupUbQaENiHVSIxrZ/s5ca\nI2JIZMLA9UjCBl0zPdFpcWNqndTdFW/1JO6ChjvkjTXaApO4REqqkhylkr80xd4d\nUqAfeG4vAgMBAAECggEAP2HvdXwgblkyvFB3f4h0srfGXLrO7tTzFQgJ+JDtiZxU\nsUAJ3UGox+zWaEpsBg0SnW9AeYXkjPhB2Gx6cZnROrY4cO/+j5TJprwM5Xv75qDF\nXxfjIS6qpqTz/pCW3HMJ3MH8NEHGOz4qsVXcdFeoDys8CmwvW3Sp+fJRf6TRbF7v\nLuHAs78e6uHu4GyZLSIVNXNUH8o1DR9jnjQsDRolNouDRgUM3ZkWkJhW3QNBhXjc\nKSIVI+trUsJ/OLcLbgO/M/nAyQxkomYckWvFkxhz1PULOQvANDKZasXKjLrru093\njcZ3hDMO7paL6vfPeUhEXlLZqkEDnmedoryrMO6MoQKBgQDr2I3vzBkSmEylUfIc\nWxatK+GNduNS7qlq5+z6nt7UWgCvlDE6IZX486nxrFD4bEcIEoDix7dLp6GlLuHU\nxbgrLe+5CBEugLmjqGyYgcmI3E6gdCJ1KiNyYRDGJSZ6nFoX2gEIA6zKsnFRG0rU\nOnAH5V6mGn9rkb2yyY58n3mEdwKBgQDhGyAVvSf/2VwbPQarg2YjFXyKlNeBZP59\nssJ86YtV6LekCOadZRAsInosWnQ89vQnV8nD9jYqY2SWKn4lXmmuo0HEDxKN3XSb\n5sg1YRnFIpNhs6oR5/2K55D8VBghJSk5AdV8e5iASBlBFHR9WXvY9ouF6tIe3ATE\n3x/a1VLqCQKBgFWEzNLrGxxXBVPdBwGpNevNQZheR8fGqsANIS0vdnVhvWXtQnxl\nuU/wausrJKEwAgG3U+znpltUiZSwD0tr9oARxB9AAZrvKmFhrR8P0NhDqm8cLXJ2\nuSu8bqyqw+0pzLFhZ4ZUbs+BLP3P+65BEmaKkWuBqDqFOlgeJgCigxm5AoGBAJjn\nN/AMQHNFTY8i8Ljn1CTYn3Pyjj/SPhtbpUf7yy1bmgHOGfengki4Uox2FKakiEuB\nEggN4dUBFn359x2i994r/qwSIOREHMUZCb1Ya4zAY6PlygvHrS0BBjafWJSLDWkv\nmbeorHnWf3D5V/cdJUbGkRcx3fAgOw0PEjAu3tchAoGAPOJ2Q7O3EY7pP0a0R/XB\nAw4/N6GoZfO/ugjnKtVv9uP40xn4c86Otw0tYcHvoQOr8aoWtiW76G+uCqvLzyJl\nLiFuJL8uGbpN6sqv2qR29WNKDRFXo1rN2ESByeYxyEH9mLW/tDxwM7fP2AFpaopW\nxJKmU2pZ2bMtJVGYb4Atqls=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@coin-saas-platform.iam.gserviceaccount.com",
  "client_id": "117129938578965398123",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40coin-saas-platform.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

// 初始化 Firebase Admin
initializeApp({
  credential: cert(serviceAccount)
})

const db = getFirestore()

async function seed() {
  try {
    // 建立租戶
    const tenantRef = db.collection('tenants').doc('tenant_demo')
    .collection('users').doc('user_demo')
    await tenantRef.set({
      name: 'Demo幣商',
      createdAt: Timestamp(),
      plan: 'basic',
      lineChannelSecret: 'your-line-channel-secret',
      lineChannelAccessToken: 'your-line-access-token',
      paymentProvider: '綠界',
      paymentConfig: {
        merchantId: 'your-merchant-id',
        hashKey: 'your-hash-key',
        hashIV: 'your-hash-iv',
        notifyUrl: 'https://your-domain.com/api/payment/notify'
      }
    })
    console.log('✅ 租戶 tenant_demo 建立完成')

    // 建立用戶
    const userRef = db.collection('users').doc('user_demo')
    await userRef.set({
      tenantId: 'tenant_demo',
      email: 'demo@example.com',
      role: 'admin',
      createdAt: Timestamp()
    })
    console.log('✅ 用戶 user_demo 建立完成')

    // 建立一筆交易
    const transactionRef = db.collection('transactions').doc('transaction_demo')
    await transactionRef.set({
      tenantId: 'tenant_demo',
      userId: 'user_demo',
      amount: 1000,
      currency: 'TWD',
      paymentProvider: '綠界',
      status: 'paid',
      createdAt: Timestamp(),
      paymentData: {
        orderId: 'ORDER123456',
        paymentTime: Timestamp(),
        providerResponse: '付款成功'
      }
    })
    console.log('✅ 交易 transaction_demo 建立完成')

    console.log('🎉 全部初始化完成！')
    process.exit(0)
  } catch (error) {
    console.error('❌ 初始化失敗：', error)
    process.exit(1)
  }
}

seed()
