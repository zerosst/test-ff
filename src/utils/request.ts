import Axios, { Method, ResponseType, AxiosResponse } from 'axios'
import { clear } from '@/utils/helper'

interface axiosData {
  url: string
  method: Method
  headers?: any
  json: boolean
  contentType?: string
  data?: any
  params?: any
  timeout?: number
  responseType?: ResponseType
}

// const baseURL = 'http://www.mock.com'
const axios = Axios.create({
  // baseURL,
  timeout: 60000
})
// 允许携带cookie
axios.defaults.withCredentials = true
// 请求头信息 request headers
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
// 默认使用 application/json 形式
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem('bizAccessToken')) {
      config.headers.Authorization = `Bearer ${sessionStorage.getItem('bizAccessToken')}`
    } else {
      config.headers.Authorization = 'Basic ZmtfYmFzZTpma19iYXNl'
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    // if (err.response && err.response.data) {
    //   const code = err.response.status
    //   const msg = err.response.data.message
    //   ElMessage({
    //     type: 'error',
    //     message: `Code: ${code}, Message: ${msg}`
    //   })
    // } else {
    //   ElMessage({
    //     type: 'error',
    //     message: err
    //   })
    // }
    return Promise.reject(err)
  }
)

/** *
 * axios({url,method,content,params,datas})
 *
 * @param {string}  url，(必填)
 * @param {string}  method,默认post
 * @param {boolean} json, content-type类型，(必填)
 * @param {object}  params
 * @param {object}  datas  //token在datas中
 *
 */
export default function request(arr: axiosData) {
  return new Promise<any>((resolve, reject) => {
    axios({
      timeout: 60000, // 请求超时时间
      // timeout: arr.timeout === undefined ? 10000 : arr.timeout, // 请求超时时间
      url: arr.url,
      method: arr.method || 'POST',
      headers: {
        // eslint-disable-next-line no-nested-ternary
        'content-type': arr.contentType ? arr.contentType : arr.json ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      params: arr.params || '',
      data: arr.data || '',
      responseType: arr.responseType || 'json'
    })
      .then((response: AxiosResponse<any>) => {
        /**
         * response格式
         *
         * {
          data:{},
          status:200,
          statusText:'OK',//从服务器返回的http状态文本
          headers: {},//响应头信息
          config: {} //`config`是在请求的时候的一些配置信息
        }
         */
        const responseStatus = `${response.status}`
        // 状态码2开头的处理逻辑
        if (responseStatus.charAt(0) === '2') {
          if (response.data.code === '10000') {
            resolve(response.data)
          } else {
            ElMessage({
              type: 'warning',
              message: response.data.msg
            })
            resolve(response.data)
            // reject(response.data)
          }
        } else {
          ElMessage({
            type: 'error',
            message: response.data.msg
          })
          reject(response.data)
        }
      })
      .catch((err) => {
        const responseStatus = `${err.response.status}`
        if (responseStatus === '424') {
          ElMessage({
            type: 'error',
            message: '登录信息已失效，请使用新的信息登录！'
          })
          clear()
          let type = process.env.NODE_ENV === 'production' ? '/biz/' : '/'
          // window.location.href = window.location.origin + type
        } else if (responseStatus === '403') {
          ElMessage({
            type: 'error',
            message: '您未被授权'
          })
        } else {
          ElMessage({
            type: 'error',
            message: err.response.data.msg
          })
        }
        reject(err)
      })
  })
}
