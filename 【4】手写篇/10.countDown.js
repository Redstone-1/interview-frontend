// 手写实现一个倒计时函数

function countDown(num) {
  if (num <= 0) {
    console.log("倒计时开始数必须大于0")
    return
  }

  console.log(num)

  const timer = setInterval(() => {
    num--
    console.log(num)
  
    if (num <= 1) {
      clearInterval(timer)
    }
  }, 1000)
}

countDown(5)
