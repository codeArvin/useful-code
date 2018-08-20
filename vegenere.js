/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-20 11:41:34
 * @Email:  codearvin@gmail.com
 * @Filename: vegenere.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-20 11:44:09
 * @description: 维吉尼亚密码的解密，近代密码学的作业，有待整理。直接调用vegenere就可以
 */


const passward = 'KCCPKBGUFDPHQTYAVINRRTMVGRKDNBVFDETDGILTXRGUDDKOTFMBPVGEGLTGCKQRACQCWDNAWCRXIZAKFTLEWRPTYCQKYVXCHKFTPONCQQRHJVAJUWETMCMSPKQDYHJVDAHCTRLSVSKCGCZQQDZXGSFRLSWCWSJTBHAFSIASPRJAHKJRJUMVGKMITZHFPDISPZLVLGWTFPLKKEBDPGCEBSHCTJRWXBAFSPEZQNRWXCVYCGAONWDDKACKAWBBIKFTIOVKCGGHJVLNHIFFSQESVYCLACNVRWBBIREPBBVFEXOSCDYGZWPFDTKFQIYCWHJVLNHIQIBTKHJVNPIST ';

const testStr = 'KOOMMACOMOQEGLXXMQCCKUEYFCURYLYLIGZSXCZVBCKMYOPNPOGDGIAZTXDDIAKNVOMXHIEMRDEZVXBMZRNLZAYQIQXGKKKPNEVHOVVBKKTCSSEPKGDHXYVJMRDKBCJUEFMAKNTDRXBIEMRDPRRJBXFQNEMXDRLBCJHPZTVVIXYETNIIAWDRGNOMRZRREIKIOXRUSXCRETVZAOZYGYUKNDWPIOUORIYRHHBZXRCEAYVXUVRXKCMAXSTXSEPBRXCS1RUKVBXTGZUGGDWHXMXCSXBIKTNSLRJZHBXMSPUNGZRGKUDXNAUFCMRZXJRYWYM';

const C1 = 'KOOMMACOMOQEGLXXMQCCKUEYFCURYLYLIGZSXCZVBCKMYOPNPOGDGIAZTXDDIAKNVOMXHIEMRDEZVXBMZRNLZAYQIQXGKKKPNEVHOVVBKKTCSSEPKGDHXYVJMRDKBCJUEFMAKNTDRXBIEMRDPRRJBXFQNEMXDRLBCJHPZTVVIXYETNIIAWDRGNOMRZRREIKIOXRUSXCRETV';

const C2 = 'ZAOZYGYUKNDWPIOUORIYRHHBZXRCEAYVXUVRXKCMAXSTXSEPBRXCS1RUKVBXTGZUGGDWHXMXCSXBIKTNSLRJZHBXMSPUNGZRGKUDXNAUFCMRZXJRYWYM';

const encode = 'i learned how to calculate the amount of paper needed for a room when i was at school you multiply the square footage of the walls by the cubiccontents of the floor and ceiling combined and double it you then allow half the total for openings such as windows and doors then you allow the other half for matching the pattern then you double the whole thing again to give a margin of error and then you order the paper';

const LetterFrequency = [0.08167, 0.01492, 0.02782, 0.04253, 0.12702, 0.02228, 0.02015, 0.06094, 0.06966, 0.00153, 0.00772, 0.04025,
         0.02406, 0.06749, 0.07507, 0.01929, 0.00095, 0.05987, 0.06327, 0.09056, 0.02758, 0.00978, 0.02360, 0.00150,
         0.01974, 0.00074];

// 因式分解
function factoring(number) {
  let number_raw = number;
  let factor = 2;
  let arr = [];
  while (number > factor) {
    if (number % factor === 0) {
      arr.push(factor);
      number /= factor;
    } else {
      factor++;
    }
  }
  arr.push(factor);
  let str = '';
  arr.forEach(num => {
    if (str === '' ) {
      str += num;
    } else {
      str += '*' + num;
    }
  });
  return (number_raw+'='+str);
}

// 获取子串在字符串中所有位置
function getStrPositions(str, subStr) {
  let arr = [];
  let index = 0;
  let len = str.length;
  let findIndex = 0;
  while (index < len) {
    findIndex = str.indexOf(subStr, index);
    if (findIndex !== -1) {
      arr.push(findIndex);
      index = findIndex+1;
    }
    if (findIndex === str.lastIndexOf(subStr)) {
      break;
    }
  }
  return arr;
}

