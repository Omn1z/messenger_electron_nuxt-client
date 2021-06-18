<template>
  <div class="channel_controller">
    <div class="channel_controller__header" :class="{ controlling: settingsState }">
      <div class="channel_controller__header__avatar" :class="{'channel_controller_preload' : preload}">
        <img v-if="!preload" width="48px" height="48px" :src="avatar" alt="">
      </div>
      <div class="channel_controller__header__info" :class="{'channel_controller_preload' : preload}">
        <div class="channel_controller__header__info__name" :class="{'channel_controller_preload' : preload}">
          <p v-if="!preload">{{ user.fullName }}</p>
        </div>
        <div class="channel_controller__header__info__username" :class="{'channel_controller_preload' : preload}">
          <p v-if="!preload">@{{ user.username }}</p>
        </div>
      </div>
      <div class="channel_controller__header__settings" @click="settingsState = !settingsState" :class="{'channel_controller_preload' : preload, active: settingsState}">
        <svg v-if="!preload" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.24106 7.7459C4.53326 7.44784 4.99051 7.42074 5.31272 7.66461L5.40503 7.7459L12 14.4734L18.595 7.7459C18.8872 7.44784 19.3444 7.42074 19.6666 7.66461L19.7589 7.7459C20.0511 8.04396 20.0777 8.51037 19.8386 8.83904L19.7589 8.93321L12.582 16.2541C12.2898 16.5522 11.8325 16.5793 11.5103 16.3354L11.418 16.2541L4.24106 8.93321C3.91965 8.60534 3.91965 8.07376 4.24106 7.7459Z" fill="#62798A"/>
        </svg>
      </div>
    </div>
    <div v-if="settingsState" @click="settingsState = false" class="channel_controller__modal fadeIn500ms" style="animation-duration: 0.2s">
      <div class="item" @click="openSettings()">
        <IconSettings />
        <span>Настройки</span>
      </div>
      <div class="item exit" @click="logout()">
        <IconExit />
        <span>Выйти</span>
      </div>
    </div>
    <div class="channel_controller__search">
      <div class="channel_controller__search__field" :class="{'channel_controller_preload' : preload}">
        <div class="search_component">
          <input type="text" v-model="searchString" placeholder="Поиск">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="9.80541" cy="9.80553" rx="7.49047" ry="7.49047" stroke="#4F5E7B" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.0151 15.4043L17.9518 18.3334" stroke="#4F5E7B" stroke-opacity="0.8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
    <div v-if="searchString" class="channel_controller__list" key="channel_controller__results">
      <ChannelViewComponent
          v-for="(result, idx) in searchResults"
          :state="result.channel"
          :user="result.user"
          :sid="idx"
          :key="`${result.channel ? result.channel.channel.id : result.user.uid}-search-result-${result.channel ? 'channel' : 'user' }`"/>
    </div>
    <div v-else-if="preload" class="channel_controller__list" key="channel_controller__list">
      <ChannelViewComponent v-if="preload" v-for="idx in 10" :key="idx"/>
    </div>
    <div v-else class="channel_controller__list" key="channel_controller__list">
      <ChannelViewComponent v-for="state in channelController.channels" :state="state" :key="`${state.channel.id}-channel`"/>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
  useContext,
  useStore,
  useRouter
} from '@nuxtjs/composition-api'
import ChannelViewComponent from '~/components/core/ChannelViewComponent.vue'
import IconSettings from '~/components/logo/IconSettings.vue'
import IconExit from '~/components/logo/IconExit.vue'

export default defineComponent({
  components: { IconExit, ChannelViewComponent, IconSettings },
  setup(props, { emit }) {
    const { $socket, $axios } = useContext()
    const store = useStore()
    const channelController = computed(() => $socket.$state)
    const user = computed(() => store.getters['auth/user'])
    const settingsState = ref(false)
    const searchString = ref('')
    const searchResults = computed(() => channelController.value.search)
    const preload = computed(() => !channelController.value.loaded)
    const avatar = computed(() => `${$axios.defaults.baseURL}storage/a/${user.value.avatar}`)

    const openSettings = () => {
      store.commit('auth/SET_SETTINGS', true)
    }

    watch(searchString, () => $socket.emit('query:search', searchString.value))

    const logout = async () => {
      store.commit('auth/SET_TOKEN', null)
      channelController.value.close()
      window.location.href = '/welcome'
    }
    return {
      channelController,
      preload,
      user,
      avatar,
      settingsState,
      searchString,
      searchResults,
      logout,
      openSettings
    }
  }
})
</script>
