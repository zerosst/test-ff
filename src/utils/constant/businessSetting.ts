import { optionsType } from '@/utils/constant/type'

export const PROTOCOL_TYPE_OPTIONS: optionsType[] = [
  { value: '1', label: '注册协议' },
  { value: '2', label: '产品协议' },
  { value: '3', label: '企业授权协议' },
  { value: '4', label: '付款承诺函' },
  { value: '5', label: '票样' },
  { value: '6', label: '融资服务协议' },
  { value: '7', label: '应收账款转让通知书' },
  { value: '8', label: '产品项下债权明细表' },
  { value: '9', label: '流转记录与流转单' },
  { value: '10', label: '付款通知书' },
  { value: '11', label: '保理业务合同' },
]

export const DATE_FORMAT_OPTIONS: optionsType[] = [
  { value: 'yyyy', label: '年' },
  { value: 'yyyyMM', label: '年月' },
  { value: 'yyyyMMdd', label: '年月日' },
]

export const SERIAL_TYPE_OPTIONS: optionsType[] = [
  { value: '%04d', label: '四位前补零', alias: '0001' },
  { value: '%05d', label: '五位前补零', alias: '00001' },
  { value: '%06d', label: '六位前补零', alias: '000001' },
  { value: '%07d', label: '七位前补零', alias: '0000001' },
]
