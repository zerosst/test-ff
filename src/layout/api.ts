import request from '@/utils/request'

const serverApi = {
  ckeckActive: '/api/admin/biz/v1/user/check/active',
  userAdd: '/api/biz/v1/user/fill'
}

class Service {
  /**
   * @description POST 校验用户状态
   */
  static ckeckActive() {
    return request({
      url: serverApi.ckeckActive,
      method: 'GET',
      json: true
    }).then((res) => {
      if (res.status === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
  /**
   * @description POST 平台端补充管理员信息
   */
  static userAdd(data: any) {
    return request({
      url: serverApi.userAdd,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      if (res.status === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default Service
