export const getSerialTypeValue = (str: string): string => {
  let res = '';
  switch (str) {
    case '%04d':
      res = '0001'
      break
    case '%05d':
      res = '00001'
      break
    case '%06d':
      res = '000001'
      break;
    case '%07d':
      res = '0000001'
      break
    default:
      res = ''
      break
  }
  return res
}
