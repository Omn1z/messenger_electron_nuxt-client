<template>
  <div class="container">
    <div class="messenger__layout">
      <div class="messenger__layout__sidebar fadeInLeft500ms">
        <ChannelControllerComponent />
      </div>
      <div class="messenger__layout__channel fadeIn500ms" :class="{'not_selected' : !channelController.selectedChannel}">
        <BlockEmptyChannel v-if="!channelController.selectedChannel" />
        <ChannelChatComponent v-else />
      </div>
    </div>
    <SettingsController />
    <ImageViewer />
  </div>
</template>

<script lang="ts">

import {computed, watch, defineComponent, onMounted, ref, useContext, toRef} from '@nuxtjs/composition-api'
import BlockEmptyChannel from '~/components/blocks/BlockEmptyChannel.vue'
import ChannelControllerComponent from '~/components/core/ChannelControllerComponent.vue'
import ChannelChatComponent from '~/components/core/ChannelChatComponent.vue'
import SettingsController from '~/components/core/SettingsController.vue'
import ImageViewer from '~/components/core/ImageViewer.vue'
export default defineComponent({
  middleware: 'authenticated',
  components: {
    SettingsController,
    ImageViewer,
    BlockEmptyChannel,
    ChannelControllerComponent,
    ChannelChatComponent
  },
  setup: function () {
    const { $socket, store } = useContext()
    const channelController = ref($socket.$state)
    const msgAlerts = computed(() => store.getters['auth/alertsMsg'])
    watch(msgAlerts, async () => {
      const sound = new Audio(require('~/static/new_message.mp3').default)
      await sound.play()
    })
    return {
      channelController
    }
  }
})

</script>
