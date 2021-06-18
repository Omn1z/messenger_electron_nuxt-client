<template>
  <div class="container">
    <div ref="sceneBlock" class="scene__welcome">
      <div ref="sceneLogoBlock" class="scene__welcome__logo">
        <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9157 24.6899L13.9472 21.2177L26.2722 0.509846C26.8025 -0.381295 28.1274 -0.0345178 28.1838 1.01021L29.1059 18.0832C29.1251 18.4396 29.3153 18.7625 29.6126 18.9438L47.0211 29.5614C47.3363 29.7535 47.5295 30.1035 47.5295 30.4817V35.0199C47.5295 35.4037 47.7285 35.7579 48.0511 35.9481L67.4784 47.3985C68.1428 47.7899 68.1798 48.7662 67.5472 49.2104L52.554 59.7364C52.3151 59.9041 52.0194 59.9608 51.7385 59.8928L28.9751 54.3948C27.6407 54.0726 26.2749 53.9097 24.9043 53.9097H24.3608C22.196 53.9097 20.0558 54.383 18.0804 55.2986L16.2848 56.1309C15.4931 56.4977 14.6353 56.6875 13.7677 56.6875C11.5758 56.6875 9.54948 55.4822 8.44783 53.523L8.27048 53.2076C7.85633 52.4711 7.57577 51.6625 7.4426 50.8217L6.35552 43.9596C5.91242 41.1628 6.1384 38.2962 7.01371 35.6103C8.25684 31.7958 9.90064 28.1339 11.9157 24.6899ZM42.0741 36.4129L36.505 33.7257C36.3595 33.6556 36.2665 33.5045 36.2665 33.3385V29.8836C36.2665 29.4962 36.7251 29.3088 36.9813 29.5915L42.5504 35.7334C42.8616 36.0765 42.4863 36.6118 42.0741 36.4129Z" />
          <path d="M19.4237 58.1832C1.78039 66.0827 1.74863 45.3816 4.16851 32.4746C4.25244 32.027 3.71896 31.7879 3.48184 32.1723C-4.79858 45.5976 3.51065 67.3107 9.57128 65.3532C9.59486 65.3455 9.61897 65.3346 9.64071 65.3227C28.4035 54.8407 40.372 63.2675 46.9884 66.8314C47.3546 67.0286 47.6892 66.6286 47.4336 66.2934C42.3291 59.5979 29.7699 53.7428 19.4237 58.1832Z" />
          <path d="M42.2001 67.6421C32.13 59.3107 19.3592 62.7033 13.1351 65.9761C12.9252 66.0864 13.0486 66.3857 13.2791 66.3355C32.1678 62.221 33.6952 65.5898 42.0298 67.9913C42.2402 68.0517 42.3706 67.7831 42.2001 67.6421Z" />
        </svg>
      </div>
    </div>
    <div ref="contentContainer" class="home__page__container">
      <div class="home_page_content" style="width: 360px">
        <h2 style="text-align: center;">Fecurity Messenger</h2>
        <p style="text-align: center; padding: 0 16px; line-height: 24px; color: rgba(79, 94, 123, 0.8);">Добро пожаловать в Fecurity Messenger для ПК.
          Быстрый и безопасный официальный клиент</p>
        <div ref="contentContainer2" class="home_page_content__second">
          <button @click="startMessenger" class="btn flat sp action_btn uppercase">Начать общение</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, onUnmounted, ref, useContext, useRouter} from "@nuxtjs/composition-api";
export default defineComponent({
  middleware: 'unauthenticated',
  setup() {
    const router = useRouter()
    const sceneBlock = ref({} as HTMLDivElement)
    const sceneLogoBlock = ref({} as HTMLDivElement)
    const contentContainer = ref({} as HTMLDivElement)
    const contentContainer2 = ref({} as HTMLDivElement)

    const onAnimationEnd = (anim: AnimationEvent) => {
      if (anim.animationName == 'frameHideBlock') {
        router.push({ path: '/login' })
      }
    }

    const startMessenger = () => {
      sceneBlock.value.style['animation'] = '0.8s frameHideBlock forwards'
      sceneLogoBlock.value.style['animation'] = '0.8s moveLogoWhenSceneClosing forwards'
      contentContainer.value.style['animation'] = '1.2s home__page__container_hide forwards'
      contentContainer2.value.style['animation'] = '1.2s home__page__container_hide_second forwards'
    }

    onMounted(() => {
      sceneBlock.value.addEventListener('animationend', onAnimationEnd, false)
    })

    onUnmounted(() => {
      sceneBlock.value.removeEventListener('animationend', onAnimationEnd, false)
    })

    return {
      contentContainer,
      sceneBlock,
      sceneLogoBlock,
      startMessenger,
      contentContainer2 }
  }
})

</script>
