import dayjs from 'dayjs'

export const getDateFromNow = (type: string): string => {
  let str = 'YYYY-MM-DD'
  if (['YYYY', 'yyyy'].includes(type)) {
    str = 'YYYY'
  } else if (['YYYY-MM', 'YYYY-mm', 'yyyy-mm', 'yyyy-MM'].includes(type)) {
    str = 'YYYY-MM'
  } else if (['YYYYMM', 'YYYYmm', 'yyyyMM', 'yyyymm'].includes(type)) {
    str = 'YYYYMM'
  } else if (['YYYY-MM-DD', 'YYYY-MM-dd', 'YYYY-mm-DD', 'YYYY-mm-dd', 'yyyy-MM-dd', 'yyyy-mm-dd'].includes(type)) {
    str = 'YYYY-MM-DD'
  } else if (['YYYYMMDD', 'YYYYMMdd', 'YYYYmmDD', 'YYYYmmdd', 'yyyymmdd', 'yyyyMMdd',].includes(type)) {
    str = 'YYYYMMDD'
  }
  return dayjs().format(str);
}

export const formatDate = (date: any, type: string = 'YYYY-MM-DD HH:mm:ss') => {
  return date ? dayjs(date).format(type) : date
}
