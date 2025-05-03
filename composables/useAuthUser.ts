import { ref, onMounted } from 'vue'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '~/lib/firebase'
import { useTenantStore } from '@/stores/tenant'

const currentUser = ref<User | null>(null)

export function useAuthUser() {
  const tenantStore = useTenantStore()

  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      tenantStore.setUser(user) // 🔥 呼叫 tenantStore 處理使用者資料 & 租戶資料
    })
  })

  return { currentUser }
}