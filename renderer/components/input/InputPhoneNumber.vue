<template>
  <div ref="object" :class="{ error: szValue.length > 1 && phoneRegionIcon === 0, success: phoneRegionIcon !== 0, 'active': active }" class="input__phone__number" tabindex="0" @click="setActive" @keydown="keyDown">
    <IconWarning v-if="phoneRegionIcon === 0" />
    <IconFlagRussia v-else-if="phoneRegionIcon === 1" />
    <IconFlagUkraine v-else-if="phoneRegionIcon === 2" />
    <IconFlagBelarus v-else-if="phoneRegionIcon === 3" />
    <div ref="inputValue" class="input__text">
      {{ szValue }}
    </div>
    <div v-if="separatorEnabled" class="separator">|</div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted, onUnmounted, computed} from '@nuxtjs/composition-api'
import { phoneRegion } from '~/scripts/utils'
import IconFlagRussia from '~/components/logo/IconFlagRussia.vue'
import IconFlagUkraine from '~/components/logo/IconFlagUkraine.vue'
import IconFlagBelarus from '~/components/logo/IconFlagBelarus.vue'
import IconWarning from '~/components/logo/IconWarning.vue'

export default defineComponent({
  components: {
    IconFlagRussia,
    IconFlagUkraine,
    IconFlagBelarus,
    IconWarning
  },
  props: {
    value : {
      type: String,
      required: true
    },
  },
  setup (props, { emit }) {
    const szValue = ref(props.value)
    const object = ref({} as HTMLDivElement)
    const inputValue = ref({} as HTMLDivElement)
    const timer = ref({} as Nodejs.Timeout)
    const active = ref(false)
    const separatorEnabled = ref(true)
    const setupTimer = () => {
      separatorEnabled.value = true
      clearInterval(timer.value)
      timer.value = setInterval(() => {
        separatorEnabled.value = !separatorEnabled.value
      }, 500)
    }
    const keyDown = async (event: KeyboardEvent) => {
      setupTimer()

      if(event.key === 'Enter') {
        emit('pressEnter')
      }
      else if(((event.key >= '0' && event.key <= '9')) || event.key === '+') {
        const selection = window.getSelection()!
        if(selection.type === 'Range' && selection.extentNode.parentNode === inputValue.value) {
          const offset = selection.extentNode.nodeValue.indexOf(szValue.value)
          const start = Math.max(Math.min(selection.extentOffset, selection.baseOffset) - offset, 1)
          const size = Math.max(selection.extentOffset, selection.baseOffset) - offset - start
          szValue.value =
              event.key === '+' ? szValue.value.slice(0, start) + szValue.value.slice(start + size) :
                  szValue.value.slice(0, start) + event.key + szValue.value.slice(start + size)
          selection.empty()
        }
        else if(event.key !== '+' || szValue.value === '') {
          if(event.key !== '+' && szValue.value === '') {
            szValue.value = '+'
          }
          szValue.value += event.key
        }
        emit('input', szValue.value)
      }
      else if (event.key === 'Backspace') {
        const selection = window.getSelection()
        if(selection.type === 'Range' && selection.extentNode.parentNode === inputValue.value) {
          const offset = selection.extentNode.nodeValue.indexOf(szValue.value)
          const start = Math.min(selection.extentOffset, selection.baseOffset) - offset
          const size = Math.max(selection.extentOffset, selection.baseOffset) - offset - start
          szValue.value = szValue.value.slice(0, start) + szValue.value.slice(start + size)
          window.getSelection().empty()
        } else {
          szValue.value = szValue.value.slice(0, szValue.value.length - 1)
        }
        emit('input', szValue.value)
      }
      else if(event.ctrlKey && (event.key === 'V' || event.key === 'v')) {
        let clipboardText = await navigator.clipboard.readText() as string
        clipboardText = clipboardText.trim()
        clipboardText = clipboardText[0] === '+' ? clipboardText.split('+')[1] : clipboardText
        if(/^[0-9]*$/.exec(clipboardText)) {
          const selection = window.getSelection()
          if(selection.type === 'Range' && selection.extentNode.parentNode === inputValue.value) {
            const offset = selection.extentNode.nodeValue.indexOf(szValue.value)
            const start = Math.max(Math.min(selection.extentOffset, selection.baseOffset) - offset, 1)
            const size = Math.max(selection.extentOffset, selection.baseOffset) - offset - start
            szValue.value = szValue.value.slice(0, start) + clipboardText + szValue.value.slice(start + size)
            window.getSelection().empty()
          } else {
            if(szValue.value === '') {
              szValue.value = '+'
            }
            szValue.value += clipboardText
          }
        }
      }
    }
    const setActive = () => {
      active.value = true
      setupTimer()
    }
    const setUnActive = (event: MouseEvent) => {
      if(!event.path.includes(object.value)) {
        active.value = false
        clearInterval(timer.value)
        separatorEnabled.value = false
      }
    }
    const phoneRegionIcon = computed(() => {
      return phoneRegion(szValue.value)
    })
    onMounted(() => {
      window.addEventListener('click', setUnActive)
    })
    onUnmounted(() => {
      window.removeEventListener('click', setUnActive)
      clearInterval(timer.value)
    })
    return { active, object, inputValue, setActive, keyDown, szValue, phoneRegionIcon, separatorEnabled }
  }
})
</script>
