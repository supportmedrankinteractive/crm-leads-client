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
