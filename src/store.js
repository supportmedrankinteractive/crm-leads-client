import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    callrail: {
      companies: [],
    },
    profile: localStorage.getItem('profile') || {},
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

    getProfile (state) {
      return state.profile
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
    GET_CALLRAIL_COMPANIES (state, payload) {
      state.callrail.companies = payload.companies
    },
    GET_PROFILE (state, payload) {
      state.profile = payload
    },
  },
  actions: {
    getProfile ({ commit }, payload) {
      localStorage.setItem('profile', JSON.stringify(payload))
      commit('GET_PROFILE', payload)
    },

    userLogin ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL
        axios.defaults.withCredentials = true
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
              .catch(error => {
                // console.log(error)
                reject(error.data)
              })
          })
      })
    },

    getUsers ({ commit }) {
      axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL
      axios.defaults.withCredentials = true
      axios
        .get('api/users')
        .then(response => {
          commit('GET_USERS', response)
        })
    },

    getCallrailCompanies ({ commit }) {
      axios.defaults.baseURL = process.env.VUE_APP_CALLRAIL_BASE_URL
      axios.defaults.headers.authorization = `Token token=${process.env.VUE_APP_CALLRAIL_TOKEN}`
      axios.defaults.withCredentials = false

      axios
        .get('/companies.json?status=active')
        .then(response => {
          commit('GET_CALLRAIL_COMPANIES', response.data)
        })
    },
  },
})
