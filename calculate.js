/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-20 11:44:28
 * @Email:  codearvin@gmail.com
 * @Filename: calculate.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-20 11:53:02
 * @description: 模拟乘法手算，这样的话，大的阶乘和乘方都可以按照正常方式来写来，就是不知道效率怎么样，有没有遗漏的地方
 */

const removeDS = str => str.replace(/[.-]/, '');
const str2arr = str => str.split('').reverse().map(str => parseInt(str));

/**
 * 整数乘法
 * @method intCalculate
 * @param  {string}     a 整数
 * @param  {string}     b 整数
 * @return {string}       result
 */
const intCalculate = (a, b) => {
    a = str2arr(a);
    b = str2arr(b);
    const a_length = a.length;
    const b_length = b.length;
    let result = [];
    const getResult = index => result[index]
        ? result[index]
        : 0;

    for (let i = 0; i < b_length; i++) {
        let carry = 0;
        for (let j = 0; j < a_length; j++) {
            // 这里要注意应该取 result 哪个位置的值
            let res = b[i] * a[j] + getResult(i + j) + carry;
            result[i + j] = res % 10;
            carry = parseInt(res / 10);
        }
        while (carry) {
            result[result.length] = carry % 10;
            carry = parseInt(carry / 10);
        }
    }

    return result.reverse().join('');
};

// 添加 小数 和 负数， a、b为字符型数字
/**
 * 实数乘法
 * @method calculate
 * @param  {string}  a 实数
 * @param  {string}  b 实数
 * @return {string}    result
 */
function calculate(a, b) {
    let start = new Date();
    // 确定结果正负号
    let sign = '';
    if ((a[0] === '-' && b[0] !== '-') || (a[0] !== '-' && b[0] === '-')) {
        sign = '-';
    }
    // 确定结果小数位数
    const _a = a.split('.');
    const _b = b.split('.');
    const a_index = _a[1]
        ? _a[1].length
        : 0;
    const b_index = _b[1]
        ? _b[1].length
        : 0;
    const index = a_index + b_index;
    const result = intCalculate(removeDS(a), removeDS(b));
    const seg = result.length - index;

    let end = new Date();
    console.log('calculate time: ', end - start, ' ms');

    return index !== 0
        ? `${sign}${result.slice(0, seg)}.${result.slice(seg)}`
        : `${sign}${result}`;
}

/**
 * 阶乘
 * @method factorial
 * @param  {number}  n
 * @return {string}    result
 */
function factorial(n) {
    var out = '1';
    for (var i = 1; i <= n; i++) {
        out = calculate(out, `${i}`);
    }
    return out;
}


/**
 * 乘方
 * @method power
 * @param  {string} str 底数
 * @param  {number} n   指数
 * @return {string}     result
 */
function power(str, n) {
    var calc = '1';
    for (var i = 0; i < n; i++) {
        calc = calculate(calc, str);
    }
    return calc;
}
