<template>
  <router-view transition="fade" transition-mode="out-in"></router-view>
</template>

<script lang="babel">
import * as User from '../services/user.service'

import { SharedStore } from '../lib/utils'

export default {
  route: {
    activate() {
      return User.get().then((user) => {
        SharedStore.state.session = user
      }).catch(() => {
        SharedStore.state.session = null
      })
    }
  }
}
</script>
