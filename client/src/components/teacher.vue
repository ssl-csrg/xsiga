<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h2>{{ teacher.name }}</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-md-8">
        <p v-if="teacher.description">{{ teacher.description }}</p>
        <p v-else>No se tienen más datos sobre este profesor.</p>
      </div>
      <div class="col-md-4">
        <h3>Asignaturas</h3>
        <div class="list-group">
          <a v-for="course in teacher.courses"
             v-link="{name: 'course', params: {slug: course.slug}}"
             class="list-group-item">{{course.name}}</a>
        <div>
      </div>
    </div>
    <comments></comments>
  </div>
</template>

<script lang="babel">
import Comments from './comments.vue'
import * as Teacher from '../services/teacher.service'

export default {
  route: {
    data({to: { params: { slug }}}) {
      return Teacher.findBySlug(slug).then((data) => ({ teacher: data }))
    }
  },
  data(){
    return {
      teacher: {}
    }
  },
  components: {
    'comments': Comments
  }
}
</script>
