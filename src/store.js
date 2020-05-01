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
    callrail_calls: localStorage.getItem('callrail_calls') || [],
    users: [],
    callrail: {
      companies: localStorage.getItem('companies') || [],
    },
    // profile: localStorage.getItem('profile') || {},
    registration_errors: {},
    nameRules: [
      v => !!v || 'Name is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
    ],
    notesRules: [
      v => !!v || 'Notes is required for us to see the details of your request.',
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
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
        // state.profile = payload.data.profile
        state.isUser = true
        state.isUserApproved = payload.data.is_approved
      }
    },
    GET_USERS (state, payload) {
      state.users = payload.data
    },
    GET_CALLRAIL_COMPANIES (state, payload) {
      state.callrail.companies = payload.companies
    },
    GET_PROFILE (state, payload) {
      state.profile = payload
    },
    GET_ERROR_REGISTRATION (state, payload) {
      state.registration_errors = payload
    },
    GET_CALLRAIL_CALLS (state, payload) {
      state.callrail_calls = payload
    },
  },
  actions: {
    getProfile ({ commit }, payload) {
      localStorage.setItem('profile', JSON.stringify(payload))
      commit('GET_PROFILE', payload)
    },

    updateProfile ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL
        axios.defaults.withCredentials = true
        axios.get('/sanctum/csrf-cookie')
          .then(() => {
            axios.put(`/api/users/${payload.id}`, {
              name: payload.name,
              email: payload.email,
              password: payload.password,
              notes: payload.notes,
              company: payload.company,
              id: payload.id,
            })
            .then(user => {
              // console.log(user.data)
              resolve(user)
            })
            .catch(error => {
              reject(error.errors)
            })
        })
      })
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
                      // localStorage.setItem('profile', JSON.stringify(user.data.profile))
                    }
                    commit('USER_LOGIN', user)
                    resolve(user)
                  })
              })
              .catch(error => {
                reject(error.data)
              })
          })
      })
    },

    userRegister ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        axios.defaults.baseURL = process.env.VUE_APP_AXIOS_BASE_URL
        axios.defaults.withCredentials = true
        axios.get('/sanctum/csrf-cookie')
          .then(() => {
            axios.post('/api/users', {
              name: payload.name,
              email: payload.email,
              password: payload.password,
              notes: payload.notes,
            })
            .then(user => {
              // console.log(user.data)
              resolve(user)
            })
            .catch(error => {
              // console.log(error)
              commit('GET_ERROR_REGISTRATION', error.response.data)
              reject(error.errors)
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
          localStorage.setItem('companies', JSON.stringify(response.data))
          commit('GET_CALLRAIL_COMPANIES', response.data)
        })
    },

    getProfileCallrail (context) {
      axios.defaults.baseURL = process.env.VUE_APP_CALLRAIL_BASE_URL
      axios.defaults.headers.authorization = `Token token=${process.env.VUE_APP_CALLRAIL_TOKEN}`
      axios.defaults.withCredentials = false

      axios
        .get(`/calls.json?company_id=${context.state.user.profile.callrail}`)
        .then(response => {
          localStorage.setItem('callrail_calls', JSON.stringify(response.data))
          context.commit('GET_CALLRAIL_CALLS', response.data)
        })
    },
  },
})
