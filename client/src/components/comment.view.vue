<template>
  <div class="comment">
    <a class="avatar">
      <gravatar :email="comment.user.email"></gravatar>
    </a>
    <div class="content">
      <span class="author">{{ comment.user.name }}</span>
      <div class="metadata">
        <span class="date">{{ comment.created | moment }}</span>
      </div>
      <div class="text">{{ comment.content }}</div>
      <div class="actions">
        <a class="reply" @click.prevent="showForm">
          <i class="reply icon"></i> Responder
        </a>
        <a @click.prevent="castVote('up')" :class="{'selected': isPositive}"><i class="thumbs up icon"></i> Es útil</a>
        <a @click.prevent="castVote('down')" :class="{'selected': isNegative}"><i class="thumbs down icon"></i> No es útil</a>
      </div>
      <div class="comments">
        <reply v-for="reply in comment.replies"
               :comment-id="comment._id"
               :reply.sync="reply"></reply>
      </div>
      <form class="ui reply form" v-if="formShown">
        <template v-if="!hasSession">
          <div class="fields">
            <div class="field">
              <label>Nombre</label>
              <input type="text" placeholder="Nombre" v-model="newReply.user.name">
            </div>
            <div class="field">
              <label>Correo Electrónico</label>
              <input type="text" placeholder="@usm.cl" v-model="newReply.user.email">
            </div>
          </div>
        </template>
        <template v-else>
          <div class="ui horizontal list">
            <div class="item">
              <gravatar :email="shared.session.email" class="ui mini rounded image"></gravatar>
              <div class="content">
                <div class="header">{{ shared.session.name }}</div>
                <div class="description">{{ shared.session.email }}</div>
              </div>
            </div>
          </div>
        </template>
        <div class="field">
          <textarea v-model="newReply.content"></textarea>
        </div>
        <div class="ui primary submit labeled icon button" @click="sendReply">
          <i class="send icon"></i> Enviar
        </div>
        <div class="ui labeled icon button" @click="closeForm">
          <i class="close icon"></i> Cerrar
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.selected {
  color: orange !important;
}
</style>

<script lang="babel">
import moment from 'moment'

import VueGravatar from './gravatar.vue'
import ReplyView from './reply.view.vue'

import { SharedStore } from '../lib/utils'

import * as Comment from '../services/comment.service'
import * as User from '../services/user.service'

export default {
  props: {
    comment: {
      type: Object,
      twoWay: true,
      required: true
    }
  },
  data() {
    return {
      formShown: false,
      newReply: {
        user: {
          name: '',
          email: ''
        },
        content: ''
      },
      shared: SharedStore.state
    }
  },
  events: {
    'form-open': function (id) {
      if(id != this.comment._id) this.formShown = false
    }
  },
  computed: {
    isPositive() {
      if (!this.shared.session) return false
      if (!this.comment.positives) this.comment.positives = []
      return this.comment.positives.indexOf(this.shared.session._id) > -1
    },
    isNegative() {
      if (!this.shared.session) return false
      if (!this.comment.negatives) this.comment.negatives = []
      return this.comment.negatives.indexOf(this.shared.session._id) > -1
    },
    hasSession() {
      return this.shared.session != null
    }
  },
  methods: {
    showForm() {
      this.formShown = true
      this.$dispatch('form-open', this.comment._id)
    },
    closeForm() {
      this.formShown = false
    },
    castVote(cast) {
      const sessId = this.shared.session._id
      Comment.vote(cast, this.comment._id).then((result) => {
        if(!this.comment.positives) this.comment.positives = []
        if(!this.comment.negatives) this.comment.negatives = []

        let positiveIdx = this.comment.positives.indexOf(sessId)
        let negativeIdx = this.comment.negatives.indexOf(sessId)

        if (positiveIdx > -1) {
          this.comment.positives.splice(positiveIdx, 1)
          if (cast === 'up') {
            this.comment.score -= 1
          } else {
            this.comment.negatives.push(sessId)
            this.comment.score -= 2
          }
        } else if (negativeIdx > -1) {
          this.comment.negatives.splice(negativeIdx, 1)
          if (cast === 'down') {
            this.comment.score += 1
          } else {
            this.comment.positives.push(sessId)
            this.comment.score += 2
          }
        } else {
          this.comment[cast === 'up' ? 'positives' : 'negatives'].push(sessId)
          this.comment.score += (cast === 'up' ? 1 : -1)
        }
      })
    },
    sendReply(){
      this.newReply.created = new Date()
      if (this.shared.session && this.shared.session.hasOwnProperty('name')) {
        this.newReply.user = this.shared.session
      }
      Comment.reply(this.newReply, this.comment._id).then((comment) => {
        this.comment.replies = comment.replies
        if (!this.shared.session || !this.shared.session.hasOwnProperty('name')) {
          User.get().then((user) => {
            this.shared.session = user
          })
        }
      })
      this.newReply.content = ''
      this.formShown = false
    }
  },
  filters: {
    moment(value) {
      return moment(value).fromNow()
    }
  },
  components: {
    gravatar: VueGravatar,
    reply: ReplyView
  }
}
</script>
