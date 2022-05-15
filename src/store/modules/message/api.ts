import request from '@/utils/request'

const serverApi = {
  personalCount: '/api/fin/message/manager/sys/personal/count'
}

class Service {
  /**
   * @description POST 未读消息条数
   */
  static personalList() {
    return request({
      url: serverApi.personalCount,
      method: 'POST',
      json: true,
      data: {}
    }).then((res) => {
      if (res.status === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default Service
