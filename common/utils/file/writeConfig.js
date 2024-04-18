import { readFileSync } from 'node:fs';
import { createFile } from '#common/utils/file/create.js';

/**
 * 创建文件
 * @param filename
 * @param config
 */
export const writeConfig = async (filename, config) => {
    let content;
    if (typeof config === 'object' || config === null) {
        content = JSON.stringify(config, null, 2);
    } else {
        content = config;
    }
    await createFile(filename, content);
};
/**
 * 获取地址 必须是json格式
 * @param filename
 * @returns {Promise<*>}
 */
export const readConfig = (filename) => {
    return new Promise((resolve) => {
        resolve(JSON.parse(readFileSync(filename, 'utf-8')));
    });
};
