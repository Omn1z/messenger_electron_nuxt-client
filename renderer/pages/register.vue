<template>
  <div class="container">
    <div
        @animationend="onAnimationPageEnd"
        class="registration__progress__container"
        :class="{ 'fadeInDown500ms' : registerState <= 2, 'fadeOutUp500ms' : registerState > 2 }"
        :style="{ 'animation-delay' : registerState > 2 ? '0.33s' : 0 }">
      <div class="progressbar__line" :class="{ 'p-100' : registerState >= 2, 'p-50' : registerState === 1 }"></div>
      <div class="registration__progress__container__wrapper">
        <div class="registration__progress__container__step" :class="{'active' : registerState === 0, 'passed' : registerState > 0}">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :fill="registerState === 0 ? '#F2F3F7' : '#2F80ED'" d="M9.9973 12.6455C6.40313 12.6455 3.33313 13.2122 3.33313 15.4788C3.33313 17.7463 6.38396 18.333 9.9973 18.333C13.5915 18.333 16.6615 17.7672 16.6615 15.4997C16.6615 13.2322 13.6115 12.6455 9.9973 12.6455Z" />
            <path :fill="registerState === 0 ? '#F2F3F7' : '#2F80ED'" opacity="0.4" d="M9.99728 10.4864C12.4456 10.4864 14.4073 8.52388 14.4073 6.07638C14.4073 3.62888 12.4456 1.66638 9.99728 1.66638C7.54978 1.66638 5.58728 3.62888 5.58728 6.07638C5.58728 8.52388 7.54978 10.4864 9.99728 10.4864Z" />
          </svg>
        </div>
        <div class="registration__progress__container__step" :class="{'active' : registerState === 1, 'passed' : registerState > 1}">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :fill="registerState === 0 ? '#4F5E7B' : registerState === 1 ? '#F2F3F7' : '#2F80ED'" opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M14.7804 5.03836C16.2032 6.13654 17.4146 7.74543 18.2845 9.75755C18.3496 9.91028 18.3496 10.0889 18.2845 10.2343C16.5447 14.2586 13.4471 16.6666 9.99996 16.6666H9.99183C6.5528 16.6666 3.45524 14.2586 1.71541 10.2343C1.65037 10.0889 1.65037 9.91028 1.71541 9.75755C3.45524 5.7325 6.5528 3.33331 9.99183 3.33331H9.99996C11.7235 3.33331 13.3577 3.93129 14.7804 5.03836ZM6.74791 10C6.74791 11.7778 8.2032 13.2242 9.99994 13.2242C11.7886 13.2242 13.2438 11.7778 13.2438 10C13.2438 8.21414 11.7886 6.76768 9.99994 6.76768C8.2032 6.76768 6.74791 8.21414 6.74791 10Z"/>
            <path :fill="registerState === 0 ? '#4F5E7B' : registerState === 1 ? '#F2F3F7' : '#2F80ED'" d="M12.0258 9.99738C12.0258 11.1044 11.1152 12.0095 10.0014 12.0095C8.87944 12.0095 7.96887 11.1044 7.96887 9.99738C7.96887 9.86 7.98513 9.73152 8.00952 9.60222H8.05017C8.95261 9.60222 9.68432 8.89111 9.71684 8.00142C9.80627 7.98606 9.90383 7.97717 10.0014 7.97717C11.1152 7.97717 12.0258 8.88222 12.0258 9.99738Z" />
          </svg>
        </div>
        <div class="registration__progress__container__step" :class="{'active' : registerState === 2, 'passed' : registerState > 2}">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path :fill="registerState === 2 ? '#F2F3F7' : '#4F5E7B'" fill-rule="evenodd" clip-rule="evenodd" d="M13.9249 8.39348C13.9249 8.80968 14.2583 9.14265 14.6749 9.14265C15.0916 9.14265 15.4333 8.80968 15.4333 8.39348C15.4333 7.97727 15.0916 7.63599 14.6749 7.63599C14.2583 7.63599 13.9249 7.97727 13.9249 8.39348ZM12.3083 13.4212C11.7167 14.0122 10.9 14.3785 10 14.3785C9.125 14.3785 8.30834 14.0372 7.68334 13.4212C7.06667 12.7969 6.725 11.9812 6.725 11.1071C6.71667 10.2414 7.05834 9.42566 7.675 8.80136C8.3 8.17705 9.125 7.83576 10 7.83576C10.875 7.83576 11.7 8.17705 12.3167 8.79303C12.9333 9.41734 13.275 10.2414 13.275 11.1071C13.2667 12.0145 12.9 12.8302 12.3083 13.4212ZM9.99998 9.08438C9.45832 9.08438 8.94998 9.29248 8.55832 9.68372C8.17498 10.0666 7.96665 10.5744 7.97498 11.0988V11.1071C7.97498 11.6482 8.18332 12.156 8.56665 12.5389C8.94998 12.9218 9.45832 13.1299 9.99998 13.1299C11.1167 13.1299 12.0167 12.2226 12.025 11.1071C12.025 10.5661 11.8167 10.0583 11.4333 9.67539C11.05 9.29248 10.5417 9.08438 9.99998 9.08438Z" />
            <path :fill="registerState === 2 ? '#F2F3F7' : '#4F5E7B'"  opacity="0.4" d="M14.5333 5.197L14.45 5.01387C14.225 4.5394 13.9666 3.99001 13.8083 3.6737C13.425 2.92453 12.7666 2.50832 11.9583 2.5H8.03329C7.22496 2.50832 6.57496 2.92453 6.19163 3.6737C6.02496 4.00666 5.74163 4.60599 5.50829 5.09711L5.45829 5.197C5.43329 5.2636 5.36663 5.29689 5.29996 5.29689C3.29163 5.29689 1.66663 6.92841 1.66663 8.92619V13.8707C1.66663 15.8685 3.29163 17.5 5.29996 17.5H14.7C16.7 17.5 18.3333 15.8685 18.3333 13.8707V8.92619C18.3333 6.92841 16.7 5.29689 14.7 5.29689C14.625 5.29689 14.5666 5.25527 14.5333 5.197Z" />
          </svg>
        </div>
      </div>
    </div>
    <div class="global__flex__center">
      <div ref="animForm" class="registration__form__name" v-if="registerState === 0" key="2">
        <svg @animationend="onAnimationStepEnd" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="26" fill="#2F80ED" stroke="#F0F0F8" stroke-width="4"/>
          <path d="M27.9961 31.7348C22.922 31.7348 18.5879 32.5348 18.5879 35.7348C18.5879 38.936 22.895 39.7642 27.9961 39.7642C33.0702 39.7642 37.4044 38.9654 37.4044 35.7642C37.4044 32.563 33.0985 31.7348 27.9961 31.7348Z" fill="#F2F3F7"/>
          <path opacity="0.4" d="M27.9961 28.6867C31.4526 28.6867 34.222 25.9161 34.222 22.4608C34.222 19.0055 31.4526 16.2349 27.9961 16.2349C24.5409 16.2349 21.7703 19.0055 21.7703 22.4608C21.7703 25.9161 24.5409 28.6867 27.9961 28.6867Z" fill="#F2F3F7"/>
        </svg>
        <div class="input_block_info">
          <h4>Имя и Фамилия</h4>
          <p>Пожалуйста заполните данные, для прохождения успешной регистрации.</p>
        </div>
        <div class="registration__input">
          <label for="name__input">Имя</label>
          <input @click='updateFirstNameValidation()' ref="firstnameInput" key="firstnameInputKey" v-model="firstname" :class="{'error' : !firstnameInputValid, 'success' : firstnameInputValid && firstname.length }" type="text" id="name__input" placeholder="Имя" required minlength="1">
        </div>
        <div class="registration__input">
          <label for="surname__input">Фамилия</label>
          <input :class="{'success' : surname.length }" type="text" id="surname__input" placeholder="Фамилия (Необязательно)" v-model="surname">
        </div>
        <button class="btn flat" @click="nextStep" :disabled="!firstnameInputValid || !firstname.length">
          Продолжить
        </button>
      </div>
      <div ref="animForm" class="registration__form__username" v-else-if="registerState === 1" key="1">
        <svg @animationend="onAnimationStepEnd" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="26" fill="#2F80ED" stroke="#F0F0F8" stroke-width="4"/>
          <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M34.7489 20.9953C36.7575 22.5457 38.4677 24.8171 39.6958 27.6577C39.7877 27.8733 39.7877 28.1255 39.6958 28.3308C37.2396 34.0121 32.8666 37.4117 28 37.4117H27.9885C23.1334 37.4117 18.7604 34.0121 16.3042 28.3308C16.2123 28.1255 16.2123 27.8733 16.3042 27.6577C18.7604 21.9753 23.1334 18.5882 27.9885 18.5882H28C30.4333 18.5882 32.7403 19.4324 34.7489 20.9953ZM23.4089 28C23.4089 30.5098 25.4634 32.5519 28 32.5519C30.5251 32.5519 32.5796 30.5098 32.5796 28C32.5796 25.4788 30.5251 23.4367 28 23.4367C25.4634 23.4367 23.4089 25.4788 23.4089 28Z" fill="#F2F3F7"/>
          <path d="M30.86 27.9963C30.86 29.5592 29.5745 30.8369 28.002 30.8369C26.4181 30.8369 25.1326 29.5592 25.1326 27.9963C25.1326 27.8023 25.1555 27.6209 25.19 27.4384H25.2473C26.5214 27.4384 27.5544 26.4345 27.6003 25.1785C27.7265 25.1568 27.8643 25.1442 28.002 25.1442C29.5745 25.1442 30.86 26.4219 30.86 27.9963Z" fill="#F2F3F7"/>
        </svg>
        <div class="input_block_info">
          <h4>Уникальный ID</h4>
          <p>Придумайте уникальный ID, для того что бы вас могли найти ваши Друзья</p>
        </div>
        <div class="registration__input">
          <label for="username_input">Придумайте ID</label>
          <input @click="updateUserNameValidation()" :class="{'error' : !usernameInputValid, 'success' : usernameInputValid && username.length }" v-model="username" type="text" id="username_input" placeholder="Username">
        </div>
        <button class="btn flat" @click="nextStep" :disabled="!usernameInputValid || !username.length">
          Продолжить
        </button>
      </div>
      <div ref="animForm" class="registration__form__avatar" v-else-if="registerState === 2" key="2">
        <svg @animationend="onAnimationStepEnd" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="28" cy="28" r="26" fill="#2F80ED" stroke="#F0F0F8" stroke-width="4"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M33.5412 25.7319C33.5412 26.3195 34.0118 26.7896 34.6 26.7896C35.1882 26.7896 35.6706 26.3195 35.6706 25.7319C35.6706 25.1444 35.1882 24.6625 34.6 24.6625C34.0118 24.6625 33.5412 25.1444 33.5412 25.7319ZM31.2589 32.8299C30.4236 33.6643 29.2707 34.1814 28.0001 34.1814C26.7648 34.1814 25.6119 33.6996 24.7295 32.8299C23.8589 31.9486 23.3766 30.7969 23.3766 29.563C23.3648 28.3408 23.8472 27.1891 24.7178 26.3078C25.6001 25.4264 26.7648 24.9446 28.0001 24.9446C29.2354 24.9446 30.4001 25.4264 31.2707 26.296C32.1413 27.1774 32.6236 28.3408 32.6236 29.563C32.6119 30.8439 32.0942 31.9956 31.2589 32.8299ZM28.0001 26.7073C27.2354 26.7073 26.5177 27.0011 25.9648 27.5534C25.4236 28.094 25.1295 28.8109 25.1413 29.5512V29.563C25.1413 30.3268 25.4354 31.0437 25.9766 31.5843C26.5177 32.1248 27.2354 32.4186 28.0001 32.4186C29.5766 32.4186 30.8471 31.1377 30.8589 29.563C30.8589 28.7991 30.5648 28.0823 30.0236 27.5417C29.4824 27.0011 28.7648 26.7073 28.0001 26.7073Z" fill="#F2F3F7"/>
          <path opacity="0.4" d="M34.4 21.2193L34.2823 20.9607C33.9647 20.2909 33.6 19.5153 33.3765 19.0687C32.8353 18.0111 31.9059 17.4235 30.7647 17.4117H25.2235C24.0823 17.4235 23.1647 18.0111 22.6235 19.0687C22.3882 19.5388 21.9882 20.3849 21.6588 21.0783L21.5882 21.2193C21.5529 21.3133 21.4588 21.3603 21.3647 21.3603C18.5294 21.3603 16.2353 23.6636 16.2353 26.484V33.4645C16.2353 36.2849 18.5294 38.5882 21.3647 38.5882H34.6353C37.4588 38.5882 39.7647 36.2849 39.7647 33.4645V26.484C39.7647 23.6636 37.4588 21.3603 34.6353 21.3603C34.5294 21.3603 34.4471 21.3015 34.4 21.2193Z" fill="#F2F3F7"/>
        </svg>
        <div class="input_block_info">
          <h4>Ваша фотография</h4>
          <p>Вы можете загрузить фотографию для вашего профиля</p>
        </div>
        <InputAvatar v-on:load="onAvatarInput" />
        <button class="btn flat" @click="nextStep">
          Завершить регистрацию
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {
  watch,
  defineComponent,
  ref,
  useContext,
  useRouter, useFetch
} from '@nuxtjs/composition-api'
import { LoadFileWithReader } from '../scripts/utils'
import InputAvatar from '~/components/input/InputAvatar.vue'

