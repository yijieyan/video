import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/Index/index.vue'
import Detail from '../components/Detail/detail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/detail',
      name: 'detail',
      component: Detail
    }
  ]
})
