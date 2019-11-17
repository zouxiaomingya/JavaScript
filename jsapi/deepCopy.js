function deepCopy(ori) {
  const type = getType(ori);
  let copy;
  switch (type) {
    case "array":
      return copyArray(ori, type, copy);
    case "object":
      return copyObject(ori, type, copy);
    case "function":
      return copyFunction(ori, type, copy);
    default:
      return ori;
  }
}

function copyArray(ori, type, copy = []) {
  for (const [index, value] of ori.entries()) {
    copy[index] = deepCopy(value);
  }
  return copy;
}

function copyObject(ori, type, copy = {}) {
  for (const [key, value] of Object.entries(ori)) {
    copy[key] = deepCopy(value);
  }
  return copy;
}

function copyFunction(ori, type, copy = () => {}) {
  const fun = eval(ori.toString());
  fun.prototype = ori.prototype;
  return fun;
}

function deepCopy(target) {
  let copyed_objs = []; //此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
  function _deepCopy(target) {
    if (typeof target !== "object" || !target) {
      return target;
    }
    for (let i = 0; i < copyed_objs.length; i++) {
      if (copyed_objs[i].target === target) {
        return copyed_objs[i].copyTarget;
      }
    }
    let obj = {};
    if (Array.isArray(target)) {
      obj = []; //处理target是数组的情况
    }
    copyed_objs.push({ target: target, copyTarget: obj });
    Object.keys(target).forEach(key => {
      if (obj[key]) {
        return;
      }
      obj[key] = _deepCopy(target[key]);
    });
    return obj;
  }
  return _deepCopy(target);
}
