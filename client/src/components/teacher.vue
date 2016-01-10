<template>
  <div class="ui stackable two column grid container">
    <div class="row">
      <div class="ten wide column">
        <h1>{{ teacher.name }}</h1>
        <div class="ui buttons">
          <button class="ui button" id="contactButton"
                  :class="{ disabled: !teacher.email }">
            <i class="mail outline icon"></i> Contactar
          </button>
          <div class="ui popup bottom left transition hidden">
            <div class="content">
              <div class="ui action input">
                <input id="emailField" type="text">
                <button class="ui teal button"
                        @click="copyEmail">
                  <i class="copy icon"></i>
                  Copiar
                </button>
              </div>
            </div>
          </div>
          <div id="shareMenu" class="ui floating dropdown button">
            <i class="share alternate icon"></i>
            <span class="text">Compartir</span>
            <div class="menu">
              <div class="item">
                <i class="facebook icon"></i>
                <span class="text">Facebook</span>
              </div>
              <div class="item">
                <i class="twitter icon"></i>
                <span class="text">Twitter</span>
              </div>
            </div>
          </div>
          <button class="ui orange button" v-link="{ path: $route.path + '/edit' }">
            <i class="edit icon"></i> Editar
          </button>
        </div>
        <like :obj.sync="teacher"></like>
      </div>
      <div class="six wide column">
        <h3>Asignaturas</h3>
        <div class="ui link list">
          <a v-for="course in teacher.courses"
             v-link="{name: 'course', params: {slug: course.slug}}"
             class="item">
             <i class="cube icon"></i>
             <div class="content">{{course.name}}</div>
           </a>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="ten wide column">
        <h3 class="ui horizontal divider header">
          <i class="user icon"></i>
          Sobre el profesor
        </h3>
        <div class="markdown" v-if="teacher.description" v-html="teacher.description | marked"></div>
        <div class="markdown" v-else>
          <p>No se tienen más datos sobre este profesor.</p>
        </div>
      </div>
      <div class="six wide column">
        <links v-if="hasLinks" :obj.sync="teacher" :editor="false"></links>
        <tags v-if="hasTags" :obj.sync="teacher" :editor="false"></tags>
      </div>
    </div>
    <div class="row">
      <div class="ten wide column">
        <comments :obj.sync="teacher"></comments>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
import CommentSection from './comment.section.vue'
import TagSection from './tag.section.vue'
import LinkSection from './link.section.vue'
import LikeView from './like.view.vue'

import * as Teacher from '../services/teacher.service'
import * as Comment from '../services/comment.service'

import { SharedStore, sortComments } from '../lib/utils'
import marked from 'marked'

export default {
  route: {
    data({to: { params: { slug }}}) {
      return Promise.all([
        Teacher.findBySlug(slug),
        Comment.list(slug)
      ]).then(([teacher, comments]) => {
        teacher.comments = sortComments(comments)
        SharedStore.state.teacher = teacher
        document.title = "XSIGA - "+teacher.name
        return { teacher: teacher }
      })
    }
  },
  data() {
    return {
      teacher: {}
    }
  },
  ready() {
    $('#shareMenu').dropdown({
      action: 'hide'
    })
    $('#contactButton').popup({
      hoverable: true,
      delay: {
        show: 100,
        hide: 300
      },
      onVisible: function(){
        $('#emailField').val(this.teacher.email)
      }.bind(this)
    })
  },
  computed: {
    hasTags: function(){
      return this.teacher.tags && this.teacher.tags.length > 0
    },
    hasLinks: function(){
      return this.teacher.links && this.teacher.links.length > 0
    }
  },
  methods: {
    copyEmail: function(){
      $('#emailField').val(this.teacher.email).select()
      document.execCommand('copy')
    }
  },
  components: {
    comments: CommentSection,
    tags: TagSection,
    links: LinkSection,
    like: LikeView
  },
  filters: {
    marked: marked
  }
}
</script>
