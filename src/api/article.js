// 用户相关请求模块
import request from '@/utils/request'
// 登录
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}
