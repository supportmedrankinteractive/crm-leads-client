// =========================================================
// * Vuetify Material Dashboard PRO - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard-pro
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import store from './store'
import { initialize } from './services/route-checker'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import './plugins/vue-world-map'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import axios from 'axios'

axios.defaults.withCredentials = true

Vue.config.productionTip = false

// Vue.mixin({
//   created: function () {
//     axios.interceptors.response.use(undefined, function (err) {
//       return new Promise(function (resolve, reject) {
//         if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
//         // if you ever get an unauthorized, logout the user
//           this.$store.dispatch('userLogout')
//         // you can also redirect to /login if needed !
//         }
//         throw err
//       })
//     })
//   },
// })

initialize(store, router)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
