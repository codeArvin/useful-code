/**
 * @Author: hanliu.shao <codearvin>
 * @Date:   2018-08-20 11:06:19
 * @Email:  codearvin@gmail.com
 * @Filename: request.js
 * @Last modified by:   codearvin
 * @Last modified time: 2018-08-20 11:58:39
 * @description: 参考 悦视光合 项目中对 fetch 的封装，方便使用
 */


function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

function parseJSON(response) {
    return response.json();
}

function isNil(value) {
    return value === null || value === undefined;
}

function requestUrl({url, params}) {
    const keys = !isNil(params) ? Object.keys(params) : [];
    if (keys.length !== 0) {
        keys.forEach((key, index) => {
            url += `${index === 0 ? '?' : '&'}${key}=${params[key]}`;
        });
    }
    return url;
}

/**
 * 请求网址，返回promise
 * @param  {object} url     请求的网址
 * @param  {object} options 传给fetch的参数
 * @return {object}         包含data或err的对象
 */
export default function request(url, options) {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => ({ data }))
        .catch((err) => ({ err }));
}

/**
 * 网络请求
 * @param  {string} url     api
 * @param  {string} method  GET、POST 等
 * @param  {object} headers 头信息
 * @param  {object} params  GET 请求参数
 * @param  {type} body      POST 的 body
 * @return {promise}         promise
 */
export function requestSimple({url, method, headers, params, body}) {
    const reqUrl = requestUrl({url, params});
    return request(reqUrl, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body)
    });
}
