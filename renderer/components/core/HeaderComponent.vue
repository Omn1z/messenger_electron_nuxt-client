<template>
  <div class="header">
    <div class="header__movable" style="-webkit-app-region: drag;" />
    <div class="header__controllers">
      <div @click="onMinimize" class="header__controllers__option">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="11" width="12" height="1.5" fill="#1B1A57"/>
        </svg>
      </div>
      <div v-if="!maximized" @click="onMaximize" class="header__controllers__option">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2.75" y="2.75" width="10.5" height="10.5" stroke-width="1.5"/>
        </svg>
      </div>
      <div v-else @click="onUnMaximize" class="header__controllers__option">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2.75" y="5.15002" width="8.1" height="8.1" stroke="#4F5E7B" stroke-width="1.5"/>
          <path d="M14 9.2V2H6.79999" stroke="#4F5E7B" stroke-width="1.5"/>
        </svg>
      </div>
      <div @click="closeApplication" class="header__controllers__option">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L4 12" stroke-width="1.5"/>
          <path d="M4 4L12 12" stroke-width="1.5"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  useContext,
  onBeforeMount, watch
} from '@nuxtjs/composition-api'

export default defineComponent({
  setup () {
    const { $electron, $cookies } = useContext()


    const maximized = ref(localStorage.getItem('is_window_maximized') || false)

    const onMinimize = (() => {
      $electron.emit('minimize')
    })

    const closeApplication = (() => {
      $electron.emit('close')
    })

    const onMaximize = (() => {
      $electron.emit('maximize')
    })

    const onUnMaximize = (() => {
      $electron.emit('unmaximize')
    })

    onBeforeMount(async () => {
      const response = await $electron.request('get_maximized')
      maximized.value = response[0]
    })

    onMounted(() => {
      $electron.on('update_window_information', (data: boolean) => {
        maximized.value = data
      })
    })

    watch(maximized, () => {
      localStorage.setItem('is_window_maximized', maximized.value)
    })

    return { maximized, onMinimize, onUnMaximize, onMaximize, closeApplication }
  }
})
</script>

<style scoped>

</style>
