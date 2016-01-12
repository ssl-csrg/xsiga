<template>
  <div class="ui comments">
    <h3 class="ui horizontal divider header">
      <i class="comments outline icon"></i>
      Comentarios y Consultas
    </h3>
    <comment :comment.sync="comment" v-for="comment in obj.comments"></comment>
    <form class="ui reply form">
      <template v-if="!hasSession">
        <div class="fields">
          <div class="field">
            <label>Nombre</label>
            <input type="text" placeholder="Nombre" v-model="newComment.user.name">
          </div>
          <div class="field">
            <label>Correo Electrónico</label>
            <input type="text" placeholder="@usm.cl" v-model="newComment.user.email">
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
        <textarea v-model="newComment.content"></textarea>
      </div>
      <div class="ui primary submit labeled icon button" @click="sendComment">
        <i class="send icon"></i> Enviar
      </div>
    </form>
  </div>
</template>

<script lang="babel">
import { SharedStore } from '../lib/utils'
import VueGravatar from './gravatar.vue'
import CommentView from './comment.view.vue'

import * as Comment from '../services/comment.service'

export default {
  props: {
    obj: {
      type: Object,
      twoWay: true,
      required: true
    }
  },
  data(){
    return {
      newComment: {
        user: {
          name: "",
          email: ""
        },
        content: ""
      },
      shared: SharedStore.state
    }
  },
  computed: {
    hasSession(){
      return this.shared.session && this.shared.session.hasOwnProperty('name')
    }
  },
  events: {
    'form-open': function(id){
      this.$broadcast('form-open', id)
    }
  },
  methods: {
    sendComment(){
      this.newComment.created = new Date()
      this.newComment.parent = this.obj.slug
      if (this.shared.session && this.shared.session.hasOwnProperty('name')){
        this.newComment.user = this.shared.session
      }
      Comment.send(this.newComment).then((comment) => {
        this.obj.comments.unshift(comment)
        if (!this.shared.session || !this.shared.session.hasOwnProperty('name')){
          this.shared.session = {
            name: comment.user.name,
            email: comment.user.email,
            _id: comment.user._id
          }
        }
      })
      this.newComment.content = ""
    }
  },
  components: {
    gravatar: VueGravatar,
    comment: CommentView
  }
}
</script>
