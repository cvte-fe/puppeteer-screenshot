/**
 * [isHttp isHttp]
 * 判断字符串是否是http
 */
export function isHttp(urlString) {
  if (!urlString) {
    return false;
  }

  var httpReg = /^(http||https):\/\//;
  return httpReg.test(urlString);
}
