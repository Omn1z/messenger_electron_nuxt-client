import {io, Socket} from 'socket.io-client'
import { Context } from '@nuxt/types'
import {IUser} from '~/scripts/user'
import {ChannelState, ITextChannel, SearchChannelResponse, SearchChannelContext, IMessage} from './channel'
const setupCallbacks = (socket: Socket, { store }: Context, baseUrl: string, opts: any) => {
    socket.$state.socket = socket
    socket.on('user:changed', (user: IUser) => {
        store.commit('auth/SET_USER', user)
    })
    socket.on('new:message', async (msg: IMessage) => {
        if(socket.$state.channels.findIndex(state => state.channel.id === msg.channel_id) === -1) {
            socket.emit('load:channel:first', msg.channel_id)
        }
        store.commit('auth/INC_MSG_ALERT')
    })
    socket.on('load:channel:first', (channel: ITextChannel) => {
        if(socket.$state.channels.findIndex((state: ChannelState) => {
            return state.channel.id === channel.id
        }) === -1) {
            socket.$state.front(
                new ChannelState(
                    channel,
                    io(`${baseUrl}text_channel_${channel.id}`, opts), socket.$state))
        }
        socket.$state.sort()
    })
    socket.on('queryChannels', (channels: Array<ITextChannel>) => {
        for (const channel of channels) {
            if(socket.$state.channels.findIndex((state: ChannelState) => {
                return state.channel.id === channel.id
            }) === -1) {
                socket.$state.listen(
                    new ChannelState(
                        channel,
                        io(`${baseUrl}text_channel_${channel.id}`, opts), socket.$state))
            }
        }
        socket.$state.sort()
        socket.$state.loaded = true
    })
    socket.on('query:search', (results: Array<SearchChannelResponse>) => {
        socket.$state.search = []
        for (const result of results) {
            if(result.channel) {
                const channel = result.channel
                const idx = socket.$state.channels.findIndex(state => state.channel.id === channel.id)
                if(idx === -1) {
                    socket.$state.search.push({
                        channel: new ChannelState(
                            channel,
                            io(`${baseUrl}text_channel_${channel.id}`, opts), socket.$state)
                    })
                } else {
                    socket.$state.search.push({
                        channel: socket.$state.channels[idx]
                    })
                }
            } else if (result.user) {
                const user = result.user as IUser
                socket.$state.search.push({
                    user
                })
            }
        }
    })
}

export default setupCallbacks