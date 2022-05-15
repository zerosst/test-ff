import request from '@/utils/request'

const Api = {
  DictionariesList: '/api/sys/biz/v1/sys/dictionary/list' //字典查询
}

class Service {
  /**
   * @description POST 查询授权菜单权限
   */
  static getDicts(data: any) {
    return request({
      url: Api.DictionariesList,
      method: 'POST',
      json: true,
      data
    }).then((res) => {
      const { code, success } = res
      if (code === '10000' && success) {
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
  }
}
export default Service
