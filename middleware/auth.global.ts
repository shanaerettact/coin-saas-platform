import { auth } from '~/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
    if(to.path.startsWith('/auth')) return

    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if(!user) {
                return resolve('/auth/login')
            }
            resolve()
        })
    })
})