import { optionsType } from '@/utils/constant/type'


export const BANK_ACCOUNT_TYPE_OPTIONS: optionsType[] = [
  { value: '2', label: '付款账户' },
  { value: '1', label: '收款账户' },
]

export const IS_DEFAULT_ACCOUNT_OPTIONS: optionsType[] = [
  { value: '1', label: '是' },
  { value: '0', label: '否' }
]

export const PAY_STATUS_OPTIONS: optionsType[] = [
  { value: '0', label: '未打款' },
  { value: '1', label: '汇款中' },
  { value: '2', label: '已到账' }
]
