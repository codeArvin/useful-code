/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-24 05:25:53
 * @Email:  codearvin@gmail.com
 * @Filename: generator.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-30 12:24:44
 */

/**
 * 将多参数函数转化为 Thunk 函数
 * @method thunk
 * @param  {Function} fn 最后一个参数是回调函数的函数
 * @return {Function}      Thunk 函数
 */
const thunk = (fn) => (...args) => callback => fn.call(this, ...args, callback);


/**
 * 自动运行含有异步操作的 Generator 函数，yield 后面应该是 Thunk 函数
 * @method runGenThunk
 * @param  {Generator}    gen Generator
 */
const runGenThunk = (gen) => {
    const g = gen();

    const next = (err, data) => {
        if (err) throw err;
        const r = g.next(data);
        if (r.done) return;
        r.value(next);
    }

    next();
}


/**
 * 自动运行含有异步操作的 Generator 函数，yield 后面应该是 Promise
 * @method runGenPromise
 * @param  {Generator}      gen Generator
 */
const runGenPromise = (gen) => {
    const g = gen();

    const next = (data) => {
        const r = g.next(data);
        if (r.done) return r.value;
        r.value.then((data) => {
            next(data)
        });
    };

    next();
}
