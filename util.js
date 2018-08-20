/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-21 01:29:27
 * @Email:  codearvin@gmail.com
 * @Filename: util.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-21 01:39:11
 * @description: 一些小的工具函数
 */


/**
 * 生成像 Excel 表头那样的字母序列
 * 从右向左数，
 * index变化 26^0 次第一个位置变化一次，
 * index变化 26^1 次第二个位置变化一次，
 * index变化 26^2 次第三个位置变化一次，
 * 以此类推。
 * 所以当前index的数值(起始index为0)就代表了当前对应Title最右侧位置的字母变化数。利用递归就可以求出所有位置对应的字母
 *
 * @method createExcelLikeString
 * @param  {number}              index 在表头的位置，从 0 开始
 * @return {string}                    对应位置的字母
 */
function createExcelLikeString(index) {
    let str = '';
    if (index >= 26) {
        str = createExcelLikeString(index / 26 - 1);
        str += String.fromCharCode(index % 26 + 65);
    } else {
        str += String.fromCharCode(index + 65);
    }
    return str;
}


/**
 * 返回变量的类型
 *
 * @param  {variable} variable js 变量
 * @return {string}          [object Array] [object Object] 这种
 */
export const getVariableType = variable => Object.prototype.toString.call(variable);


/**
* 获取字符串的哈希值, 网上找的
*
* @param {String} str
* @param {Boolean} caseSensitive
* @return {Number} hashCode
*/
export const getHashCode = (str,caseSensitive) => {
    if(!caseSensitive){
        str = str.toLowerCase();
    }
    // 1315423911=b'1001110011001111100011010100111'
    var hash = 1315423911,i,ch;
    for (i = str.length - 1; i >= 0; i--) {
        ch = str.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }

    return  (hash & 0x7FFFFFFF);
};


/**
 * React Element 的 props.children 属性下存放该元素的子元素
 * 只有一个子元素的时候 children 就是这个子元素
 * 多个子元素的时候 children 是一个数组，分别存放每个子元素
 * 获取 React Element 全部文本
 *
 * @param  {object} re React Element
 * @return {string}    全部文本
 */
export const getReactElementText = (re) => {
    const { children } = re.props;
    const type = getVariableType(children);
    if (type === '[object String]') {
        return re.props.children;
    } else if (type === '[object Array]') {
        const len = children.length;
        let str = '';
        for (let i = 0; i < len; i++) {
            const child = children[i];
            if (getVariableType(child) === '[object String]') {
                str += child;
            } else {
                str += getReactElementText(child);
            }
        }
        return str;
    } else {
        return '';
    }
};


/**
 * Promise.all 可以让多个 promise 并发执行，但是必须等到所有结果返回后才会统一返回结果
 * 而对于并发网络请求，有时候我们希望多个请求并发，但是不要结果一起返回，而是返回一个就执行一个的逻辑
 * 经过 promiseAllEnhance 的包装后传入 Promise.all 就可以达到这样的效果
 *
 * @param  {Array} arr
 * [
 *  {
 *      promise: () => promise(), // 一个返回你要执行的promise结果的函数
 *      cb: (result) => {} // 回调函数，参数是promise返回的结果
 *  }
 * ]
 * @return {Array}     [undefined, undefined,...]
 */
export function promiseAllEnhance(arr) {
    return arr.map(function(item) {
        return new Promise(async function(resolve) {
            resolve();
            const result = await item.promise();
            item.cb(result);
        });
    });
}


/**
 * 字符串长度过长显示省略号
 *
 * @param  {string}  str    要处理的字符串
 * @param  {number}  length 长度
 * @return {string}        处理后的字符串
 */
export function strEllipsis(str, length) {
    if (str.length > length) {
        str = `${str.slice(0, length)} ...`;
    }
    return str;
}
