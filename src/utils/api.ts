//公共方法接口
import request from '@/utils/request'

const serverApi = {
  readPreview: '/api/file/common/v1/file/read/preview'
}

class Service {
  /**
   * @description POST 获取预览地址
   */
  static readPreview(data: any) {
    return request({
      url: serverApi.readPreview,
      method: 'POST',
      json: true,
      params: data
    }).then((res) => {
      if (res.status === 0) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default Service
