// 手写实现一个节流函数

function throttle(fn, delay = 1000) {
  let timer = null

  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...args)
        timer = null
      }, delay)
    }
  }
}
