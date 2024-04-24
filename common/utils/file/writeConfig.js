import { readFileSync } from 'node:fs';
import { createFile, loadFile } from '#common/utils/file/create.js';

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
export const readConfig = async (filename) => {
    if (!filename) {
        console.log('请输入文件名');
        return null;
    }
    const config = await loadFile(filename);
    return JSON.parse(config);
};
