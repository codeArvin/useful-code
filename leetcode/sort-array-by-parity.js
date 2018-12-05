/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-12-06 01:16:13
 * @Email:  codearvin@gmail.com
 * @Filename: sort-array-by-parity.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-12-06 01:23:45
 */


/**
 * Question: https://leetcode.com/problems/sort-array-by-parity/
 * 一个数组，元素都是非负整数，返回偶数在前，奇数在后的新数组
 */

// O(n)
// Runtime: 100ms
const sortArrayByParity = function(A) {
    const odd = [];
    const even = [];
    A.forEach(n => {
       if (n % 2 === 0) {
           even.push(n);
       } else {
           odd.push(n);
       }
    });
    return [...even, ...odd];
    // 下面这种写法 Runtime: 84ms
    // 是因为 ... 这种写法转译成 es5 的写法后会更耗时吗？
    // 如果以后真正支持这种写法后会好一点吗？
    // return even.concat(odd);
};

// O(n)
// Runtime: 80ms
const sortArrayByParity = function(A) {
    const result = [];
    A.forEach(n => {
       if (n % 2 === 0) {
           result.unshift(n);
       } else {
           result.push(n);
       }
    });
    return result;
};
