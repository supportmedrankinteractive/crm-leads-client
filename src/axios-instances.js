import axios from 'axios'

export const callRailUrlAPI = axios.create({
  baseURL: process.env.VUE_APP_CALLRAIL_BASE_URL,
  // withCredentials: true,
  headers: {
    authorization: `Token token=${process.env.VUE_APP_CALLRAIL_TOKEN}`,
  },
})

export const siteUrlAPI = axios.create({
  baseURL: process.env.VUE_APP_AXIOS_BASE_URL,
  withCredentials: true,
})

siteUrlAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      alert('token has expired')
      this.$store.dispatch('userLogout')
      this.$router.push({ name: 'User Login' })
    }
    return Promise.reject(error)
  },
)
