import axios from 'axios'
import router from '@/router'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '@/stores'


// import api from '@/api/index.js'
// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 使用环境变量
  timeout: parseInt(import.meta.env.VITE_TIMEOUT, 10), // 使用环境变量
})

const getNewToken = () => {
  return axios({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_TIMEOUT, 10),
    url: '/refreshToken',
    method: 'post',
    data: {
      refreshToken: useUserStore().refreshToken,
    },
  }).then((res) => {
    useUserStore().setToken(res.data.token)
    return res.data
  })
}

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么，比如添加token
    const userStore = useUserStore()
    const token = userStore.token
    // const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log('Response Data:', response.data)
    let { success, message, code } = response.data
    // success = false
    // code = 401
    if (!success) {
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error) => {
    if(error.status === 401) {
      if(error.response.config.isRetry) {
        return Promise.reject(error)
      }
      return getNewToken().then((res) => {
        let config = error.response.config
        config.headers.Authorization = `Bearer ${res.token}`
        config.isRetry = true // 标记为重试请求
        return request(config).catch((err) => {
          console.error('Request failed after token refresh:', err)
          useUserStore().logout()
          console.log(router)
          router.replace({ name: 'login' })
          return Promise.reject(err)
        })
      })
    }
    // 对响应错误做点什么
    console.error('Request Error:', error)
    return Promise.reject(error)
  },
)

export default request
