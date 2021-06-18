<template>
  <OverlayController v-if="imgSrc.length" v-on:overlay="overlay" key="overlay_image_viewer">
    <template #default="{ closeOverlay }">
      <img
          :style="{
              'max-width' : `${innerWidth * 0.85}px`,
              'max-height' : `${innerHeight * 0.8 - 20}px`
           }"
          :src="imgSrc"
          class="image_viewer"
          alt=""
          @dragstart="$event.preventDefault()"
      />
    </template>
  </OverlayController>
</template>

<script lang="ts">
import { defineComponent, useStore, computed } from '@nuxtjs/composition-api'
import OverlayController from '~/components/core/OverlayController.vue'

export default defineComponent({
  components: { OverlayController },
  setup () {
    const store = useStore()
    const innerHeight = computed(() => window.innerHeight)
    const innerWidth = computed(() => window.innerWidth)
    const imgSrc = computed(() => store.getters['auth/imgSrc'])
    const overlay = () => { store.commit('auth/SET_IMAGE_URL', '') }
    return {
      imgSrc,
      overlay,
      innerHeight,
      innerWidth
    }
  }
})
</script>
