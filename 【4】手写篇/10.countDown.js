// 手写实现一个倒计时函数

function countDown(num) {
  if (num <= 0) {
    console.log("count down end")
    return
  }

  const timer = setInterval(() => {
    const result = num--
    console.log(result)
    if (result <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

countDown(5)
