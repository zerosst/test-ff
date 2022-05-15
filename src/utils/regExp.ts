/** 手机号 */
export const PHONE: RegExp = /^1[3-9]\d{9}$/

/** 邮箱 */
export const MAIL: RegExp = /^[a-zA-Z0-9]+([-|_|\.]?[a-zA-Z0-9])*@([a-zA-Z0-9]+(-[a-zA-Z0-9]+)?\.)+[a-zA-Z]{2,}$/

/** 身份证 */
export const ID_CARD: RegExp = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/

/** 固定电话 */
export const PHONE_FIXED: RegExp = /^(^0\d{2}-?\d{8}$)|(^0\d{3}-?\d{7,8}$)$/

/** 社会统一信用代码 */
export const SOCIAL_CODE: RegExp = /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/

/** 传真电话 */
export const FAX_PHONE: RegExp = /^(\d{3,4}-)?\d{7,8}$/
