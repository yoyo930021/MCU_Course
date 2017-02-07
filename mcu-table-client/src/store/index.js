import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: false,
    ggdb:1,
    loginCourse: [],
    choosedList:[]
  },

  actions: {

  },

  mutations: {
    ok(state,payload){
      state.login = true
      state.loginCourse = payload.list.slice()
      state.choosedList = payload.list.slice()
      state.ggdb = payload.ggdb
    },
    space(state,ggdb){
      state.login = true
      state.ggdb = ggdb
    },
    addChoosed(state,item){
      state.choosedList.push(item)
    },
    removeChoosed(state,index){
      state.choosedList.splice(index,1)
    }
  }
})