<template>
  <template v-if="reply">
    <div class="comment">
      <a class="avatar">
        <gravatar :email="reply.user.email"></gravatar>
      </a>
      <div class="content">
        <span class="author">{{ reply.user.name }}</span>
        <div class="metadata">
          <span class="date">{{ reply.created | moment }}</span>
        </div>
        <div class="text">{{ reply.content }}</div>
        <div class="actions">
          <a @click.prevent="castVote('up')" :class="{'selected': isPositive}">
            <i class="thumbs up icon"></i> Es útil
          </a>
          <a @click.prevent="castVote('down')" :class="{'selected': isNegative}">
            <i class="thumbs down icon"></i> No es útil
          </a>
        </div>
      </div>
    </div>
  </template>
</template>

<style>
.selected {
  color: orange !important;
}
</style>

<script lang="babel">
import VueGravatar from './gravatar.vue'
import { SharedStore } from '../lib/utils'
import * as Comment from '../services/comment.service'
import moment from 'moment'

export default {
  props: {
    reply: {
      type: Object,
      twoWay: true,
      required: true
    },
    commentId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      shared: SharedStore.state
    }
  },
  computed: {
    isPositive() {
      if(!this.shared.session) return false
      if(!this.reply.positives) this.reply.positives = []
      return this.reply.positives.indexOf(this.shared.session._id) > -1
    },
    isNegative() {
      if(!this.shared.session) return false
      if(!this.reply.negatives) this.reply.negatives = []
      return this.reply.negatives.indexOf(this.shared.session._id) > -1
    }
  },
  methods: {
    castVote(cast) {
      const sessId = this.shared.session._id
      Comment.voteReply(cast, this.commentId, this.reply._id).then((result) => {
        if(!this.reply.positives) this.reply.positives = []
        if(!this.reply.negatives) this.reply.negatives = []

        let positiveIdx = this.reply.positives.indexOf(sessId)
        let negativeIdx = this.reply.negatives.indexOf(sessId)

        if (positiveIdx > -1) {
          this.reply.positives.splice(positiveIdx, 1)
          if (cast === 'up') {
            this.reply.score -= 1
          } else {
            this.reply.negatives.push(sessId)
            this.reply.score -= 2
          }
        } else if (negativeIdx > -1) {
          this.reply.negatives.splice(negativeIdx, 1)
          if (cast === 'down') {
            this.reply.score += 1
          } else {
            this.reply.positives.push(sessId)
            this.reply.score += 2
          }
        } else {
          this.reply[cast === 'up' ? 'positives' : 'negatives'].push(sessId)
          this.reply.score += (cast === 'up' ? 1 : -1)
        }
      })
    },
  },
  components: {
    gravatar: VueGravatar
  },
  filters: {
    moment(value) {
      return moment(value).fromNow()
    }
  },
}
</script>
