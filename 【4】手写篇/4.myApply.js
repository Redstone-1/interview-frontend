// 手写实现一个apply函数

Function.prototype.myApply = function(context, args = []) {
  context = context || window
  const fn = Symbol("fn")
  context[fn] = this // 被借调函数自身
  const result = context[fn](...args)
  delete context[fn]
  return result
}
