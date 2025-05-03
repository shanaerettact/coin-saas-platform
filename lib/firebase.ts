import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase 配置 (從 Firebase 控制台複製)
const firebaseConfig = {
    apiKey: "AIzaSyCPPb2aJ7vJ-1BDuFUY97ifEh1SGqHaMXA",
    authDomain: "coin-saas-platform.firebaseapp.com",
    projectId: "coin-saas-platform",
    storageBucket: "coin-saas-platform.firebasestorage.app",
    messagingSenderId: "883965912394",
    appId: "1:883965912394:web:047d53f11780c96d1c4db3"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firebase Authentication 和 Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';

// export default defineNuxtPlugin(() => {
//   const firebaseConfig = {
//     apiKey: "AIzaSyCPPb2aJ7vJ-1BDuFUY97ifEh1SGqHaMXA",
//     authDomain: "coin-saas-platform.firebaseapp.com",
//     projectId: "coin-saas-platform",
//     storageBucket: "coin-saas-platform.firebasestorage.app",
//     messagingSenderId: "883965912394",
//     appId: "1:883965912394:web:047d53f11780c96d1c4db3"
//   };

//   const app = initializeApp(firebaseConfig);
//   const auth = getAuth(app);

//   return {
//     provide: {
//       firebase: app,
//       auth
//     }
//   }
// });