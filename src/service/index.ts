import request from '@/utils/request'
import { ObjectStringType } from '@/utils/constant/type'

const COMMON_API: ObjectStringType = {
  getPreviewUrl: '/api/file/common/v1/file/read/preview',
  getDownloadUrl: '/api/file/common/v1/file/read/getDownloadUrl',
  batchDownload: '/api/file/v1/file/read/batchDownload'
}

class CommonService {
  static getPreviewUrl(id: string) {
    return request({
      url: `${COMMON_API.getPreviewUrl}?id=${id}`,
      method: 'POST',
      json: false
    }).then(res => {
      const { code, success } = res
      if (code === '10000' && success) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }

  static getDownloadUrl(id: string) {
    return request({
      url: `${COMMON_API.getDownloadUrl}?id=${id}`,
      method: 'POST',
      json: false,
      data:{ fileId: id },
      contentType: 'application/json; charset=UTF-8',
    }).then(res => {
      const { code, success } = res
      if (code === '10000' && success) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }

  static batchDownload(data: any) {
    return request({
      url: COMMON_API.batchDownload,
      method: 'POST',
      json: true,
      data
    }).then(res => {
      const { code, success } = res
      if (code === '10000' && success) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}


export default CommonService
