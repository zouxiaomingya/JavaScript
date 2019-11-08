function _asyncToGenerator(fn) {
  return function() {
    var self = this,
      args = arguments;
    // 将返回值promise化
    return new Promise(function(resolve, reject) {
      // 获取迭代器实例
      var gen = fn.apply(self, args);
      // 执行下一步
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      // 抛出异常
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      // 第一次触发
      _next(undefined);
    });
  };
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
const asyncFunc = _asyncToGenerator(function*() {
  console.log(1);
  yield new Promise(resolve => {
    setTimeout(() => {
      resolve();
      console.log("sleep 1s");
    }, 1000);
  });
  console.log(2);
  const a = yield Promise.resolve("a");
  console.log(3);
  const b = yield Promise.resolve("b");
  const c = yield Promise.resolve("c");
  return [a, b, c];
});

asyncFunc().then(res => {
  console.log(res);
});