<template>
  <div class="channel_chat__input__text">
    <textarea ref="textArea" rows="1" style="height:1em;" @input="inputText" @keydown="onKeyDown" placeholder="Напишите сообщение..."/>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  toRefs,
  watch,
  useContext
} from '@nuxtjs/composition-api'
export default defineComponent({
  props: {
    value : {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    const { $socket } = useContext()
    const { value } = toRefs(props)
    const textArea = ref({} as HTMLTextAreaElement)
    const $state = ref($socket.$state)
    const state = computed(() => $state.value.selectedChannel)

    watch(value, () => {
      textArea.value.value = value.value
    })

    const resize = () => {
      textArea.value.style.height = 'auto'
      textArea.value.style.height = `${textArea.value.scrollHeight}px`
    }

    const inputText = () => {
      resize()
      emit('input', textArea.value.value)
    }

    const addToArea = (str: string) => {
      const start = textArea.value.selectionStart
      const end = textArea.value.selectionEnd
      const value = textArea.value.value
      textArea.value.value = value.slice(0, start) + str + value.slice(end)
      textArea.value.selectionStart = textArea.value.selectionEnd = start + 1
      inputText()
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if(event.key === 'Tab') {
        event.preventDefault()
        addToArea('\t')
      }
      else if(event.key === 'Enter') {
        if(event.ctrlKey) {
          event.preventDefault()
          addToArea('\n')
        } else if (!event.shiftKey) {
          event.preventDefault()
          emit('send')
        }
      }
    }


    onMounted(resize)
    onMounted(() => {
      textArea.value.addEventListener("focusin", () => state.value!.changeType(true));
      textArea.value.addEventListener("focusout", () => state.value!.changeType(false));
    })

    return { inputText, textArea, onKeyDown }
  }
})
</script>