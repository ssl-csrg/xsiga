<template>
  <template v-if="hasRelated">
    <h3>Asignaturas Relacionadas</h3>
    <div class="ui link list">
      <a v-for="course in obj.related"
         v-link="{name: 'course', params: {slug: course.slug}}"
         class="item">
         <i class="cube icon"></i>
         <div class="content">{{course.name}}</div>
       </a>
    </div>
  </template>
</template>

<script lang="babel">
export default {
  props: {
    obj: {
      type: Object,
      twoWay: true,
      required: true
    }
  },
  computed: {
    hasRelated() {
      return this.obj.hasOwnProperty('related') && this.obj.related.length > 0
    }
  }
}
</script>
