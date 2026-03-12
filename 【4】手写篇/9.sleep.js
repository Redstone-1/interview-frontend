// 手写实现一个sleep函数

function sleep(delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, delay)
  })
}
