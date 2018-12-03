/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-12-03 11:54:21
 * @Email:  codearvin@gmail.com
 * @Filename: jewels-and-stones.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-12-04 12:21:52
 */


/**
 * Question: https://leetcode.com/problems/jewels-and-stones/
 * J represent jewels: the letters in J are guaranteed distinct
 * S represent stones
 * Letters are case sensitive
 * return how many jewels do you have
 */

// 遍历 S，检查每个字母是否在 J 中
// 这类复杂度怎么算？O(n)?
// Runtime: 56ms
const numJewelsInStones = function(J, S) {
    const len = S.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
        if (J.includes(S[i])) {
            sum++;
        }
    }
    return sum;
}

// 和 two-sum 一样，使用 hash 提高检查效率，为什么没有 includes 效率高？
// O(n)
// Runtime: 60ms
const numJewelsInStones = function(J, S) {
    const hash = {};
    const Jlen = J.length;
    const Slen = S.length;
    let sum = 0;
    for (let i = 0; i < Jlen; i++) {
        hash[J[i]] = i;
    }
    for (let i = 0; i < Slen; i++) {
        if (hash[S[i]] !== undefined) {
            sum++;
        }
    }
    return sum;
}

// 正则检查复杂度不知道多少，可能正则检测比较费时
// O(n)
// Runtime: 92ms
const numJewelsInStones = function(J, S) {
    const regex = new RegExp(`[${J}]`);
    const len = S.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
        if (regex.test(S[i])) {
            sum++;
        }
    }
    return sum;
}
