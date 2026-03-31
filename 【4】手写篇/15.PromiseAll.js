function PromiseAll(promises) {
  // 非可迭代对象直接报错
  if (!promises[Symbol.iterator]) {
    return Promise.reject(new TypeError('argument is not iterable'));
  }

  return new Promise((resolve, reject) => {
    const result = [];
    let count = 0;

    promises.forEach((promise, index) => {
      // 包装成 Promise，兼容普通值
      Promise.resolve(promise)
        .then(res => {
          result[index] = res;
          count++;
          // 全部完成才 resolve
          if (count === promises.length) {
            resolve(result);
          }
        })
        .catch(err => {
          // 任一失败直接 reject
          reject(err);
        });
    });
  });
}
