<template>
  <div class="container">
    <div ref="authStateBlock">
      <div @animationend="onProgressAnimationEnd" class="login_page__auth__progressbar__container" :class="{ 'fadeOutUp500ms' : bFinishProgress, 'fadeInDown500ms' : !bFinishProgress }">
        <div class="progressbar__line" :class="{ 'p-100' : nState === 1 || nState >= 5 }"></div>
        <div class="login_page__auth__progressbar__container__wrapper">
          <div :class="{'active' : nState < 5}" class="login_page__auth__progressbar__container__wrapper__step">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :fill="nState < 5 ? '#F2F3F7' : '#2F80ED'" d="M9.9973 12.6455C6.40313 12.6455 3.33313 13.2122 3.33313 15.4788C3.33313 17.7463 6.38396 18.333 9.9973 18.333C13.5915 18.333 16.6615 17.7672 16.6615 15.4997C16.6615 13.2322 13.6115 12.6455 9.9973 12.6455Z"/>
              <path :fill="nState < 5 ? '#F2F3F7' : '#2F80ED'" opacity="0.4" d="M9.99728 10.4864C12.4456 10.4864 14.4073 8.52388 14.4073 6.07638C14.4073 3.62888 12.4456 1.66638 9.99728 1.66638C7.54978 1.66638 5.58728 3.62888 5.58728 6.07638C5.58728 8.52388 7.54978 10.4864 9.99728 10.4864Z"/>
            </svg>
          </div>
          <div :class="{'active' : nState >= 5}" class="login_page__auth__progressbar__container__wrapper__step">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path :fill="nState >= 5 ? '#F2F3F7' : '#4F5E7B'" opacity="0.4" d="M10.0722 18.3333C9.96897 18.3333 9.86578 18.3096 9.77266 18.2614L6.77174 16.708C5.92021 16.2667 5.25409 15.7715 4.73394 15.1946C3.59549 13.9329 2.96208 12.3133 2.95202 10.6332L2.91678 5.10351C2.91259 4.46531 3.32451 3.89248 3.9403 3.67675L9.4505 1.75562C9.77769 1.63876 10.1426 1.63713 10.4757 1.7499L16.0069 3.60566C16.626 3.8124 17.0447 4.38114 17.048 5.01853L17.0832 10.5523C17.0941 12.2299 16.4826 13.8561 15.3617 15.1317C14.8474 15.7168 14.1872 16.2193 13.3441 16.6687L10.37 18.2573C10.2777 18.3071 10.1754 18.3325 10.0722 18.3333Z"/>
              <path :fill="nState >= 5 ? '#F2F3F7' : '#4F5E7B'" d="M9.43276 11.9341C9.27168 11.9349 9.11061 11.8769 8.98644 11.7576L7.38909 10.2213C7.14244 9.98272 7.13992 9.59539 7.38405 9.35515C7.62819 9.11408 8.02669 9.11163 8.27418 9.34942L9.42353 10.4542L12.2298 7.68733C12.4748 7.44626 12.8733 7.44381 13.1199 7.68161C13.3674 7.92022 13.3699 8.30837 13.1258 8.54779L9.87656 11.7519C9.75408 11.8728 9.59384 11.9333 9.43276 11.9341Z"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="login_page__auth__form" v-if="nState < 5">
        <svg @animationend="onSvgAnimationEnd" :class="animStates[nState].className.get('svg')" :style="{ 'animation-delay' : `${animStates[nState].delay.get('svg')}s` }" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="26" fill="#2F80ED" stroke="#F0F0F8" stroke-width="4"/>
          <path d="M27.9962 31.7347C22.9221 31.7347 18.588 32.5347 18.588 35.7347C18.588 38.9359 22.895 39.7642 27.9962 39.7642C33.0703 39.7642 37.4044 38.9653 37.4044 35.7642C37.4044 32.563 33.0985 31.7347 27.9962 31.7347Z" fill="#F2F3F7"/>
          <path opacity="0.4" d="M27.9961 28.6866C31.4526 28.6866 34.222 25.916 34.222 22.4607C34.222 19.0055 31.4526 16.2349 27.9961 16.2349C24.5409 16.2349 21.7703 19.0055 21.7703 22.4607C21.7703 25.916 24.5409 28.6866 27.9961 28.6866Z" fill="#F2F3F7"/>
        </svg>
        <div class="input_block_info">
          <h4 :class="animStates[nState].className.get('title')" :style="{ 'animation-delay' : `${animStates[nState].delay.get('title')}s` }">Введите номер телефона</h4>
          <p :class="animStates[nState].className.get('desc')" :style="{ 'animation-delay' : `${animStates[nState].delay.get('desc')}s` }">Мы создадим учетную запись, если у вас ее нет, просто введите свой номер телефона</p>
        </div>
        <div class="input_block" :class="animStates[nState].className.get('input')" :style="{ 'animation-delay' : `${animStates[nState].delay.get('input')}s` }">
          <p>Номер телефона</p>
          <InputPhoneNumber v-model="szPhoneNumber" @pressEnter="goNextAuthStep()"/>
          <p class="error" :class="{ 'fadeInUp500ms': haveError, 'fadeOutDown500ms': !haveError }">{{ errorMsg }}</p>
        </div>
        <button :disabled="haveError || !szPhoneNumber.length" @click="goNextAuthStep" class="btn flat" :class="animStates[nState].className.get('submit')" :style="{ 'animation-delay' : `${animStates[nState].delay.get('submit')}s` }">
          Продолжить
        </button>
      </div>
      <div class="login_page__auth__form" v-else style="height: 292px">
        <img @animationend="onImgAnimationEnd" :src="avatarUrl" width="48px" height="48px" :class="animStates[nState - 5].className.get('svg')" :style="{ 'animation-delay' : `${animStates[nState - 5].delay.get('svg')}s` }" alt="avatar">
        <div class="input_block_info">
          <h4 :class="animStates[nState - 5].className.get('title')" :style="{ 'animation-delay' : `${animStates[nState - 5].delay.get('title')}s` }">
            {{ displayName }}
          </h4>
          <p :class="animStates[nState - 5].className.get('desc')" :style="{ 'animation-delay' : `${animStates[nState - 5].delay.get('desc')}s` }">
            Пожалуйста введите код, который мы отправили вам на телефон
          </p>
        </div>
        <InputSmsCode v-model="szSmsCode" :class="animStates[nState - 5].className.get('input')" :style="{ 'animation-delay' : `${animStates[nState - 5].delay.get('input')}s` }" />
        <p @animationend="onInputAnimation" class="repeat__code" :class="animStates[nState - 5].className.get('submit')" :style="{ 'animation-delay' : `${animStates[nState - 5].delay.get('submit')}s` }">
          Отправить код повторно: <i :class="{'disabled' : timeForNewCode > 0}" class="link" @click="sendNewCode()">{{ displayTimer }}</i>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface IAuthRequest {
  signature: string
  url: string
  code: string
}
import {
  computed,
  watch,
  defineComponent,
  onUnmounted,
  ref,
  useContext,
  useRouter
} from '@nuxtjs/composition-api'
import InputPhoneNumber from '~/components/input/InputPhoneNumber.vue'
import InputSmsCode from '~/components/input/InputSmsCode.vue'
import { phoneRegion } from "~/scripts/utils"
import AnimState from "~/scripts/animations";

