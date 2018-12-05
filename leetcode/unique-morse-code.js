/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-12-06 12:45:07
 * @Email:  codearvin@gmail.com
 * @Filename: unique-morse-code.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-12-06 01:13:26
 */


/**
 * Question: https://leetcode.com/problems/unique-morse-code-words/
 * 一组单词，翻译成摩斯码，求翻译后不同摩斯码的数目
 */

const morseMap1 = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.","---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."];

const morseMap2 = {a: ".-",b: "-...",c: "-.-.",d: "-..",e: ".",f: "..-.",g: "--.",h: "....",i: "..",j: ".---",k: "-.-",l: ".-..",m: "--",n: "-.",o: "---",p: ".--.",q: "--.-",r: ".-.",s: "...",t: "-",u: "..-",v: "...-",w: ".--",x: "-..-",y: "-.--",z: "--.."};

const word2Morse1 = function(word) {
    let i = 0;
    let morse = '';
    const len = word.length;
    while (i < len) {
        morse += morseMap[word.charCodeAt(i) - 97];
        i++;
    }
    return morse;
};

// 这种方式比上面的方式耗时更短
const word2Morse2 = function(word) {
    return word.split('')
               .map(c => morseMap[c.charCodeAt(0) - 97])
               .join('');
};

// O(n)
// Runtime: 1-64ms 2-76ms
const uniqueMorseRepresentations1 = function(words) {
    const results = new Set();
    words.forEach(word => results.add(wordToMorse(word)));
    return results.size;
}


// O(n)
// Runtime: 1-64ms 2-76ms
const uniqueMorseRepresentations2 = function(words) {
    const uniqueMorse = {};
    let count = 0;
    let morse = null;
    words.forEach(word => {
        morse = word2Morse(word);
        if (uniqueMorse[morse] === undefined) {
            uniqueMorse[morse] = morse;
            count++;
        }
    });
    return count;
};

// 52ms 的方法
const uniqueMorseRepresentations3 = words => words.map(word => word.split('').reduce((morse, letter) => morse + morseMap[letter],'')).filter((morse, index, morses) => morses.indexOf(morse) === index).length;
