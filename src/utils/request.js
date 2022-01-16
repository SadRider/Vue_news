import axios from 'axios'
import store from '../store'

// 请求模块
const request = axios.create({
  baseURL: 'http://toutiao.itheima.net/'
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起经过这里
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  console.log(config)
  return config
}, function (error) {
  // 请求出错（请求未发出）经过这里
  return Promise.reject(error)
})

export default request
