import Vue from 'vue'
import VueRouter from 'vue-router'

import Course from './components/course.vue'
import CourseEditor from './components/course.editor.vue'
import Teacher from './components/teacher.vue'
import TeacherEditor from './components/teacher.editor.vue'
import BaseComponent from './components/base.vue'
import NotFound from './components/notfound.vue'
import List from './components/list.vue'
import Index from './components/index.vue'

import moment from 'moment'

moment.locale('es')
Vue.use(VueRouter)

Vue.config.debug = true

let App = Vue.extend({})

let router = new VueRouter({
  hashbang: false,
  history: true
})

router.map({
  '/teacher/:slug': {
    name: 'teacher',
    component: BaseComponent,
    subRoutes: {
      'edit': {
        name: 'teacherEditor',
        component: TeacherEditor
      },
      '/': {
        component: Teacher
      }
    }
  },
  '/course/:slug': {
    name: 'course',
    component: BaseComponent,
    subRoutes: {
      'edit': {
        name: 'courseEditor',
        component: CourseEditor
      },
      '/': {
        component: Course
      }
    }
  },
  '/:kind': {
    name: 'list',
    component: List
  },
  '/': {
    name: 'index',
    component: Index
  },
  '*': {
    component: NotFound
  }
})

router.start(App, '#app')
