<template>
  <div class="ui stackable two column grid container">
    <div class="row">
      <div class="ten wide column">
        <h1 class="ui header">
          {{ course.name }}
          <div class="sub header">{{ course.short }}</div>
        </h1>
        <div class="ui buttons">
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
      </div>
      <div class="six wide column">
        <h3>Profesores</h3>
        <div class="ui link list">
          <a v-for="teacher in course.teachers"
             v-link="{name: 'teacher', params: {slug: teacher.slug}}"
             class="item">
             <i class="user icon"></i>
             <div class="content">{{teacher.name}}</div>
           </a>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="ten wide column">
        <h3 class="ui horizontal divider header">
          <i class="cube icon"></i>
          Sobre la asignatura
        </h3>
        <div class="markdown" v-if="course.description" v-html="course.description | marked"></div>
        <div class="markdown" v-else>
          <p>No se tienen más datos sobre esta asignatura.</p>
        </div>
      </div>
      <div class="six wide column">
        <links v-if="hasLinks" :obj.sync="course" :editor="false"></links>
        <tags v-if="hasTags" :obj.sync="course" :editor="false"></tags>
      </div>
    </div>
    <div class="row">
      <div class="ten wide column">
        <comments :obj.sync="course"></comments>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
import CommentSection from './comment.section.vue'
import TagSection from './tag.section.vue'
import LinkSection from './link.section.vue'

import * as Course from '../services/course.service'
import * as Comment from '../services/comment.service'

import { SharedStore, sortComments } from '../lib/utils'
import marked from 'marked'

export default {
  route: {
    data({to: { params: { slug }}}) {
      return Promise.all([
        Course.findBySlug(slug),
        Comment.list(slug)
      ]).then(([course, comments]) => {
        course.comments = sortComments(comments)
        SharedStore.state.course = course
        document.title = "XSIGA - "+course.name
        return { course: course }
      })
    }
  },
  data: () => ({course:{}}),
  ready: function() {
    $('#shareMenu').dropdown({
      action: 'hide'
    })
  },
  computed: {
    hasTags: function(){
      return this.course.tags && this.course.tags.length > 0
    },
    hasLinks: function(){
      return this.course.links && this.course.links.length > 0
    }
  },
  components: {
    'comments': CommentSection,
    'tags': TagSection,
    'links': LinkSection
  },
  filters: {
    marked: marked
  }
}
</script>
