<template>
  <div class="ui buttons">
    <button class="ui olive icon button"
    :class="{ 'basic': !isMarked }"
    @click="toggleLike">
      <i class="star icon" :class="{ 'empty': !isMarked }"></i>
      Me agrada
  </div>
</template>

<script lang="babel">
import { SharedStore } from '../lib/utils'
import * as Teacher from '../services/teacher.service'

export default {
  props: {
    obj: {
      type: Object,
      twoWay: true,
      required: true
    }
  },
  data() {
    return {
      shared: SharedStore.state
    }
  },
  methods: {
    toggleLike() {
      if (this.isMarked) {
        Teacher.dislike(this.obj.slug).then((value) => {
          this.obj.likes.splice(this.obj.likes.indexOf(this.shared.session._id), 1)
        })
      } else {
        Teacher.like(this.obj.slug).then((value) => {
          if(!this.obj.hasOwnProperty('likes')) this.obj.likes = [this.shared.session._id]
          else this.obj.likes.push(this.shared.session._id)
        })
      }
    }
  },
  computed: {
    isMarked() {
      if (!this.obj.likes) this.obj.likes = []
      return this.shared.session && this.obj.likes.indexOf(this.shared.session._id) > -1
    }
  }
}
</script>
