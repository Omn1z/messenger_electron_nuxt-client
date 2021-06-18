<template>
  <div
      :class="{ self : message.author_id === author.uid, fadeIn500ms: messageNeedRead }"
      ref="messageBlock" class="channel_message" style="animation-duration: 0.25s">
    <div class="channel_message__body">
      <img v-for="imgUrl in images" :src="imgUrl" @click="commitImage(imgUrl)" class="channel_message__body__image" alt="">
      <pre v-if="message.message" v-html="messageHtml"></pre>
      <FileView v-for="asset in assets" :asset="asset" :key="`${asset.id}-asset`"/>
    </div>
    <div class="channel_message__status">
      <p>{{ createdAt }}</p>
      <IconReadedMessage v-if="message.read_state && message.author_id === author.uid" />
      <IconUnreadedMessage v-else-if="message.author_id === author.uid" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  ref, watch,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
import { IUser } from '~/scripts/user'
import { IMessage, IAsset } from '~/scripts/channel'
import { DateTime } from 'luxon'
import IconReadedMessage from '~/components/logo/IconReadedMessage.vue'
import IconUnreadedMessage from '~/components/logo/IconUnreadedMessage.vue'
import FileView from "~/components/blocks/FileView.vue";

export default defineComponent({
  components: { FileView, IconReadedMessage, IconUnreadedMessage },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  setup(props, { emit }) {
    const { message } = toRefs(props)
    const { $axios, $socket, store } = useContext()
    const author = ref(store.getters['auth/user'] as IUser)
    const messageBlock = ref({} as HTMLDivElement)
    const parentElement = ref({} as HTMLDivElement)
    const messageNeedRead = ref(false)
    const msg = message.value as IMessage
    const images = ref([] as Array<string>)
    const createdAt = ref(DateTime.fromISO(msg.created_at).toLocal().toLocaleString({ hour: '2-digit', minute: '2-digit', hour12: false }))
    const $state = ref($socket.$state)
    const state = computed(() => $state.value.selectedChannel)
    const messages = computed(() => state.value!.channel.messages)
    const visible = ref(false)
    const assets = computed(() => (message.value as IMessage).assets.filter(asset => asset.type === 2 || asset.type === 3))
    const textConvertToCode = (text: string) => {
      return text.replace(/(https?:\/\/[^\s]+)/g,link => `<i onclick="$nuxt.context.$electron.openExternalUrl('${link}')">${link}</i>`)
    }
    const messageHtml = computed(() => {
      const msgTxt = (message.value as IMessage).message
      return textConvertToCode(msgTxt ? msgTxt : '')
    })

    if(!msg.read_state && msg.author_id !== author.value.uid) {
      messageNeedRead.value = true
    }

    for (const asset of  msg.assets) {
      if(asset.type === 1) {
        images.value.push(`${$axios.defaults.baseURL}${asset.url}`)
      }
    }

    const isVisible = () => {
      const scrollTop = parentElement.value.scrollTop
      const scrollOffset = messageBlock.value.offsetTop + messageBlock.value.offsetHeight - scrollTop
      const scrollBot = scrollTop + parentElement.value.scrollWidth
      const scrollBotOffset = scrollBot - messageBlock.value.offsetTop + messageBlock.value.offsetHeight * 0.5
      return scrollOffset > 0 && scrollBotOffset > 0
    }

    const onVisibleFrame = () => {
      visible.value = isVisible()
      if(visible.value) {
        parentElement.value.removeEventListener('scroll', onVisibleFrame)
      }
    }

    watch(visible, () => {
      if(visible.value) {
        if (messages.value.length) {
          const msg_t = message.value as IMessage
          if(messages.value[messages.value.length - 1].message_id === msg_t.message_id) {
            state.value!.queryMessages(msg_t.message_id)
          }
        }
        if (messageNeedRead.value) {
          $socket.$state.selectedChannel!.read(message.value as IMessage)
          messageNeedRead.value = false
        }
      }
    })


    onMounted(() => {
      parentElement.value = messageBlock.value.parentElement!.parentElement! as HTMLDivElement
      if(!visible.value) {
        parentElement.value.addEventListener('scroll', onVisibleFrame)
      }
      onVisibleFrame()
      if(msg === messages.value[0] && msg.author_id === author.value.uid) {
        parentElement.value.scrollTo(0, parentElement.value.scrollHeight)
      }
    })
    onUnmounted(() => {
      if(!visible.value) {
        parentElement.value.removeEventListener('scroll', onVisibleFrame)
      }
    })

    const commitImage = (url: string) => {
      store.commit('auth/SET_IMAGE_URL', url)
    }

    return {
      author,
      messageBlock,
      createdAt,
      images,
      assets,
      messageHtml,
      commitImage,
      messageNeedRead
    }
  }
})
</script>
