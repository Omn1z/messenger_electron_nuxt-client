<template>
  <div class="avatar">
    <img v-if="avatarBase64.length" :src="avatarBase64" alt="">
    <svg v-else @click="openFileDialog" width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="52" cy="52" r="48" fill="#2F80ED" fill-opacity="0.15"/>
      <circle cx="52" cy="52" r="50" stroke="#F0F0F8" stroke-opacity="0.5" stroke-width="4"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M57.495 49.7509C57.495 50.3335 57.9617 50.7997 58.545 50.7997C59.1283 50.7997 59.6067 50.3335 59.6067 49.7509C59.6067 49.1682 59.1283 48.6904 58.545 48.6904C57.9617 48.6904 57.495 49.1682 57.495 49.7509ZM55.2317 56.7897C54.4033 57.6171 53.26 58.1299 52 58.1299C50.775 58.1299 49.6317 57.6521 48.7567 56.7897C47.8933 55.9157 47.415 54.7736 47.415 53.55C47.4033 52.338 47.8817 51.1959 48.745 50.3219C49.62 49.4479 50.775 48.9701 52 48.9701C53.225 48.9701 54.38 49.4479 55.2433 50.3102C56.1067 51.1843 56.585 52.338 56.585 53.55C56.5733 54.8202 56.06 55.9623 55.2317 56.7897ZM52 50.7181C51.2417 50.7181 50.53 51.0095 49.9817 51.5572C49.445 52.0933 49.1533 52.8041 49.165 53.5383V53.55C49.165 54.3075 49.4567 55.0183 49.9933 55.5544C50.53 56.0905 51.2417 56.3818 52 56.3818C53.5633 56.3818 54.8233 55.1116 54.835 53.55C54.835 52.7925 54.5433 52.0816 54.0067 51.5455C53.47 51.0095 52.7583 50.7181 52 50.7181Z" fill="#2F80ED"/>
      <path opacity="0.4" d="M58.3467 45.2758L58.23 45.0194C57.915 44.3552 57.5533 43.586 57.3317 43.1432C56.795 42.0943 55.8733 41.5117 54.7417 41.5H49.2467C48.115 41.5117 47.205 42.0943 46.6683 43.1432C46.435 43.6093 46.0383 44.4484 45.7117 45.136L45.6417 45.2758C45.6067 45.369 45.5133 45.4156 45.42 45.4156C42.6083 45.4156 40.3333 47.6998 40.3333 50.4967V57.419C40.3333 60.2159 42.6083 62.5 45.42 62.5H58.58C61.38 62.5 63.6667 60.2159 63.6667 57.419V50.4967C63.6667 47.6998 61.38 45.4156 58.58 45.4156C58.475 45.4156 58.3933 45.3574 58.3467 45.2758Z" fill="#2F80ED"/>
    </svg>
    <div v-if="avatarBase64.length" class="container">
      <div class="icon" @click="openFileDialog">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5337 9.37607C19.3754 9.71107 19.6329 10.8777 19.9771 11.2527C20.3212 11.6277 20.8137 11.7552 21.0862 11.7552C22.5346 11.7552 23.7087 12.9294 23.7087 14.3769V19.2061C23.7087 21.1477 22.1337 22.7227 20.1921 22.7227H11.8087C9.86622 22.7227 8.29205 21.1477 8.29205 19.2061V14.3769C8.29205 12.9294 9.46622 11.7552 10.9146 11.7552C11.1862 11.7552 11.6787 11.6277 12.0237 11.2527C12.3679 10.8777 12.6246 9.71107 13.4662 9.37607C14.3087 9.04107 17.6921 9.04107 18.5337 9.37607Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20.5798 13.9167H20.5873" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M18.6493 16.94C18.6493 15.4767 17.4635 14.2908 16.0002 14.2908C14.5368 14.2908 13.351 15.4767 13.351 16.94C13.351 18.4033 14.5368 19.5892 16.0002 19.5892C17.4635 19.5892 18.6493 18.4033 18.6493 16.94Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, watch, ref, onMounted, onUnmounted, useAsync, toRefs} from '@nuxtjs/composition-api'
import { LoadFileWithReader } from '~/scripts/utils'

export default defineComponent({
  props: {
    url: {
      type: String,
      default: ''
    },
    refresh : {
      type: Boolean,
      default: false
    },
  },
  setup (props, { emit }) {
    const { url, refresh } = toRefs(props)
    const fileInput = ref({} as HTMLInputElement)
    const avatarBase64 = ref(url.value)

    watch(url, () => avatarBase64.value = url.value)
    watch(refresh, () => {
      if(refresh.value) {
        avatarBase64.value = url.value
      }
    })

    const openFileDialog = () => {
      fileInput.value.click()
    }

    const onFileChange = async () => {
      if(fileInput.value.files && fileInput.value.files[0]) {
        avatarBase64.value = await LoadFileWithReader(fileInput.value.files[0]) as string
        emit('load', fileInput.value.files[0])
      } else {
        avatarBase64.value = url.value
        emit('load', null)
      }
    }

    onMounted(() => {
      const inputElement = document.createElement('input') as HTMLInputElement
      inputElement.type='file'
      inputElement.accept='.jpg, .jpeg, .png, .gif'
      inputElement.onchange = onFileChange
      fileInput.value = inputElement
    })
    onUnmounted(() => {
      fileInput.value.remove()
    })
    return { fileInput, avatarBase64, openFileDialog }
  }
})
</script>
