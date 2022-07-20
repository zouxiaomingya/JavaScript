let isSilentLoginIng = false;
let subscribers = [];
let code = ""; // 模拟 code, 真实场景这个存放在本地内存中
let MAX_TIME = 3;
let currentLoginTime = 1;

function onAccessTokenFetched() {
  subscribers.forEach((request) => {
    request();
  });
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

// 静默登录 用户无感知,获取 token
const silentLogin = (option = {}) => {
  const { firstResolve } = option;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isBig = Math.random() > 0.5;
      console.log(isBig, "isBig>>>>>>");
      if (isBig) {
        code = "xxx1";
        console.log("code 获取成功>>>>>>");
        if (firstResolve) {
          return firstResolve();
        }
        resolve();
      } else {
        if (currentLoginTime++ < MAX_TIME) {
          console.log(`code 获取失败, 准备第${currentLoginTime}次调用`);
          silentLogin({ firstResolve: firstResolve || resolve });
        } else {
          console.log("code 最终还是失败");
          reject();
        }
      }
    }, 1000);
  });
};

const request = (params = {}) => {
  const { callback } = params;
  return new Promise((resolve, reject) => {
    if (isSilentLoginIng) {
      return addSubscriber(() => {
        request({
          ...params,
          temp: "这是队列里面的接口，我只调用过一次",
          callback: resolve,
        });
      });
    }

    // 模拟 request
    setTimeout(() => {
      console.log(params.name, "执行第一次");
      if (!code) {
        addSubscriber(() => {
          request({
            ...params,
            temp: `${params.name}第二次执行`,
            callback: resolve,
          });
        });

        if (!isSilentLoginIng) {
          isSilentLoginIng = true;
          silentLogin()
            .then(() => {
              isSilentLoginIng = false;
              console.log("code 成功获取了，开始执行队列请求>>>>>>");
              // 依次去执行缓存的接口
              onAccessTokenFetched();
            })
            .catch(() => {
              console.log(11212, "11212>>>>>>");
            });
        }
        return;
      } else {
        // 有 callback 说明是队列里面的请求， 直接 callback 返回
        if (callback) {
          return callback({ ...params });
        }
        resolve(params);
      }
    }, 100);
  });
};

// 1 2 模拟小程序上来就调用的接口
request({ name: "接口1" }).then((res) => {
  console.log(res, ">>>>>>");
});

request({ name: "接口2" }).then((res) => {
  console.log(res, ">>>>>>");
});

// 模拟用户 操作调用的接口，但是这个时候 code 身份验证 接口还没有响应完成
setTimeout(() => {
  request({ name: "接口3" }).then((res) => {
    console.log(res, ">>>>>>");
  });
}, 400);

// 模拟 code 身份校验完成后调用的接口
setTimeout(() => {
  request({ name: "接口4" }).then((res) => {
    console.log(res, ">>>>>>");
  });
}, 2000);
