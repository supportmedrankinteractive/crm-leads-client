import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    drawer: null,
    isUser: JSON.parse(localStorage.getItem('isUser')) || false,
    isUserApproved: localStorage.getItem('isUserApproved') || false,
    isAdmin: localStorage.getItem('isAdmin') || false,
    user: localStorage.getItem('user') || null,
    admin: localStorage.getItem('admin') || null,
    users: [],
  },
  getters: {
    isUser (state) {
      return state.isUser
    },
    isUserApproved (state) {
      return state.isUserApproved
    },
    isAdmin (state) {
      return state.isAdmin
    },
    getUsers (state) {
      return state.users
    },
  },
  mutations: {
    SET_BAR_IMAGE (state, payload) {
      state.barImage = payload
    },
    SET_DRAWER (state, payload) {
      state.drawer = payload
    },
    SET_SCRIM (state, payload) {
      state.barColor = payload
    },
    USER_LOGIN (state, payload) {
      if (payload.data.is_admin) {
        state.admin = payload.data
        state.isAdmin = true
      } else {
        state.user = payload.data
        state.isUser = true
        state.isUserApproved = payload.data.is_approved
      }
    },
    GET_USERS (state, payload) {
      state.users = payload.data.data
    },
  },
  actions: {
    userLogin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.get('/sanctum/csrf-cookie')
          .then(response => {
            axios.post('/login', {
              email: payload.email,
              password: payload.password,
            })
              .then(resp => {
                axios.get('/api/user')
                  .then(user => {
                    if (user.data.is_admin) {
                      localStorage.setItem('isAdmin', true)
                      localStorage.setItem('admin', JSON.stringify(user.data))
                    } else {
                      localStorage.setItem('isUser', true)
                      localStorage.setItem('isUserApproved', user.data.is_approved)
                      localStorage.setItem('user', JSON.stringify(user.data))
                    }
                    commit('USER_LOGIN', user)
                    resolve(user)
                  })
              })
              .catch(err => {
                console.log(err)
                reject(err)
              })
          })
      })
    },
    getUsers ({ commit }) {
      axios
        .get('api/users')
        .then(response => {
          commit('GET_USERS', response)
        })
    },
  },
})
