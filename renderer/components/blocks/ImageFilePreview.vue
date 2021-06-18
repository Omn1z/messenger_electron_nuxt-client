<template>
  <div class="channel_chat__files__image">
    <img :src="preview" alt="">
    <svg @click="callDeleteFile()" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" />
      <path d="M16.2855 7.71436L7.71411 16.2858" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M7.71411 7.71436L16.2855 16.2858" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, toRefs, useAsync,
} from '@nuxtjs/composition-api'
import { LoadFileWithReader } from "~/scripts/utils";

export default defineComponent({
  props: {
    file: {
      type: File,
      required: true,
    }
  },
  setup (props, { emit }) {
    const { file } = toRefs(props)
    const preview = useAsync(() => LoadFileWithReader(file.value))
    const callDeleteFile = () => {
      emit('exclude', file.value)
    }
    return {
      preview,
      callDeleteFile
    }
  }
})
</script>
