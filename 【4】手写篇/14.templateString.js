/**
 * 实现模板字符串解析
 * @param {string} str 带 ${} 占位符的字符串
 * @param {object} data 数据对象
 * @returns 替换后的字符串
 */
function renderTemplate(str, data) {
  // 正则匹配 ${xxx}
  return str.replace(/\$\{(\w+)\}/g, (match, key) => {
    // match = 完整匹配到的 ${name}
    // key = 括号里捕获的变量名 name
    return data[key] !== undefined ? data[key] : match;
  });
}
