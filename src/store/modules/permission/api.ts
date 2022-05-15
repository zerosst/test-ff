import request from '@/utils/request'

const permissionApi = {
  queryAuthedPermission: '/api/admin/sys/resource/getMenuList',
  // queryAuthedPermission: '/api/sys/resource/getMenuAll',
  queryPermissions: '/api/auth/permission/permissions'
}

class Service {
  /**
   * @description POST 查询授权菜单权限
   */
  static postAuthPermission() {
    return request({
      url: permissionApi.queryAuthedPermission,
      method: 'POST',
      json: true
    }).then((res) => {
        return res
    })
  }

  /**
   * @description POST 查询全部菜单列表
   */
  static postPermissions(data: any) {
    return request({
      url: permissionApi.queryPermissions,
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
