<template>
  <div ref="channelView" class="channel_view" style="animation-duration: 0.25s" @click="selectChannel()" :class="{ active : bSelected }">
    <div class="channel_view__avatar" :class="{'channel_controller_preload' : preload}">
      <img v-if="!preload" width="48px" height="48px" :src="logo" alt="">
      <svg v-if="target && target.online" class="fadeIn500ms" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="6" r="5" fill="#65CD97" stroke="#F2F3F7" stroke-width="2"/>
      </svg>
    </div>
    <div class="channel_view__content">
      <div class="channel_view__content__name" :class="{'channel_controller_preload' : preload}">
        <p v-if="!preload && target">{{target.fullName}}</p>
      </div>
      <div class="channel_view__content__message" :class="{'channel_controller_preload' : preload}">
        <p v-if="!typeUsers.length && !preload && messages.length">{{ lastMessageTxt }}</p>
        <p v-else-if="typeUsers.length && !preload && state" style="color: #2F80ED">Typing text ...</p>
      </div>
    </div>
    <div class="channel_view__info">
      <div class="channel_view__info__date" :class="{'channel_controller_preload' : preload}">
        {{ lastMessageDate }}
      </div>
      <div class="channel_view__info__unread" :class="{'channel_controller_preload' : preload, unread : unreadMessages}">
        <i v-if="unreadMessages">
          {{ unreadMessages }}
        </i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  toRefs,
  ref,
  useStore,
  computed,
  useContext,
  onUnmounted,
  onMounted, watch
} from '@nuxtjs/composition-api'
import {ChannelState, IMessage, ITextChannel} from '~/scripts/channel'
import { IUser } from '~/scripts/user'
import { DateTime } from "luxon";
import { ConvertByNumber } from '~/scripts/utils'
import {io} from "socket.io-client";

export default defineComponent({
  props: {
    state: {
      type: Object,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
    sid: {
      type: Number,
      default: -1,
    }
  },
  setup(props, { emit }) {
    const { $axios, $socket, store } = useContext()
    const { state, user, sid } = toRefs(props)
    const globalState = computed(() => $socket.$state)
    const searchState = computed(() => $socket.$state.search)
    const currentChannel = computed(() => globalState.value.selectedChannel)
    const bSelected = computed(() => state.value ? currentChannel.value === state.value : false)
    const author = computed(() => store.getters['auth/user'])
    const typeUsers = computed(() => state.value ? state.value.typeUsers : [] as Array<IUser>)
    const messages = computed(() => state.value ? state.value.channel.messages : [] as Array<IMessage>)
    const members = computed(() => state.value ? state.value.channel.members as Array<IUser> : [] as Array<IUser>)
    const unreadMessages = computed(() => {
      if(!messages.value.length) {
        return 0
      }
      let result = 0
      for (const message of messages.value) {
        if(message.author.uid === author.value.uid || message.read_state) {
          break
        }
        result++
      }
      return result
    })
    const lastMessageDate = computed(() => {
      if(!messages.value.length) {
        return ''
      }
      return DateTime.fromISO(messages.value[0].created_at).toLocal().toLocaleString({ hour: '2-digit', minute: '2-digit', hour12: false })
    })
    const lastMessageTxt = computed(() => {
      if(!messages.value.length) {
        return ''
      }
      const msg = messages.value[0] as IMessage;
      if(msg.message && msg.message.trim().length) {
        return msg.message
      }
      if(msg.assets.length) {
        return `${msg.assets.length} ${ConvertByNumber(msg.assets.length, ['вложение', 'вложения', 'вложений'])}`
      }
      return ''
    })
    const dataIdx = computed(() => members.value.findIndex(user => user.uid !== store.getters['auth/user'].uid))
    const preload = computed(() => !state.value && !user.value)
    const target = computed(() => {
      if(dataIdx.value !== -1 && state.value && (state.value as ChannelState).channel.type === 2) {
        return (state.value as ChannelState).channel.members[dataIdx.value]
      } else {
        return user.value
      }
    })
    const logo = computed(() => {
      if(target.value) {
        return  `${$axios.defaults.baseURL}storage/a/${target.value.avatar}`
      } else {
        return `${$axios.defaults.baseURL}storage/a/default.png`
      }
    })
    const online = computed(() => target.value ? (target.value as IUser).online : false)
    const fullName = computed(() => target.value ? target.value.fullName : 'User')
    const channelView = ref({} as HTMLDivElement)
    const parentElement = ref({} as HTMLDivElement)
    const visible = ref(false)

    const selectChannel = async () => {
      if(state.value) {
        $socket.$state.select(state.value as ChannelState)
      } else if(user.value && sid.value != -1) {
        const opts = {
          extraHeaders: {
            'Authorization' : `Bearer ${ store.state.auth.token }`
          }
        }
        const { data } = await $axios.get('api/channel/create/text', {
          params : {
            'members[0]' : (user.value as IUser).uid
          }
        })
        const channel_state = new ChannelState(
            data as ITextChannel,
            io(`${$axios.defaults.baseURL}text_channel_${data.id}`, opts), globalState.value)
        globalState.value.createThenSelect(channel_state)
        searchState.value.splice(sid.value, 1)
        searchState.value.unshift({
          channel: channel_state,
          user: undefined
        })
      }
    }

    const isVisible = () => {
      const scrollBot = parentElement.value.scrollTop + parentElement.value.offsetHeight
      const scrollOffset = channelView.value.offsetTop - scrollBot
      return scrollOffset < (channelView.value.offsetHeight * -0.5)
    }

    const onVisibleFrame = () => {
      visible.value = isVisible()
    }

    watch(visible, () => {
      if(visible.value) {
        parentElement.value.removeEventListener('scroll', onVisibleFrame)
        const gSLen = globalState.value.channels.length
        if(gSLen > 9 && state.value) {
          const state_t = (state.value as ChannelState)
          if(globalState.value.channels[gSLen - 1].channel.id === state_t.channel.id) {
            globalState.value.queryChannels(state_t.channel.message_at)
          }
        }
      }
    })

    onMounted(() => {
      parentElement.value = channelView.value.parentElement! as HTMLDivElement
      parentElement.value.addEventListener('scroll', onVisibleFrame)
      onVisibleFrame()
    })
    onUnmounted(() => {
      if(!visible.value) {
        parentElement.value.removeEventListener('scroll', onVisibleFrame)
      }
    })

    return {
      preload,
      logo,
      target,
      selectChannel,
      currentChannel,
      typeUsers,
      messages,
      unreadMessages,
      lastMessageDate,
      lastMessageTxt,
      bSelected,
      fullName,
      channelView,
      online
    }
  }
})
</script>
