/**
 * tag处理策略 - 处理不同的功能函数
 * @type {{upper: (function(*): string), lower: (function(*): string)}}
 */
export const tagRules = {
    // 大写
    upper: (str) => {
        return str.toString().toUpperCase();
    },
    // 小写
    lower: (str) => {
        return str.toString().toLowerCase();
    },
    // 大写首字母
    capital: (str) => {
        const s = str.toString();
        return s.at(0).toUpperCase() + s.slice(1);
    }
};
/**
 * 所有可用规则
 * @type {string[]}
 */
export const rules = Object.keys(tagRules);
/**
 * 正则用于匹配对应的标签
 * @type {RegExp}
 */
export const tagReg = new RegExp(`@[0-9a-zA-Z]+(?:__(${rules.join('|')}))?`, 'img');
/**
 * 获取名字
 * @param str
 */
export const getName = (str) => {
    return str.toString().split('__')[0];
};
/**
 * 获取规则
 * @param str
 * @returns {string[]}
 */
export const getRules = (str) => {
    return str.toString().split('__').slice(1);
};
/**
 * tag转化
 */
export const convert = (content) => {};
