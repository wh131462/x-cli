import { logger } from '#common/utils/x/logger.js';
import { mkdir, writeFile, readFile, appendFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

/**
 * 创建路径 - 无视路径
 * @param path
 */
export const createDir = async (path) => {
    if (!path || existsSync(path)) return;
    try {
        logger.info(`creating dir: ${path}`);
        await mkdir(path, { recursive: true });
    } catch (error) {
        logger.error(`Failed to create directory: ${error}`);
    }
};
/**
 * 创建文件 - 无视路径
 * @param filePath
 * @param content
 */
export const createFile = async (filePath, content) => {
    logger.info(`creating file:${filePath}`);
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    await createDir(dir);
    await writeFile(filePath, content);
};
/**
 * 向文件更新内容
 * @param filePath
 * @param content
 * @returns {Promise<void>}
 */
export const updateFile = async (filePath, content) => {
    logger.info(`updating file:${filePath}`);
    await appendFile(filePath, '\n' + content);
};
/**
 * 替换文件内容 - 第二个参数传入数组 可以多个匹配规则替换
 * @param filePath
 * @param search
 * @param replace
 * @returns {Promise<void>}
 */
export const replaceFile = async (filePath, search, replace = null) => {
    logger.info(`replacing file:${filePath}`);
    let replacePairs = [];
    if (!Array.isArray(search)) {
        replacePairs = [[search, replace]];
    } else {
        replacePairs = search;
    }
    const content = await loadFile(filePath);
    let newContent = content;
    for (const [se, re] of replacePairs) {
        newContent = newContent.replaceAll(se, re);
    }
    logger.warn(filePath, search, '===>', newContent);
    await writeFile(filePath, newContent, 'utf8');
};
/**
 * 读取文件
 * @param filePath
 * @returns {Promise<unknown>}
 */
export const loadFile = async (filePath) => {
    logger.info(`loading file:${filePath}`);
    return await readFile(filePath, 'utf-8');
};
