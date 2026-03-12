// 手写实现一个new函数

function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  return (typeof result === "object" && result !== null) || typeof result === "function" ? result : obj
}
