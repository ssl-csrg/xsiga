<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h2>{{ course.name }}</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <p v-if="teacher.description">{{ course.description }}</p>
        <p v-else>No se tienen más datos sobre esta asignatura.</p>
      </div>
      <div class="col-md-4">
        <h3>Profesores</h3>
        <div class="list-group">
          <a v-for="teacher in course.teachers"
             v-link="{name: 'teacher', params: {slug: teacher.slug}}"
             class="list-group-item">{{teacher.name}}</a>
        <div>
      </div>
    </div>
    <comments></comments>
  </div>
</template>

<script lang="babel">
import Comments from './comments.vue'
import * as Course from '../services/course.service'

export default {
  route: {
    data({to: { params: { slug }}}) {
      return Course.findBySlug(slug).then((data) => ({ course: data }))
    }
  },
  data(){
    return {
      course: {}
    }
  },
  components: {
    'comments': Comments
  }
}
</script>