export default defineComponent({
  components: {
    InputPhoneNumber,
    InputSmsCode
  },
  middleware: 'unauthenticated',
  setup: function () {
    const {store, $axios} = useContext()
    const router = useRouter()
    const authStateBlock = ref({} as HTMLDivElement)
    const authDataBlock = ref({} as HTMLDivElement)
    const nState = ref(0)
    const szPhoneNumber = ref('')
    const authRequest = ref({} as IAuthRequest)
    const animStates = ref([] as Array<AnimState>)
    const errorMsg = ref('')
    const haveError = ref(false)
    const timeForNewCode = ref(60000)
    const timer = ref({} as NodeJS.Timeout)
    const registered = ref(false)
    const avatarUrl = ref('')
    const szSmsCode = ref('')
    const bDisableSendCode = ref(false)
    const bFinishProgress = ref(false)
    const displayName = ref('')

    animStates.value = AnimState.Default()

    const refreshTimer = () => {
      clearInterval(timer.value)
      timer.value = setInterval(() => {
        timeForNewCode.value -= 1000
      }, 1000)
    }

    const goNextAuthStep = async () => {
      const response = await store.dispatch('auth/send', {
        phone: szPhoneNumber.value
      })
      if (response.status === 201) {
        authRequest.value.signature = response.data.signature
        authRequest.value.url = response.data.url
        registered.value = response.data.user.registered
        avatarUrl.value = `${$axios.defaults.baseURL}storage/a/${response.data.user.avatar}`
        displayName.value = registered.value ? `Привет ${response.data.user.firstname}!` :  'Добро пожаловать!'
        nState.value = 1
        refreshTimer()
      } else {
        nState.value = nState.value === 3 ? 4 : 3
      }
    }

    const updateError = () => {
      if (szPhoneNumber.value.length) {
        if (phoneRegion(szPhoneNumber.value) === 0) {
          haveError.value = true
          errorMsg.value = 'Извините, не могу найти поддержку данного номера'
          return
        }
      }
      haveError.value = false
    }

    const handleCode = async () => {
      if(szSmsCode.value.length === 6) {
        const code = parseInt(szSmsCode.value)
        const response = await store.dispatch('auth/token', {
          url: authRequest.value.url,
          signature: authRequest.value.signature,
          code: code
        })
        if(response.status !== 200) {
          nState.value = nState.value === 8 ? 9 : 8
        } else{
          nState.value = 6
        }
      }
    }

    watch(szPhoneNumber, updateError)
    watch(szSmsCode, handleCode)

    onUnmounted(() => {
      clearInterval(timer.value)
    })


    const displayTimer = computed(() => {
      if(timeForNewCode.value > 0) {
        const seconds = Math.floor(timeForNewCode.value / 1000)
        const minutes = Math.floor(seconds / 60)
        const secondsPredicted = seconds - minutes * 60
        const mm = minutes > 9 ? minutes.toString() : '0' + minutes.toString()
        const ss = secondsPredicted > 9 ? secondsPredicted.toString() : '0' + secondsPredicted.toString()
        return `Отправить (${mm}:${ss})`
      } else {
        return 'Отправить'
      }
    })

    const sendNewCode = async () => {
      if(timeForNewCode.value <= 0) {
        refreshTimer()
        timeForNewCode.value = 90000
        const response = await store.dispatch('auth/send', {
          phone: szPhoneNumber.value
        })
        if (response.status === 201) {
          authRequest.value.signature = response.data.signature
          authRequest.value.url = response.data.url
        }
      }
    }

    const onSvgAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === 'fadeOutUp') {
        nState.value = 5
      }
    }

    const onImgAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === 'fadeOutUp') {
        bFinishProgress.value = true
      }
    }

    const onProgressAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === 'fadeOutUp') {
        router.push({ path: '/register' })
      }
    }

    const onInputAnimation = (event: AnimationEvent) => {
      if (event.animationName === 'headShake' || event.animationName === 'shakeX') {
        szSmsCode.value = ''
        nState.value = 7
      }
    }

    return {
      bFinishProgress,
      displayName,
      displayTimer,
      onSvgAnimationEnd,
      onInputAnimation,
      onImgAnimationEnd,
      onProgressAnimationEnd,
      errorMsg,
      haveError,
      nState,
      authStateBlock,
      authDataBlock,
      szPhoneNumber,
      goNextAuthStep,
      animStates,
      avatarUrl,
      szSmsCode,
      sendNewCode,
      bDisableSendCode,
      timeForNewCode
    }
  }
})

</script>
