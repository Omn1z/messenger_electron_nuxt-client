<template>
  <div ref="overlay" class="overlay" :class="{ out : hiddenInv }">
    <slot :closeOverlay="onOverlay"></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, watch, computed, onUnmounted} from '@nuxtjs/composition-api'

export default defineComponent({
  setup (_, { emit }) {
    const overlay = ref({} as HTMLDivElement)
    const child = computed(() => overlay.value.firstChild as HTMLElement)
    const hiddenInv = ref(false)
    const hooked = ref(false)
    const hooked2 = ref(false)
    const setupAnimations = (fadeIn: boolean) => {
      hiddenInv.value = !fadeIn
      child.value.classList.toggle('fadeInLeft500ms', fadeIn)
      child.value.classList.toggle('fadeOutRight500ms', !fadeIn)
      child.value.style.animationDuration = '0.2s'
    }
    const onClick2 = (event: MouseEvent) => {
      if(event.target === overlay.value) {
        setupAnimations(false)
        overlay.value.removeEventListener('mousedown', onClick)
        hooked2.value = false
      }
      overlay.value.removeEventListener('mouseup', onClick2)
      hooked2.value = false
    }
    const onClick = (event: MouseEvent) => {
      if(event.target === overlay.value) {
        if(!hooked2.value) {
          overlay.value.addEventListener('mouseup', onClick2)
          hooked2.value = true
        }
      }
    }
    const onOverlay = () => {
      if(!hiddenInv.value) {
        setupAnimations(false)
        if(hooked.value) {
          overlay.value.removeEventListener('mousedown', onClick)
          hooked.value = false
        }
        if(hooked2.value) {
          overlay.value.removeEventListener('mouseup', onClick2)
          hooked2.value = false
        }
      }
    }
    const animationEnd = (event: AnimationEvent) => {
      if(event.animationName.includes('fadeIn')) {
        if(!hooked.value) {
          overlay.value.addEventListener('mousedown', onClick)
          hooked.value = true
        }
      } else if (event.animationName.includes('fadeOut')) {
        emit('overlay')
      }
    }
    watch(child, () => {
      setupAnimations(true)
      child.value.addEventListener('animationend', animationEnd)
    })
    return { onClick, onClick2, overlay, hiddenInv, onOverlay }
  }
})
</script>
