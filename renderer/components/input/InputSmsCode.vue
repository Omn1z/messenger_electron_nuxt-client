<template>
  <div class="input__sms__code">
    <div v-for="idx in 6" class="box">
      {{ value.length >= idx ? value[idx - 1] : '' }}
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onUnmounted, computed} from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    value : {
      type: String,
      required: true
    },
  },
  setup (props, { emit }) {
    const inputValue = ref({} as HTMLDivElement)
    const keyDown = async (event: KeyboardEvent) => {
      if(props.value.length < 6) {
        if(event.key >= '0' && event.key <= '9') {
          emit('input', props.value + event.key)
        }
      }
      if(event.key === 'Backspace') {
        emit('input', props.value.slice(0, props.value.length - 1))
      }
    }
    onMounted(() => {
      window.addEventListener('keydown', keyDown)
    })
    onUnmounted(() => {
      window.removeEventListener('keydown', keyDown)
    })
    return { inputValue }
  }
})
</script>
