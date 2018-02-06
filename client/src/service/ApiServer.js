import Http from 'axios'
// 请求类
class ApiService {
  constructor () {
    this.interceptorsOfReq()
    this.interceptorsOfRes()
  }

  get (url, params) {
    if (params) {
      return Http.get(url, {params}).then(res => res.data)
    }
    return Http.get(url).then(res => res.data)
  }

  post (url, params = {}) {
    return Http.post(url, params).then(res => res.data)
  }

  setDefaultHeader (token) {

  }

  interceptorsOfReq () {
    return Http.interceptors.request.use(
      config => {
        return config
      },
      err => {
        return Promise.reject(err)
      })
  }

  interceptorsOfRes () {
    Http.interceptors.response.use(function (response) {
      return response
    }, function (error) {
      return Promise.reject(error)
    })
  }
}

// 导出一个对象
export default new ApiService()
