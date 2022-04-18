// promise 缓存与复用

function cachePromise(promise) {
  let cache = undefined;
  let fn = function (...args) {
    return (cache =
      cache ||
      promise.apply(this, args).catch((error) => {
        // 在异常时清除缓存，保证下一次重新调用程序时会再发起
        cache = undefined;
        return Promise.reject(error);
      }));
  };

  fn.deleteCache = () => (cache = undefined);
  return fn;
}

let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let fn = cachePromise(() => {
  return new Promise((resolve) => {
    console.info("call ", new Date());
    resolve(new Date());
  });
});

(async () => {
  const a = await fn();
  const b = await fn();
  console.info(a == b);

  await sleep(3000);
  const c = await fn();
  console.info(a == c);

  fn.deleteCache();
  const d = await fn();
  console.info(a == d);
})();
