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
 * 替换文件内容
 * @param filePath
 * @param search
 * @param replace
 * @returns {Promise<void>}
 */
export const replaceFile = async (filePath, search, replace) => {
    logger.info(`replacing file:${filePath}`);
    const content = await loadFile(filePath);
    const newContent = content.replace(search, replace);
    logger.off();
    await writeFile(filePath, newContent);
    logger.on();
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
