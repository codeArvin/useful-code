// 递归问题
// fibonacc 数列

// let cache = [];
//
// const fibonacc = (num) => {
//   if (num === 1 || num === 2) {
//     return 1;
//   }
//   if (!cache[num]) {
//     cache[num] = fibonacc(num - 1) + fibonacc(num - 2);
//   }
//   return cache[num];
// }
// let i = 1;
// while (i < 1001) {
//   let start = new Date();
//   const result = fibonacc(i++);
//   let end = new Date();
//   console.log(i, ': ', result, 'compute time: ', end - start);
// }
// console.log(cache);

// 动态规划，最少硬币找零问题
// function MinCoinCharge (coinsArr) {
//   let coins = coinsArr;
//   let cache = [];
//   // 返回包含应找硬币的数组
//   this.makeCharge = (amount) => {
//     if (!amount) { return [] }
//     if (cache[amount]) { return cache[amount]}
//     let min = [], newMin, newAmount;
//     for (let i = 0; i < coins.length; i++) {
//       const coin = coins[i];
//       newAmount = amount - coin;
//       if (newAmount >= 0) {
//         newMin = this.makeCharge(newAmount);
//         if ((newMin.length < min.length -1) || min.length === 0) {
//           min = [coin].concat(newMin);
//         }
//       }
//     }
//     return cache[amount] = min;
//   }
//
//   // 返回最少硬币数和各个硬币的个数
//   this.formatCharge = (amount) => {
//     const coins_arr = this.makeCharge(amount);
//     let result = {};
//     coins_arr.forEach(coin => {
//       if (Object.keys(result).indexOf(`${coin}`) === -1) {
//         result[coin] = 1;
//       } else {
//         result[coin]++;
//       }
//     });
//     return {
//       count: coins_arr.length,
//       coins: result,
//     };
//   }
// }
//
// let minCoinCharge = new MinCoinCharge([1,5,10,25]);
// console.log(minCoinCharge.makeCharge(36), minCoinCharge.formatCharge(36));

// 贪心算法
// 最少硬币找零问题i
// function MinCoin(coinsArr) {
//   let coins = coinsArr;
//
//   this.getCharge = (amount) => {
//     let charge = [];
//     let total = 0;
//     for (let i = coins.length - 1; i >= 0; i--) {
//       let coin = coins[i];
//       while (total + coin <= amount) {
//         charge.push(coin);
//         total += coin;
//       }
//     }
//     return charge;
//   }
// }
//
// const minCoin = new MinCoin([1,5, 9, 10,25]);
// console.log(minCoin.getCharge(18));
