import Vue from 'vue'
import Vuex from 'vuex'
import * as api from '../api/axios.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: false,
    ggdb:1,
    loginCourse: [],
    choosedList:[],
    shareTable: []
  },

  actions: {
    FETCH_SHARE ({ commit, state },token) {
      return api.getShareCourse(token).then((response)=>{
        commit("setShare",JSON.parse(response.data))
      })
    },
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
    },
    setShare(state,data){
      state.shareTable = data;
    }
  }
})