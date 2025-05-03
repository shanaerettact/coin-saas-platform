// stores/tenant.ts
import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { User } from 'firebase/auth'

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    firebaseUser: null as User | null,
    tenantId: null as string | null,
    tenant: null as any,
    userProfile: null as any,
    paymentConfig: ref<any>(null),
    lineConfig: ref<any>(null),
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async setUser(user: User | null) {
      this.firebaseUser = user
      if (user) {
        await this.fetchTenantFromUser(user.uid)
      }
    },

    async fetchTenantFromUser(uid: string) {
      this.loading = true
      this.error = null

      try {
        // 讀取 Firestore 上的使用者文件
        const userDoc = await getDoc(doc(db, 'user', uid))
        if (!userDoc.exists()) throw new Error('使用者文件不存在')

        const userData = userDoc.data()
        this.userProfile = userData
        const tenantId = userData.tenantId
        if (!tenantId) throw new Error('使用者尚未關聯 tenantId')

        this.tenantId = tenantId


        const tenantDoc = await getDoc(doc(db, 'tenants', tenantId))
        if (!tenantDoc.exists()) throw new Error('租戶文件不存在')

        this.tenant = tenantDoc.data()
        
        this.paymentConfig = this.tenant.paymentConfig
        this.lineConfig = {
          secret: this.tenant.lineChannelSecret,
          accessToken: this.tenant.lineChannelAccessToken,
        }
      } catch (err: any) {
        this.error = err.message
        console.error('❌ 載入租戶資料失敗', err)
      } finally {
        this.loading = false
      }
    }
  }
})
