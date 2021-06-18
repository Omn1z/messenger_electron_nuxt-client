<template>
  <div class="channel_chat__files__file" style="align-self: stretch;">
    <div class="icon" @click="downloadAsset()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1222 15.4361L12.1222 3.39514" stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15.0382 12.5084L12.1222 15.4364L9.20621 12.5084" stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.7549 8.12805H17.6879C19.7229 8.12805 21.3719 9.77705 21.3719 11.8131V16.6971C21.3719 18.7271 19.7269 20.3721 17.6969 20.3721L6.55695 20.3721C4.52195 20.3721 2.87195 18.7221 2.87195 16.6871V11.8021C2.87195 9.77305 4.51795 8.12805 6.54695 8.12805L7.48895 8.12805" stroke="#FAFAFA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="data">
      <p class="name">{{ assetJSON.clientName }}</p>
      <p class="size">{{ printSize }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, toRefs, useAsync, useStore,
} from '@nuxtjs/composition-api'
import { IAsset } from "~/scripts/channel";

export default defineComponent({
  props: {
    asset: {
      type: Object,
      required: true,
    }
  },
  setup (props, { emit }) {
    const { asset } = toRefs(props)
    const { $electron, $axios } = useStore()
    const assetJSON = computed(() => JSON.parse((asset.value as IAsset).data))
    const downloadAsset = () => {
      $electron.openExternalUrl(`${$axios.defaults.baseURL}${(asset.value as IAsset).url}`)
    }
    const printSize = computed(() => {
      const bytes = assetJSON.value.size | 0;
      const kb = bytes / 1024
      const mb = kb / 1024
      if(mb > 1) {
        return `${mb.toFixed(2)} Мбайт`
      } else if(kb > 1) {
        return `${kb.toFixed(2)} Кбайт`
      } else {
        return `${bytes} байт`
      }
    })
    return {
      assetJSON,
      printSize,
      downloadAsset
    }
  }
})
</script>
