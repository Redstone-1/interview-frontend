// 手写实现一个call函数

Function.prototype.myCall = function(context, ...args) {
  context = context || window
  const fn = Symbol("fn")
  context[fn] = this
  const result = context[fn](...args)
  delete context[fn]
  return result
}
