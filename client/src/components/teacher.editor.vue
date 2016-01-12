<template>
  <div class="ui stackable two column grid container">
    <div class="row">
      <div class="ten wide column">
        <h3>Información Personal</h3>
        <div class="ui form">
          <div class="field">
            <div class="ui left icon input">
              <input type="text" v-model="teacher.name" placeholder="Nombre"></input>
              <i class="user icon"></i>
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <input type="email" v-model="teacher.email" placeholder="Correo Electrónico"></input>
              <i class="mail outline icon"></i>
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
        <h3>Asignaturas</h3>
        <div class="ui info message">
          <p>El sistema asigna las asignaturas de forma automática usando la
          información extraída de SIGA</p>
        </div>
        <div class="ui list">
          <div v-for="course in courses"
             class="item">
             <i class="cube icon"></i>
             <div class="content">{{course.name}}</div>
           </div>
        </div>
      </div>
    </div>
    <div class="row">
    <div class="ten wide column">
      <h3 class="ui horizontal divider header">
        <i class="user icon"></i>
        Sobre el profesor
      </h3>
          <div class="ui form">
            <div class="ui info message">
              <p>Este campo soporta sintaxis <em>markdown</em>.</p>
            </div>
            <textarea v-model="teacher.description"></textarea>
            <div class="ui horizontal divider header">
              <i class="wizard icon"></i>
              Previsualización
            </div>
            <div class="ui stacked segment markdown" v-html="teacher.description | marked"></div>
          </div>
    </div>
    <div class="six wide column">
      <links :obj.sync="teacher" :editor="true"></links>
      <tags :obj.sync="teacher" :editor="true"></tags>
    </div>
  </div>
</template>

<script lang="babel">
import TagSection from './tag.section.vue'
import LinkSection from './link.section.vue'
import marked from 'marked'
import { shortenURL, SharedStore } from '../lib/utils'
import * as Teacher from '../services/teacher.service'
import * as User from '../services/user.service'

export default {
  route:{
    data(transition) {
      return User.getTags().then((response) => {
        return {
          autocomplete: response.tags
        }
      })
    },
    canActivate: function(transition) {
      if(SharedStore.state.teacher == null){
        transition.redirect('teacher/'+transition.to.params.slug)
      } else transition.next()
    }
  },
  ready: function() {
    let engine = new Bloodhound({
      local: this.autocomplete,
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace
    })

    engine.initialize()

    $('#inputTags').tokenfield({
      typeahead: [null, {source: engine.ttAdapter()}]
    })
  },
  data: function(){
    let teacher = SharedStore.state.teacher || { name: "", description: "" }
    document.title = 'XSIGA - Editando \"'+teacher.name+'\"'

    return {
      teacher: {
        name: teacher.name,
        email: teacher.email,
        slug: teacher.slug,
        description: teacher.description || "",
        links: teacher.links || [],
        tags: teacher.tags || []
      },
      courses: teacher.courses,
      autocomplete: []
    }
  },
  methods: {
    goBack: function() {
      this.$route.router.go({ name: 'teacher', params: { slug: this.$route.params.slug }})
    },
    save: function() {
      Teacher.update(this.teacher)
      .then(() => {
        this.$route.router.go({ name: 'teacher', params: { slug: this.$route.params.slug }})
      })
    }
  },
  filters: {
    marked: marked,
    shorten: shortenURL
  },
  components: {
    tags: TagSection,
    links: LinkSection
  }
}
</script>
