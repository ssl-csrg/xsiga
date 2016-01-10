<template>
  <div class="ui stackable two column grid container">
    <div class="row">
      <div class="ten wide column">
        <h3>Identificación de la Asignatura</h3>
        <div class="ui form">
          <div class="field">
            <div class="ui left icon input">
              <input type="text" v-model="course.name" placeholder="Nombre"></input>
              <i class="cube icon"></i>
            </div>
          </div>
          <div class="ui buttons">
            <button class="ui blue button" @click.prevent="save">
              <i class="save icon"></i> Guardar
            </button>
            <button class="ui button" @click.prevent="goBack">
              <i class="undo icon"></i> Volver
            </button>
          </div>
        </div>
      </div>
      <div class="six wide column">
        <h3>Profesores</h3>
        <div class="ui info message">
          <p>El sistema asigna los profesores de cada asignatura de forma
            automática usando la información extraída de SIGA</p>
        </div>
        <div class="ui list">
          <div v-for="teacher in teachers"
             class="item">
             <i class="cube icon"></i>
             <div class="content">{{teacher.name}}</div>
           </div>
        </div>
      </div>
    </div>
    <div class="row">
    <div class="ten wide column">
      <h3 class="ui horizontal divider header">
        <i class="user icon"></i>
        Sobre la asignatura
      </h3>
          <div class="ui form">
            <div class="ui info message">
              <p>Este campo soporta sintaxis <em>markdown</em>.</p>
            </div>
            <textarea v-model="course.description"></textarea>
            <div class="ui horizontal divider header">
              <i class="wizard icon"></i>
              Previsualización
            </div>
            <div class="ui stacked segment markdown" v-html="course.description | marked"></div>
          </div>
    </div>
    <div class="six wide column">
      <links :obj.sync="course" :editor="true"></links>
      <tags :obj.sync="course" :editor="true"></tags>
    </div>
  </div>
</template>

<script lang="babel">
import TagSection from './tag.section.vue'
import LinkSection from './link.section.vue'
import marked from 'marked'
import { shortenURL, SharedStore } from '../lib/utils'
import * as Course from '../services/course.service'

export default {
  route:{
    canActivate: function(transition) {
      if(SharedStore.state.course == null){
        transition.redirect('course/'+transition.to.params.slug)
      } else transition.next()
    }
  },
  ready: function() {
    $('#inputTags').tokenfield()
  },
  data: function(){
    let course = SharedStore.state.course
    document.title = 'XSIGA - Editando \"'+course.name+'\"'

    return {
      course: {
        name: course.name,
        slug: course.slug,
        description: course.description || "",
        links: course.links || [],
        tags: course.tags || []
      },
      teachers: course.teachers
    }
  },
  methods: {
    goBack: function() {
      this.$route.router.go({ name: 'course', params: { slug: this.$route.params.slug }})
    },
    save: function() {
      Course.update(this.course)
      .then(() => {
        this.$route.router.go({ name: 'course', params: { slug: this.$route.params.slug }})
      })
    }
  },
  filters: {
    marked: marked
  },
  components: {
    tags: TagSection,
    links: LinkSection
  }
}
</script>
