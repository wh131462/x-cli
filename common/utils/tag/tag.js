import { camel } from '#common/utils/string/camel.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

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
    },
    // 驼峰法
    camel: camel,
    // 连词符法
    kebabcase: kebabcase
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
export const tagReg = new RegExp(`{@[0-9a-zA-Z]+(?:__(${rules.join('|')}))?}`, 'img');
/**
 * 获取名字
 * @param str
 */
export const getName = (str) => {
    return str
        .toString()
        .split('__')[0]
        ?.toLowerCase()
        .replace(/[@{}]+/g, '');
};
/**
 * 获取规则
 * @param str
 * @returns {string[]}
 */
export const getRules = (str) => {
    return str
        .toString()
        .split('__')
        .slice(1)
        .map((rule) => rule.toLowerCase().replace(/[@{}]+/g, ''));
};
/**
 * 获取配置
 * @param config
 * @param name
 * @returns {*}
 */
const getPropertyByName = (config, name) => {
    const key = Object.keys(config).filter((key) => key.toLowerCase() === name)?.[0];
    return config[key];
};
/**
 * tag转化
 */
export const convertTemplateByTags = (content, config) => {
    return content.replace(tagReg, (matcher) => {
        const rules = getRules(matcher);
        const name = getName(matcher);
        // console.log(matcher, getPropertyByName(config, name));
        if (getPropertyByName(config, name)) {
            return rules.reduce(
                (prev, rule) => {
                    return Object.hasOwn(tagRules, rule) ? tagRules[rule](prev) : prev;
                },
                getPropertyByName(config, name)
            );
        } else {
            return matcher;
        }
    });
};
