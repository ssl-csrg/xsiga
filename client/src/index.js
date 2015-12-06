import Vue from 'vue'
import VueRouter from 'vue-router'

import Course from './components/course.vue'
import Teacher from './components/teacher.vue'

Vue.use(VueRouter)
let App = Vue.extend({})

let router = new VueRouter({
  hashbang: false,
  history: true
})

router.map({
  '/teacher/:slug': {
    name: 'teacher',
    component: Teacher
  },
  '/course/:slug': {
    name: 'course',
    component: Course
  }
})

router.start(App, '#app')
