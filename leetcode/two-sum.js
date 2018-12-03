/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-12-03 10:59:10
 * @Email:  codearvin@gmail.com
 * @Filename: two-sum.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-12-04 12:00:34
 */

/**
 * Question: https://leetcode.com/problems/two-sum/
 * Given nums = [2, 7, 11, 15], target = 9,
 * Because nums[0] + nums[1] = 2 + 7 = 9,
 * return [0, 1]
 */

// 遍历数组，检查差值是否在数组中，最直观的想法
// 要注意差值不能是当前遍历的值
// 好像是 O(n^2)，indexOf 复杂度怎么算
// Runtime: 176ms
const twoSum1 = function(nums, target) {
    const len = nums.length;
    for (let i = 0; i < len; i++) {
        const index = nums.indexOf(target - nums[i]);
        if (index !== i && index !== -1) {
            return [i, index];
        }
    }
    return [];
}

// 检查值是否存在用 hash 表效率比较高
// O(n)
// Runtime: 56ms
const twoSum2 = function(nums, target) {
    const cache = {};
    const len = nums.length;
    // 加入 hashMap，提高检索速度
    for (let i = 0; i < len; i++) {
        cache[num[i]] = i;
    }
    for (let i = 0; i < len; i++) {
        const index = cache[target - nums[i]];
        if (index !== undefined && index !== i) {
            return [i, index];
        }
    }
    return [];
}[2,7,11,15]
9

// 上面的解法遍历了两遍，其实可以在一次遍历中完成
// O(n)
// Runtime: 52ms
const twoSum3 = function(nums, target) {
    const cache = {};
    const len = nums.length;
    for (let i = 0; i < len; i++) {
        const rest = target - nums[i];
        // 这里要注意 0 也是 false
        if (cache[rest] !== undefined) {
            return [cache[rest], i];
        }
        cache[nums[i]] = i;
    }
    return [];
}
