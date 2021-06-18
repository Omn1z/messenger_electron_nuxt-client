<template>
  <OverlayController v-if="display" v-on:overlay="overlay">
    <template #default="{ closeOverlay }">
      <div class="setting__controller">
        <div class="setting__controller__title">
          <p>Настройки</p>
          <svg @click="closeOverlay()" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="#FF6767" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="#FF6767" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <InputAvatar v-on:load="inputAvatar" :url="avatar" :refresh="avatarRefresh"/>
        <div class="setting__controller__row">
          <div class="setting__controller__input">
            <label for="firstname__input">Имя</label>
            <input type="text" id="firstname__input" v-model="firstNameInput">
          </div>
          <div class="setting__controller__input">
            <label for="surname__input">Имя</label>
            <input type="text" id="surname__input" v-model="surnameInput">
          </div>
        </div>
        <div class="setting__controller__input">
          <label for="username__input">ID Пользователя</label>
          <input type="text" id="username__input" v-model="usernameInput">
        </div>
        <button class="btn flat full" :disabled="btnDisabled" @click="updateData()">Сохранить</button>
      </div>
    </template>
  </OverlayController>
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useStore, computed, watch } from '@nuxtjs/composition-api'
import OverlayController from '~/components/core/OverlayController.vue'
import InputAvatar from '~/components/input/InputAvatar.vue'

export default defineComponent({
  components: { OverlayController, InputAvatar },
  setup (_, { emit }) {
    const { $axios } = useContext()
    const store = useStore()
    const display = computed(() => store.getters['auth/setting'])
    const user = computed(() => store.getters['auth/user'])
    const avatar = computed(() => `${$axios.defaults.baseURL}storage/a/${user.value.avatar}`)
    const avatarRefresh = ref(false)
    const firstNameInput = ref(user.value.firstname)
    const surnameInput = ref(user.value.surname)
    const usernameInput = ref(user.value.username)
    const usernameInputValid = ref(true)

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

    watch(usernameInput, async () => {
      usernameInputValid.value = false
      usernameInputValid.value = await isValidUsername(usernameInput.value)
    })


    const btnDisabled = computed(() => {
      return (firstNameInput.value === user.value.firstname &&
          surnameInput.value === user.value.surname &&
          usernameInput.value === user.value.username) ||
          !usernameInputValid.value
    })

    const updateData = async () => {
      const promises = [] as Promise<any>[]
      if (usernameInput.value !== user.value.username) {
        promises.push($axios.get('api/user/username/change', {
          params: {
            username: usernameInput.value
          }
        }))
      }
      if (firstNameInput.value !== user.value.firstname ||
          surnameInput.value !== user.value.surname) {
        promises.push($axios.get('api/user/name/change', {
          params: {
            firstname: firstNameInput.value,
            surname: surnameInput.value
          }
        }))
      }
      await Promise.all(promises)
    }
    const overlay = () => { store.commit('auth/SET_SETTINGS', false) }
    const inputAvatar = async (file?: string) => {
      if(file) {
        avatarRefresh.value = false
        const formData = new FormData()
        formData.append('avatar', file as string)
        const response = await $axios.put('api/user/avatar/upload', formData)
        if(response.status !== 202) {
          avatarRefresh.value = true
        }
      }
    }
    return {
      user,
      avatarRefresh,
      avatar,
      display,
      overlay,
      inputAvatar,
      btnDisabled,
      firstNameInput,
      surnameInput,
      usernameInput,
      updateData
    }
  }
})
</script>
