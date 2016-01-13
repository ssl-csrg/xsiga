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
          <div id="shareMenu" class="ui pointing dropdown button">
            <i class="share alternate icon"></i>
            <span class="text">Compartir</span>
            <div class="menu">
              <a class="item" :href="facebookIntent">
                <i class="facebook icon"></i>
                <span class="text">Facebook</span>
              </a>
              <a class="item" :href="twitterIntent">
                <i class="twitter icon"></i>
                <span class="text">Twitter</span>
              </a>
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
          <p>No se tienen más datos sobre este profesor. Puedes agregar datos presionando el botón "Editar".</p>
        </div>
      </div>
      <div class="six wide column">
        <links v-if="hasLinks" :obj.sync="teacher" :editor="false"></links>
        <tags v-if="hasTags" :obj.sync="teacher" :editor="false"></tags>
        <recommended :obj="teacher"></recommended>
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
import RecommendedSection from './recommended.section.vue'
import LikeView from './like.view.vue'

import * as Teacher from '../services/teacher.service'
import * as Comment from '../services/comment.service'

import { SharedStore, sortComments } from '../lib/utils'

import marked from 'marked'
import queryString from 'query-string'

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
      onVisible() {
        $('#emailField').val(this.teacher.email)
      }.bind(this)
    })
  },
  computed: {
    hasTags() {
      return this.teacher.tags && this.teacher.tags.length > 0
    },
    hasLinks() {
      return this.teacher.links && this.teacher.links.length > 0
    },
    twitterIntent() {
      return 'https://twitter.com/intent/tweet?' + queryString.stringify({
        text: 'Revisa la información del profesor(a) '+this.teacher.name,
        via: 'XSIGA',
        hashtags: 'XSIGA,UTFSM',
        url: 'http://localhost:3000/teacher/'+this.teacher.slug
      })
    },
    facebookIntent() {
      return 'https://www.facebook.com/dialog/share?' + queryString.stringify({
        app_id: 1650855531847633,
        display: "page",
        href: 'http://localhost:3000/teacher/'+this.teacher.slug,
        redirect_uri: 'http://localhost:3000/teacher/'+this.teacher.slug
      })
    }
  },
  methods: {
    copyEmail() {
      $('#emailField').val(this.teacher.email).select()
      document.execCommand('copy')
    }
  },
  components: {
    comments: CommentSection,
    tags: TagSection,
    links: LinkSection,
    like: LikeView,
    recommended: RecommendedSection
  },
  filters: {
    marked: marked
  }
}
</script>
