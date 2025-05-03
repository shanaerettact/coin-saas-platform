<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence } from 'firebase/auth'
import { auth } from '~/lib/firebase'
 
const router = useRouter()

const email = ref('')
const password = ref('')
const checkbox = ref(true);
const loading = ref(false)
const errorMessage = ref('')
const rememberMe = ref(true)

const signIn  = async ()=> {
    loading.value = true
    errorMessage.value = ''
    try {
        if(!email.value || !password.value) {
            errorMessage.value = '請輸入 Email和密碼'
            return
        }

        await setPersistence(auth, checkbox.value ? browserLocalPersistence : browserSessionPersistence)

        await signInWithEmailAndPassword(auth, email.value, password.value)
        router.push('/')
    } catch (error:any) {
        errorMessage.value = error.message
    } finally {
        loading.value = false
    }
}

</script>

<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">Email</v-label>
            <v-text-field v-model="email" variant="outlined" hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">密碼</v-label>
            <v-text-field v-model="password" variant="outlined" type="password"  hide-details color="primary"></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
            <div class="d-flex flex-wrap align-center ml-n2">
                <v-checkbox v-model="checkbox"  color="primary" hide-details>
                    <template v-slot:label class="text-body-1">記住我</template>
                </v-checkbox>
                <div class="ml-sm-auto">
                    <NuxtLink to="/"
                        class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">忘記密碼 ?</NuxtLink>
                </div>
            </div>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-btn :loading="loading" @click="signIn" color="primary" size="large" block   flat>Sign in</v-btn>
        </v-col>
        <v-col cols="12" v-if="errorMessage" class="pt-0">
            <v-alert type="error" dense>{{ errorMessage }}</v-alert>
        </v-col>
    </v-row>
</template>
