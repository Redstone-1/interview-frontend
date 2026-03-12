// 手写一个任务队列

class RequestQueue {
  /**
   * 创建一个请求队列实例
   * @param {Object} options 配置选项
   * @param {number} options.concurrency 最大并发数，默认 1
   * @param {number} options.sortBypriority 是否需要优先级排序
   * @param {number} options.maxRetryTimes 默认重试次数，默认 0
   * @param {number} options.retryDelay 重试延迟(ms)，默认 0
   */
  constructor({ concurrency = 1, sortByPriority = false, maxRetryTimes = 0, retryDelay = 0 } = {}) {
    this.concurrency = concurrency
    this.sortByPriority = sortByPriority
    this.maxRetryTimes = maxRetryTimes
    this.retryDelay = retryDelay
    this.queue = [] // 存储队列任务 { fn, priority, resolve, reject, maxRetryTimes }
    this.running = 0 // 当前运行的任务数
    this.isPaused = false // 是否暂停状态
    this.isDestroyed = false // 是否已销毁
  }

  /**
   * 向队列添加任务
   * @param {Function} fn 异步任务函数，需返回Promise
   * @param {Object} options 任务选项
   * @param {number} options.priority 优先级，数字越小优先级越高，默认0
   * @param {number} options.maxRetryTimes 该任务的重试次数，覆盖默认设置
   * @returns {Promise} 返回一个Promise，在任务完成时 resolve/reject
   */
  add(fn, { priority = 0, maxRetryTimes } = {}) {
    if (priority < 0) {
      throw new Error("priority cant be under 0")
    }

    if (this.isDestroyed) {
      return Promise.reject(new Error("RequestQueue has been destroyed"))
    }

    return new Promise((resolve, reject) => {
      // 添加任务到队列
      this.queue.push({
        fn,
        priority,
        maxRetryTimes: maxRetryTimes ?? this.maxRetryTimes, // 优先使用任务指定的重试次数
        resolve,
        reject,
        _curRetryTimes: 0 // 已重试次数
      })

      if(this.sortByPriority) {
        // 按优先级排序队列
        this.queue.sort((a, b) => a.priority - b.priority)
      }

      // 尝试执行任务
      this.processQueue()
    })
    .catch(e => console.error(e))
  }

  /**
   * 处理队列中的任务
   */
  processQueue() {
    // 如果暂停、销毁或达到最大并发数，则不执行新任务
    if (this.isPaused || this.isDestroyed || this.running >= this.concurrency) {
      return
    }

    // 从队列头部取出任务
    const task = this.queue.shift()
    if (!task) return

    this.running++

    // 执行任务
    Promise.resolve()
      .then(() => {
        return task.fn()
      })
      .then(result => {
        // 任务成功，调用resolve
        task.resolve(result)
        this.running--
        this.processQueue() // 继续处理下一个任务
      })
      .catch(error => {
        // 任务失败，如果还有重试次数则重试
        if (task._curRetryTimes < task.maxRetryTimes) {
          task._curRetryTimes++
          // 延迟重试
          setTimeout(() => {
            this.queue.unshift(task) // 将任务放回队列头部
            this.running--
            this.processQueue()
          }, this.retryDelay)
        } else {
          // 重试次数用尽，调用reject
          task.reject(error)
          this.running--
          this.processQueue()
        }
      })
  }

  /**
   * 暂停队列
   */
  pause() {
    this.isPaused = true
  }

  /**
   * 恢复队列
   */
  resume() {
    if (!this.isPaused) return
    this.isPaused = false
    this.processQueue() // 恢复后立即处理队列
  }

  /**
   * 清空队列
   * @param {boolean} rejectPending 是否拒绝所有未执行的任务，默认true
   */
  clear(rejectPending = true) {
    if (rejectPending) {
      this.queue.forEach(task => {
        task.reject(new Error("Request cancelled by clear()"))
      })
    }
    this.queue = []
  }

  /**
   * 销毁队列
   * @param {boolean} rejectPending 是否拒绝所有未执行的任务，默认true
   */
  destroy(rejectPending = true) {
    this.clear(rejectPending)
    this.isDestroyed = true
  }

  /**
   * 获取队列状态
   * @returns {Object} 包含队列状态信息
   */
  getStatus() {
    return {
      pending: this.queue.length,
      running: this.running,
      paused: this.isPaused,
      destroyed: this.isDestroyed,
      concurrency: this.concurrency
    }
  }

  /**
   * 修改并发数
   * @param {number} concurrency 新的并发数
   */
  setConcurrency(concurrency) {
    this.concurrency = concurrency
    this.processQueue() // 可能需要立即处理更多任务
  }
}
