/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-12-05 01:32:20
 * @Email:  codearvin@gmail.com
 * @Filename: to-lower-case.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-12-05 01:48:34
 */


/**
 * implement a function to lower case
 */

// Runtime: 48ms
const toLowerCase1 = function(str) {
    return str.toLowerCase();
};


// Runtime: 48ms
const toLowerCase2 = function(str) {
    return str.split('')
              .map(char => {
                  const code = char.charCodeAt(0);
                  if (code >= 65 && code <= 90) {
                      return String.fromCharCode(code + 32);
                  }
                  return char;
              })
              .join('');
};

// Runtime: 48ms
const toLowerCase3 = function(str) {
    const len = str.length;
    let i = 0;
    let code = null;
    let lowerStr = '';
    while (i < len) {
        code = str.charCodeAt(i);
        if (code >= 65 && code <= 90) {
            lowerStr += String.fromCharCode(code + 32);
        } else {
            lowerStr += str[i];
        }
        i++;
    }
    return lowerStr;
}