export default defineComponent({
  middleware: ['authenticated', 'unregistered'],
  components: { InputAvatar },
  setup: function () {
    const {$axios} = useContext()
    const router = useRouter()
    const registerState = ref(0)
    const animForm = ref({} as HTMLDivElement)
    const firstname = ref('')
    const surname = ref('')
    const username = ref('')
    const firstnameInput = ref({} as HTMLInputElement)
    const firstnameInputValid = ref(true)
    const usernameInputValid = ref(true)
    const avatarFile = ref(undefined as any)
    const onAvatarInput = (file: File) => avatarFile.value = file

    const onAnimationPageEnd = (event: AnimationEvent) => {
      if(event.animationName.includes('fadeOut')) {
        router.push({ path: '/main' })
      }
    }

    const onAnimationStepEnd = (event: AnimationEvent) => {
      if(event.animationName.includes('fadeOut')) {
        registerState.value++
      }
    }
    const updateFirstNameValidation = () => {
      firstnameInputValid.value = firstnameInput.value.checkValidity()
    }
    const isValidUsername = async (name: string) => {
      const result = name.length >= 5 && /^[a-zA-Z0-9_-]*$/.exec(name) !== null
      if(result) {
        const response = await $axios.get('api/user/username/valid', {
          params: {
            username: name
          }
        })
        if(response.status === 200) {
          return true
        }
      }
      return false
    }
    const updateUserNameValidation = async () => {
      usernameInputValid.value = await isValidUsername(username.value)
    }

    watch(firstname, updateFirstNameValidation)
    watch(username, updateUserNameValidation)
    watch(animForm, () => {
      if(animForm.value) {
        animForm.value.childNodes.forEach((child, index, arr) => {
          const childElem = child as HTMLElement
          if (index % 2 === 0) {
            const bLast = index + 1 >= arr.length
            const arrAnimations = ['fadeInDown500ms', 'fadeInUp500ms', 'fadeInLeft500ms', 'fadeInRight500ms']
            childElem.style.animationDelay = bLast ? `${index * 0.125}s` : `${index * 0.1}s`
            childElem.classList.add(bLast ? 'fadeInUp500ms' : arrAnimations[Math.floor(Math.random() * 1000) % arrAnimations.length])
          }
        })
      }
    })

    const nextAnimationStep = () => {
      animForm.value.childNodes.forEach((child, idx, arr) => {
        const childElem = child as HTMLElement
        const index = arr.length - idx - 1
        if (index % 2 === 0) {
          const bLast = !index
          const arrAnimations = ['fadeOutDown500ms', 'fadeOutUp500ms', 'fadeOutLeft500ms', 'fadeOutRight500ms']
          childElem.style.animationDelay = bLast ? `${index * 0.125}s` : `${index * 0.1}s`
          childElem.classList.add(bLast ? 'fadeOutDown500ms' : arrAnimations[Math.floor(Math.random() * 1000) % arrAnimations.length])
        }
      })
    }
    const nextStep = async (event: MouseEvent) => {
      if(registerState.value === 0) {
        if(!firstnameInputValid.value || !firstname.value.length)
          return

        nextAnimationStep()

        await $axios.get('api/user/name/change', {
          params: {
            firstname: firstname.value,
            surname: surname.value
          }
        })
      }
      else if(registerState.value === 1) {
        usernameInputValid.value = await isValidUsername(username.value)
        if(!usernameInputValid.value || !username.value.length)
          return

        nextAnimationStep()

        await $axios.get('api/user/username/change', {
          params: {
            username: username.value
          }
        })
      }
      else if(registerState.value === 2) {
        nextAnimationStep()
        if(avatarFile.value) {
          const formData = new FormData()
          formData.append('avatar', avatarFile.value! as string)
          await $axios.put('api/user/avatar/upload', formData)
        }
      }
      else {
        nextAnimationStep()
      }
    }

    return {
      registerState,
      animForm,
      nextStep,
      onAnimationStepEnd,
      onAnimationPageEnd,
      firstname,
      surname,
      username,
      avatarFile,
      firstnameInput,
      firstnameInputValid,
      usernameInputValid,
      updateFirstNameValidation,
      updateUserNameValidation,
      onAvatarInput
    }
  }
})

</script>
