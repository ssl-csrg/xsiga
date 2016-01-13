<template>
  <div class="ui stackable two column grid container">
    <div class="twelve wide column">
      <h1 class="ui header">
        <i class="sitemap icon"></i>
        <div class="content">Lista de {{ contentName }}</div>
      </h1>
      <div class="ui link list">
        <a class="item" v-for="item in content" v-link="{name: contentType, params: {slug: item.slug}}">
          <i class="icon" :class="{ 'user': contentType == 'teacher', 'cube': contentType == 'course'}"></i>
          {{ item.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="babel">
import * as Teacher from '../services/teacher.service'
import * as Course from '../services/course.service'

export default {
  route: {
    data({to: { params: { kind } }, redirect }) {
      console.log(kind)
      if (kind == 'teacher') {
        return Teacher.list().then((content) => ({
          contentName: 'Profesores',
          contentType: 'teacher',
          content: content
        }))
      } else if (kind == 'course') {
        return Course.list().then((content) => ({
          contentName: 'Asignaturas',
          contentType: 'course',
          content: content
        }))
      } else {
        redirect('/')
      }
    }
  },
  data() {
    return {
      contentName: "",
      contentType: "",
      content: []
    }
  }
}
</script>
