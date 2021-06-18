import {defineNuxtPlugin, useRouter} from '@nuxtjs/composition-api'
import createPersistedState from 'vuex-persistedstate'

export default defineNuxtPlugin(async (ctx) => {
    createPersistedState({
        paths: ['auth.token'],
        storage: {
            getItem: (key) => localStorage.getItem(key),
            setItem: (key, value) => localStorage.setItem(key, value),
            removeItem: (key) => localStorage.removeItem(key)
        },
    })(ctx.store)

    ctx.app.router!.beforeEach((to, from, next) => {
        ctx.store.dispatch('beforeRoute', {
            context: ctx,
            to: to,
        }).then(() => {
            next()
        })
    })
})
