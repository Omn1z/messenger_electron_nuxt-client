import { defineNuxtPlugin } from '@nuxtjs/composition-api'

import { io, Socket } from 'socket.io-client'
import {ChannelsState} from '~/scripts/channel'

declare module 'vue/types/vue' {
    interface Vue {
        $socket: Socket
    }
}

declare module '@nuxt/types' {
    interface NuxtAppOptions {
        $socket: Socket
    }
    interface Context {
        $socket: Socket
    }
}

declare module 'vuex/types/index' {
    interface Store<S> {
        $socket: Socket
    }
}

declare module 'socket.io-client' {
    interface Socket {
        $state: ChannelsState
    }
}

export default defineNuxtPlugin(({ app, store, redirect, $config }, inject) => {
    inject('socket', {})
})
