<template>
  <div class="channel_chat">
  </div>
</template>

<script lang="ts">
import {defineComponent, toRefs, ref, useStore, computed, useContext} from '@nuxtjs/composition-api'
import { ChannelState, IMessage } from '~/scripts/channel'
import { IUser } from '~/scripts/user'

export default defineComponent({
  props: {
    state: {
      type: ChannelState,
      default: null
    }
  },
  setup(props, { emit }) {
    const { $axios } = useContext()
    const { state } = toRefs(props)

    return {
    }
  }
})
</script>
