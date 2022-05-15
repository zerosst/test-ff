import moment from 'moment'
import numeral from 'numeral'
import _ from 'lodash'

//登出清空指定信息
export const clear = () => {
  sessionStorage.removeItem('bizAuthedRoutes')
  sessionStorage.removeItem('bizAccessToken')
  sessionStorage.removeItem('bizNickName')
  sessionStorage.removeItem('bizAuth')
  sessionStorage.removeItem('bizUid')
  sessionStorage.removeItem('checked')
}
// 回显数据字典
export function getDictValue(datas: { itemCode: string; itemValue: string }[], key: string) {
  let val = ''
  datas?.map((i: { itemCode: string; itemValue: string }) => {
    if (i.itemCode == key) {
      val = i.itemValue
    }
  })
  return val
}
//日期格式化
export function formatTime(time: string, format = 'YYYY-MM-DD') {
  return moment(time).format(format)
}
//金额格式化 | 可以用于百分比
export function formatMoney(money: string | number, format = '0,0.00') {
  return numeral(money).format(format)
}

export const debounce = (func: any, delay = 3000) => _.debounce(func, delay)

export const throttle = (func: any, delay = 3000) => _.throttle(func, delay)
