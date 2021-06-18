import { defineNuxtPlugin } from '@nuxtjs/composition-api'

export default defineNuxtPlugin(({ $axios, store, redirect }) => {
    $axios.onRequest((request) => {
        if (store.getters['auth/isAuth'])
            request.headers.Authorization = `Bearer ${store.state.auth.token}`
        return request
    })

    $axios.onResponse((response) => {
        return response
    })

    $axios.onError((error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            store.getters['auth/isAuth']
        ) {
            store.commit('auth/SET_TOKEN', null)
            redirect('/')
            return error
        }
        return error
    })
})
