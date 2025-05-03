<script setup lang="ts">
import { ref } from 'vue';
import { auth,db } from "~/lib/firebase"; // 載入 Firebase Authentication
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
/*-For Set Blank Layout-*/
definePageMeta({
  layout: "blank",
});

const checkbox = ref(true);
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
  const tenantId = 'tenant_demo'; // 這邊可以之後改成動態選擇租戶或透過邀請碼取得

// 驗證規則
const emailRules = [(v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid"];
const passwordRules = [(v: string) => v.length >= 6 || "Password must be at least 6 characters"];

// 註冊函數
const register = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Firebase 註冊
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    console.log("User registered: ", userCredential.user);
    //新增用戶到 Firestore 中的 users 集合
    const user = userCredential.user
    await setDoc(doc(db, 'user', user.uid), {
      uid: user.uid,
      email: user.email,
      tenantId,
      role: 'member',
      creat_at: serverTimestamp()
    })

    // 如跳轉到首頁：
    useRouter().push("/");
  } catch (err:any) {
    console.error("Registration error: ", err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Email</v-label>
            <v-text-field v-model="email" variant="outlined" type="email" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">密碼</v-label>
            <v-text-field variant="outlined"  hide-details color="primary" 
                v-model="password"
                label="Password"
                type="password"
                :rules="passwordRules"
                required>
                </v-text-field>
        </v-col>
        <v-col cols="12" >
            <v-btn @click.prevent="register" color="primary" size="large" block   flat>Sign up</v-btn>
        </v-col>
    </v-row>
</template>
