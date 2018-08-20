/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-21 01:39:31
 * @Email:  codearvin@gmail.com
 * @Filename: singleMessage.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-21 01:40:55
 * @description: 基于 antd message 组件封装的，解决了提示框爆炸的问题
 */



/**
  * singleMessage: 同一个消息只能同时显示一个，通过key来标示，content生成hash作为key
  * 对antd的message的拓展，拥有相同的API
  * notes:
  *  1. 直接传入key和使用content生成hash作为key，两个哪个更好一些？
  *  这里选择使用hash作为key，这样改的话比较好改，直接全局替换，引用就好了
  * @type {Object}
  */
import {message} from 'antd';
import {getVariableType, getHashCode, getReactElementText} from './util';

const messageKeys = {};
const singleMessage = {};

const changeMessageStatus = (key, status) => {
    messageKeys[key] = status;
};

['success', 'error', 'info', 'warning', 'loading'].forEach((prop) => {
    singleMessage[prop] = (content, duration = 3, onClose) => {
        let key;
        // 处理传入文本 和 React Element 的情况
        if (getVariableType(content) !== '[object String]') {
            key = getReactElementText(content);
        } else {
            key = getHashCode(content);
        }

        if (!messageKeys[key]) {
            changeMessageStatus(key, true);
            message[prop](content, duration, () => {
                changeMessageStatus(key, false);
                onClose && onClose();
            });
        }
    }
});

export default singleMessage;
