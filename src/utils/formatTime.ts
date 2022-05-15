import moment from 'moment'

export function formatTime(time: string, format = 'YYYY-MM-DD') {
  return moment(time).format(format)
}
