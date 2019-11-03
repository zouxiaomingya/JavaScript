// resolve reject state: pedding fulfilled rejected
// const promise = new Promise((resolve, reject) => {
//     // 异步处理
//     // 处理结束后、调用resolve 或 reject
// });

function getList() {
    return new Promise((resolve, reject) => {
        resolve(1)
    })
}
const promise = new Promise((resolve, reject) => {
    resolve('fulfilled'); // 状态由 pending => fulfilled
});
promise.then(result => { // onFulfilled
    console.log(result); // 'fulfilled' 
}, reason => { // onRejected 不会被调用

})

const promise = new Promise((resolve, reject) => {
    reject('rejected'); // 状态由 pending => rejected
});
promise.then(result => { // onFulfilled 不会被调用

}, reason => { // onRejected 
    console.log(reason); // 'rejected'
})

class Promise {
    constructor(fn) {
        this.fn = fn;
        this.state = 'pedding';
        this.value = undefined; // fulfilled状态时 返回的信息
        this.reason = undefined; // rejected状态时 拒绝的原因
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        fn(resolve, reject);
    }
    resolve(value) {
        setTimeout(() => {
            // 调用resolve 回调对应onFulfilled函数
            if (this.status === PENDING) {
                // 只能由pending状态 => fulfilled状态 (避免调用多次resolve reject)
                this.status = 'fulfilled';
                this.value = value;
                this.onFulfilledCallbacks.map(cb => {
                    this.value = cb(this.value)
                });
            }
        });
    }
    reject() {

    }

    then(onFulfilled, onRejected) {
        this.onFulfilledCallbacks.push(onFulfilled);
        this.onRejectedCallbacks.push(onRejected);
        return this
    }

}
