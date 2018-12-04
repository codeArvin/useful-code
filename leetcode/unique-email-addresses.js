/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-12-05 01:01:18
 * @Email:  codearvin@gmail.com
 * @Filename: unique-email-addresses.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-12-05 01:32:10
 */


/**
 * Question: https://leetcode.com/problems/unique-email-addresses/
 * 给定一个邮箱数组，给每一个邮箱都发送一封邮件，计算有多少不同的地址会收到邮件
 */

// 1. 取 + 前的字符
// 2. 上一步的字符去掉 .
// O(n)
// Runtime: 108
const numUniqueEmails1 = function(emails) {
    const handledEmails = emails.map(email => {
        let [local, domain] = email.split('@');
        local = local.split('+')[0].replace(/\./g, '');
        return `${local}@${domain}`;
    });
    return new Set(handledEmails).size;
};

// 感觉 1 中 new Set() 浪费了一些时间？
// O(n)
// Runtime: 76ms
const numUniqueEmails2 = function(emails) {
    const uniqueEmails = {};
    const len = emails.length;
    let sum = 0;
    for (let i = 0; i < len; i++) {
        let [local, domain] = emails[i].split('@');
        local = local.split('+')[0].replace(/\./g, '');
        const email = `${local}@${domain}`
        if (uniqueEmails[email] === undefined) {
            uniqueEmails[email] = i;
            sum++;
        }
    }
    return sum;
};

// 2 中 split 比较浪费时间？
// O(n)
// Runtime: 68ms
const numUniqueEmails3 = function(emails) {
    const uniqueEmails = [];
    const len = emails.length;
    for (let i = 0; i < len; i++) {
        const email = emails[i];
        const uniqueEmail = email.substring(0, email.indexOf('+'))
                                 .replace(/\./g, '')
                          + email.substring(email.indexOf('@'));
        if (uniqueEmails.indexOf(uniqueEmail) === -1) {
            uniqueEmails.push(uniqueEmail);
        }
    }
    return uniqueEmails.length;
}
