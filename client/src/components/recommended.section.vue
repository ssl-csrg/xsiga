<template>
  <template v-if="hasRecommended">
    <h3>Ver también</h3>
    <div class="ui link list">
      <a v-for="teacher in obj.recommended"
         v-link="{name: 'teacher', params: {slug: teacher.slug}}"
         class="item">
         <i class="user icon"></i>
         <div class="content">{{teacher.name}}</div>
       </a>
    </div>
  </template>
</template>

<script lang="babel">
export default {
  props: {
    obj: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasRecommended() {
      return this.obj.hasOwnProperty('recommended') && this.obj.recommended.length > 0
    }
  }
}
</script>
