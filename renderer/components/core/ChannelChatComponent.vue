<template>
  <div class="channel_chat">
    <div ref="messageList" class="channel_chat__body scroll-sm">
      <div class="channel_chat__body__message__list">
        <div class="typing" v-if="typeUsers.length">
          <p><span v-for="(typeUser, idx) in typeUsers">{{ idx === 0 ? typeUser.fullName : `, ${typeUser.fullName}` }}</span></p>
          <p>Typing text ...</p>
        </div>
        <ChannelMessage v-if="state" v-for="message in messages" :message="message" :key="message.message_id"/>
      </div>
    </div>
    <div class="channel_chat__sender">
      <div class="channel_chat__files">
        <div v-if="images.length" class="channel_chat__files__line">
          <ImageFilePreview v-for="(image, idx) in images" :file="image" v-on:exclude="excludeFile" :key="`${idx}-image-preview`"/>
        </div>
        <div v-for="(file, idx) in otherFiles" class="channel_chat__files__line" :key="`${idx}-file-preview`">
          <FilePreview :file="file" v-on:exclude="excludeFile"/>
        </div>
      </div>
      <div class="channel_chat__sender__input">
        <IconInputFile ref="iconInput" class="icon__input__files" @click="inputFiles"/>
        <InputTextMessage v-model="textMessage" @send="sendMessage"/>
        <IconSendMessage ref="iconSendMessage"/>
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
  onMounted,
  onUnmounted, onBeforeUpdate, watch
} from '@nuxtjs/composition-api'
import { ChannelState, IMessage } from '~/scripts/channel'
import { IUser } from '~/scripts/user'
import ChannelMessage from '~/components/core/ChannelMessage.vue'
import InputTextMessage from '~/components/input/InputTextMessage.vue'
import IconInputFile from '~/components/logo/IconInputFile.vue'
import IconSendMessage from '~/components/logo/IconSendMessage.vue'
import ImageFilePreview from '~/components/blocks/ImageFilePreview.vue'
import FilePreview from '~/components/blocks/FilePreview.vue'

export default defineComponent({
  components: {
    ChannelMessage,
    InputTextMessage,
    IconInputFile,
    IconSendMessage,
    ImageFilePreview,
    FilePreview
  },
  setup() {
    const { $socket, $axios, store } = useContext()
    const textMessage = ref('')
    const $state = ref($socket.$state)
    const state = computed(() => $state.value.selectedChannel)
    const messages = computed(() => state.value ? state.value.channel.messages : [] as Array<IMessage>)
    const typeUsers = computed(() => state.value ? state.value.typeUsers : [] as Array<IUser>)
    const iconInput = ref({})
    const iconSendMessage = ref({})
    const files = ref([] as Array<File>)
    const images = computed(() => {
      return files.value.filter(file => {
        return file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif' ||
            file.type === 'image/png'
      })
    })
    const otherFiles = computed(() => {
      return files.value.filter(file => {
        return !(file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif' ||
            file.type === 'image/png')
      })
    })
    const messageList = ref({} as HTMLDivElement)
    const author = ref(store.getters['auth/user'])
    const excludeFile = (file: File) => {
      files.value.splice(files.value.indexOf(file), 1)
    }
    const inputFiles = () => {
      const inputElement = document.createElement('input')
      inputElement.type = 'file'
      inputElement.setAttribute('multiple', '')
      inputElement.oninput = (event: any) => {
        for (const file of event.path[0].files) {
          if(files.value.length < 8) {
            files.value.push(file)
          }
        }
      }
      inputElement.click()
    }
    const sendMessage = async () => {
      if(textMessage.value === '' && files.value.length < 1) {
        return
      }
      let imagesCount = 0
      let mediaCount = 0
      let filesCount = 0
      const form = new FormData()
      form.set('message', textMessage.value)
      for (const file of files.value) {
        if(file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/gif' ||
            file.type === 'image/png') {
          form.set(`images[${imagesCount}]`, file)
          imagesCount++
        } else if(file.type.includes('mp4') ||
            file.type.includes('mp3') ||
            file.type.includes('ogg') ||
            file.type.includes('flac') ||
            file.type.includes('aac') ||
            file.type.includes('alac')) {
          form.set(`media[${mediaCount}]`, file)
          mediaCount++
        }
        else {
          form.set(`files[${filesCount}]`, file)
          filesCount++
        }
      }
      files.value = [];
      textMessage.value = ''
      await $axios.put(`api/channel/${state.value!.channel.id}/message/create`, form)
    }
    const updateScroll = () => {
      if(state.value && state.value.scrollTop) {
        messageList.value.scrollTo(0, state.value.scrollTop + 5000)
      }
    }

    watch(state, updateScroll)
    watch(state, (newValue, prevValue) => {
      if(prevValue) {
        prevValue.changeType(false)
      }
    })

    const onScroll = () => {
      if(state.value) {
        state.value.scrollTop = messageList.value.scrollTop
      }
    }

    onMounted(() => {
      const iconInputComponent: any = iconInput.value
      const iconInputElement: HTMLElement = iconInputComponent.$el
      const iconSendComponent: any = iconSendMessage.value
      const iconSendElement: HTMLElement = iconSendComponent.$el
      iconInputElement.onclick = inputFiles
      iconSendElement.onclick = sendMessage
      messageList.value.addEventListener('scroll', onScroll)
      messageList.value.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
    })
    onUnmounted(() => {
      messageList.value.removeEventListener('scroll', onScroll)
    })

    return {
      iconInput,
      iconSendMessage,
      state,
      $state,
      textMessage,
      sendMessage,
      inputFiles,
      author,
      messageList,
      messages,
      typeUsers,
      images,
      excludeFile,
      otherFiles
    }
  }
})
</script>
