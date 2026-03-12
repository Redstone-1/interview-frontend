// 手写实现一个bind函数

Function.prototype.myBind = function(context, ...args) {
  return (...rest) => {
    return this.apply(context, [...args, ...rest])
  }
}
