import Vue from 'vue'
import Vuex from 'vuex'
import { callRailUrlAPI, siteUrlAPI } from './axios-instances'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    barColor: 'rgba(0, 0, 0, .8), rgba(0, 0, 0, .8)',
    barImage: 'https://demos.creative-tim.com/material-dashboard-pro/assets/img/sidebar-1.jpg',
    drawer: null,
    isUser: JSON.parse(localStorage.getItem('isUser')) || false,
    isUserApproved: localStorage.getItem('isUserApproved') || false,
    isAdmin: localStorage.getItem('isAdmin') || false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    admin: JSON.parse(localStorage.getItem('admin')) || null,
    callrail_calls: JSON.parse(localStorage.getItem('callrail_calls')) || {},
    users: [],
    callrail: {
      companies: JSON.parse(localStorage.getItem('companies')) || [],
    },
    // profile: localStorage.getItem('profile') || {},
    registration_errors: {},
    validation_rules: {
      name: [
        v => !!v || 'Name is required',
      ],
      password: [
        v => !!v || 'Password is required',
      ],
      notes: [
        v => !!v || 'Notes is required for us to see the details of your request.',
      ],
      email: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
    },
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

    getCompanies (state) {
      return state.callrail.companies
    },

    getParseJsonLeads (state) {
      return state.callrail_calls.map(call => {
        return { ...JSON.parse(call.content), follow_ups: call.follow_ups, lead_id: call.id, status: call.status }
      })
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
    USER_LOGOUT (state) {
      state.admin = null
      state.isAdmin = false
      state.user = null
      state.callrail_calls = {}
      state.isUser = false
      state.isUserApproved = null
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
    ADD_FOLLOW_UP (state, payload) {
      const followUp = { ...payload, icon: 'mdi-clock' }
      state.callrail_calls.find(lead => lead.id === payload.lead_id).follow_ups.unshift(followUp)
    },
  },
  actions: {
    getProfile ({ commit }, payload) {
      localStorage.setItem('profile', JSON.stringify(payload))
      commit('GET_PROFILE', payload)
    },

    updateProfile ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        siteUrlAPI.get('/sanctum/csrf-cookie')
          .then(() => {
            siteUrlAPI.put(`/api/users/${payload.id}`, {
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
        siteUrlAPI.get('/sanctum/csrf-cookie')
          .then(response => {
            siteUrlAPI.post('/login', {
              email: payload.email,
              password: payload.password,
            })
              .then(resp => {
                // console.log(resp.data)
                siteUrlAPI.get('/api/user')
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

    userLogout ({ commit }) {
      return new Promise((resolve, reject) => {
        siteUrlAPI.get('/sanctum/csrf-cookie')
          .then(resp => {
            siteUrlAPI.post('/logout')
              .then(() => {
                localStorage.removeItem('isAdmin')
                localStorage.removeItem('admin')
                localStorage.removeItem('isUser')
                localStorage.removeItem('isUserApproved')
                localStorage.removeItem('user')
                localStorage.removeItem('callrail_calls')
                localStorage.removeItem('companies')
                commit('USER_LOGOUT')
                resolve()
              })
          })
          .catch(error => {
            reject(error.data)
          })
      })
    },

    userRegister ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        siteUrlAPI.get('/sanctum/csrf-cookie')
          .then(() => {
            siteUrlAPI.post('/api/users', {
              name: payload.name,
              email: payload.email,
              password: payload.password,
              notes: payload.notes,
              company: payload.company,
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
      siteUrlAPI
        .get('api/users')
        .then(response => {
          commit('GET_USERS', response)
        })
    },

    getCallrailCompanies ({ commit }) {
      callRailUrlAPI
        .get('/companies.json?status=active')
        .then(response => {
          localStorage.setItem('companies', JSON.stringify(response.data))
          commit('GET_CALLRAIL_COMPANIES', response.data)
        })
    },

    getProfileCallrail (context) {
      return new Promise((resolve, reject) => {
        siteUrlAPI.get('/sanctum/csrf-cookie')
          .then(() => {
            siteUrlAPI.get('/api/leads')
            .then(leads => {
              localStorage.setItem('callrail_calls', JSON.stringify(leads.data))
              context.commit('GET_CALLRAIL_CALLS', leads.data)
              resolve(leads)
            })
            .catch(error => {
              reject(error.errors)
            })
        })
      })
    },
    getUserCallrail ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        callRailUrlAPI
          .get(`/calls.json?fields=source_name,company_name,formatted_tracking_source,formatted_tracking_phone_number,note,formatted_customer_name_or_phone_number,formatted_customer_phone_number,formatted_customer_location,formatted_business_phone_number&company_id=${payload.companyId}&per_page=250&page=${payload.currentPage}`)
            .then(response => resolve(response))
            .catch(error => reject(error.errors))
        })
    },
    addFollowUp ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        siteUrlAPI.post('/api/follow-ups', {
          lead_id: payload.lead_id,
          text: payload.text,
          order: payload.order,
          date_at: new Date(payload.date),
        })
          .then(followUp => resolve(followUp))
          .catch(error => reject(error.errors))
      })
    },
    updateLeadStatus ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        siteUrlAPI.put(`/api/leads/${payload.id}`, {
          lead_id: payload.id,
          status: payload.status,
        })
          .then(lead => resolve(lead))
          .catch(error => reject(error.errors))
      })
    },
  },
})
