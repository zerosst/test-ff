export interface ObjectStringType {
  readonly [key: string]: string
}

export interface ObjectAnyType {
  [key: string]: any
}

export interface ObjectFileType {
  file: File
}

export interface ObjectPageType {
  page: string
  type: string
  id?: string
  row?: any
}

export interface ResponseDataType {
  status: number
  msg: string
  code: string
  data: any
  success: boolean
}
export interface parameterType {
  id: string
  parameterKey: string
  modelId: string
  code?: string
  className?: string
  classField?: string
}

export interface fileType {
  name: string
  url: string
  type: string
  fullname?: string
}

export interface optionsType {
  value: string
  label: string
  alias?: string
}

export interface bankAccountType {
  accountBank: string,
  accountName: string,
  accountNum: string,
  accountSubBank: string,
  accountType: string,
  bankNum: string,
  isOwn: string,
  inputAmt?: number
  transAmt?: number
  failReason?: string
  transStatus?: string
  accountId?: string
  corpId?: string
}

export interface dictionaryType {
  dicCode: string,
  dicName: string,
  id: string,
  itemCode: string,
  itemValue: string,
}
