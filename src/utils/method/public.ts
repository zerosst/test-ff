const toFixedFix = function (n: any, prec: any) {
  var k = Math.pow(10, prec);
  return '' + Math.ceil(n * k) / k;
}
/**
 * @description 金额格式化
 * @param number 要格式化的数字
 * @param decimals 保留几位小数
 * @param dec_point 小数点符号
 * @param thousands_sep 千分位符号
*/
export function Amt(number: any, decimals: any, dec_point: any = '.', thousands_sep: any = ',') {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  const prec = !isFinite(+decimals) ? 2 : Math.abs(decimals)
  const sep = thousands_sep
  const dec = dec_point
  const s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/;
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, "$1" + sep + "$2");
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
/**
 * @description 取消金额格式化
 * @param amt 格式化过的金额 (100,000,00.00)
*/
export function unAmt(amt: any) {
  return parseFloat(amt.replace(/[^\d\.-]/g, ""));
}

/** 
* @description 金额格式化获取当前时间 往前 往后几天的日期
* @param AddDayCount 需要计算往前 或者 往后的天数，往前填负数
* console.log( "一月后：" +GetDateStr(30));console.log( "一月前：" +GetDateStr(-30));
*/
//补零操作
function addZero(date: any) {
  if (date < 10) { return "0" + date }
  return date
}
export function GetDateStr(AddDayCount: any) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = addZero(dd.getMonth() + 1); //补零操作
  var d = addZero(dd.getDate()); //补零操作
  return y + "-" + m + "-" + d;
}