import { ActionTree } from 'vuex'
import { io } from 'socket.io-client'
import setupCallbacks from '../scripts/sockets'
import { ChannelsState } from '../scripts/channel'

export const state = () => {}

export type RootState = ReturnType<typeof state>

export const actions: ActionTree<RootState, RootState> = {
    async beforeRoute({ dispatch }, { context, to }) {
        await dispatch('auth/update')
        if(context.store.getters['auth/isAuth'] && to.name === 'main' && !context.$socket.connected) {
            const baseUrl = context.$axios.defaults.baseURL
            const opts = {
                extraHeaders: {
                    'Authorization' : `Bearer ${ context.store.state.auth.token }`
                }
            }
            const socket = io(baseUrl, opts)
            socket.$state = new ChannelsState()
            setupCallbacks(socket, context, baseUrl, opts)
            socket.on('connect_error', (error) => {
                if(error.message !== 'xhr poll error') {
                    console.dir(error)
                }
                /*context.store.commit('auth/SET_TOKEN', null)
                context.redirect('/welcome')
                context.$socket = {}*/
            })
            socket.on('unauthorized', () => {
                context.store.commit('auth/SET_TOKEN', null)
                context.redirect('/welcome')
            })
            context.$socket = socket
        }
    }
}