// 获取字符串中长度为n的重复子串前两个的距离及其因式分解
function getDistance(str, n) {
  let index = 0;
  let len = str.length;
  let out = {};
  while (index + n < len) {
    let subStr = str.slice(index, index + n);
    let arr = getStrPositions(str, subStr);
    if (arr.length > 1) {
      out[subStr] = arr;
    }
    index++;
  }
  let result = {};
  for (let key in out) {
    result[key] = factoring(out[key][1] - out[key][0]);
  }
  return result;
}

// 把字符串分成n组
function group(str, n) {
  let out = [];
  let len = str.length;
  for (let i = 0; i < n; i++) {
    let index = i;
    let sum = '';
    while (index < len) {
      sum += str[index];
      index += n;
    }
    out.push(sum);
  }
  return out;
}

// 计算字符串的重合指数估计值CI
function CI(str) {
  let arr = [];
  for (let i = 65; i < 91; i++) {
    let char = String.fromCharCode(i);
    arr.push(getStrPositions(str, char).length);
  }
  const total = arr.reduce((a,b) => (a+b));
  let result = 0;
  arr.forEach(num => {
    result += (num*(num-1))/(total*(total-1));
    // result += (num/total)**2;
  });
  return result;
}

// 拟重合指数
function fakeCI(str) {
  let arr = [];
  for (let i = 65; i < 91; i++) {
    let char = String.fromCharCode(i);
    arr.push(getStrPositions(str, char).length);
  }
  const total = arr.reduce((a,b) => (a+b));
  let result = 0;
  arr.forEach((num,index) => {
    result += (num*LetterFrequency[index])/(total);
  });
  return result;
}

// 返回位移后的字母,必须大写
function shiftChar(str, num) {
  let charCode = str.charCodeAt(0)+num;
  if (charCode > 90) {
    charCode -= 26;
  }
  return String.fromCharCode(charCode);
}

// 查看重复字符串因式分解情况
function getFactorResult(str) {
  console.log('长度为3的重复子串距离及其因式分解\n', getDistance(str, 3));
  console.log('长度为4的重复子串距离及其因式分解\n', getDistance(str, 4));
  console.log('长度为5的重复子串距离及其因式分解\n', getDistance(str, 5));
}

// 估计密码长度，查看其重合指数估计值CI
function getCIInfo(str,num) {
  const groupArr = group(str,num);
  let CIInfo = [];
  groupArr.forEach(str => {
    CIInfo.push(CI(str));
  });
  let total = CIInfo.reduce((a,b)=>(a+b));
  let average = total/CIInfo.length;
  console.log('分成'+num+'组，平均CI指数:', average);
}

// 将字符串分组并位移25次，查看每次位移后的重合指数中最大的
function shiftAndShowCI(str, num) {
  const groupArr = group(str, num);
  let result = [];
  let result1 = [];
  for (let n = 0; n < num; n++) {
    console.log(n+'------------------------------\n',groupArr[n]);
    let max = 0;
    let maxIndex = -1;
    for (let i = 0; i < 26; i++) {
      const char = groupArr[n].split('').map(str => shiftChar(str, i)).join('');
      const CIInfo = fakeCI(char);
      if (CIInfo > max) {
        max = CIInfo;
        maxIndex = i;
      }

    }
    console.log(n+':','位移:',maxIndex,'伪重合指数:',max);
  }
}

// 传入字符串和密钥数组，输出解密后的字符串
function decode(str, shiftArr) {
  const length = shiftArr.length;
  str = str.toUpperCase();
  const groupArr = group(str, length);
  let result = [];
  for (let i = 0; i < length; i++) {
    result.push(groupArr[i].split('').map(str => shiftChar(str, shiftArr[i])).join(''));
  }
  let out = '';
  const len = result[0].length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < length; j++) {
      if (result[j][i] !== undefined) {
        out += result[j][i];
      }
    }
  }
  console.log('密文:\n',str,'\n原文:\n',out.toLowerCase());
}

function keyToArr(key) {
  let charArr = [];
  for (let i = 65; i < 91; i++) {
    charArr.push(String.fromCharCode(i));
  }
  let out = [];
  key.toUpperCase().split('').forEach(str => {
    out.push(charArr.indexOf(str));
  });
  return out;
}

function vegenere(passward) {
  console.log('查看重复子串的距离及其因式分解\n');
  getFactorResult(passward);
  console.log('根据因式确定可能的密钥长度，这里选取2～10\n');
  for (let i = 2; i <= 10; i++) {
    getCIInfo(passward, i);
  }
  console.log('确定密钥长度为6');
  console.log('分成6组，每组位移25次，伪重合指数最大的即为对应的密钥字母\n');
  shiftAndShowCI(passward,6);
  console.log('确定密钥为yjclhm，解密\n');
  decode(passward, keyToArr('yjclhm'));
  console.log('手动断句后: ', encode);
}

vegenere(passward);
