import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Choose from '../views/Choose.vue'
import Start from '../views/Start.vue'
import Share from '../views/Share.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
  {
    path: '/',
    component: Start,
  },
  {
    path: '/choose',
    component: Choose,
    beforeEnter: (to, from, next) => {
      if(store.state.login){
        next()
      }else{
        next({ path: '/' })
      }
    }
  },
  {
    path: '/token/:token',
    component: Share,
  }
  ]
})