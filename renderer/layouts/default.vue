<template>
  <div>
    <HeaderComponent/>
    <Nuxt class="header__padding" :class="{ hide: !startApp }" />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  onBeforeMount,
  onMounted,
  onUnmounted,
  ref,
  useAsync,
  useContext
} from '@nuxtjs/composition-api'
import HeaderComponent from '~/components/core/HeaderComponent.vue'
export default defineComponent({
  components: { HeaderComponent },
  setup () {
    const { $electron, isDev } = useContext()
    const startApp = ref(false)

    const mouseUpController = (e: MouseEvent) => {
      if (!isDev && e.button === 3 || e.button === 4)
        e.preventDefault();
    }

    onBeforeMount(() => {
      $electron.window = window
      window.addEventListener('mouseup', mouseUpController)
    })
    onMounted(() => {
      startApp.value = true
    })
    onUnmounted(() => {
      window.removeEventListener('mouseup', mouseUpController)
    })
    return { startApp }
  }
})
</script>
