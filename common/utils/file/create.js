import { logger } from '#common/utils/logger.js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * 创建路径 - 无视路径
 * @param path
 */
export const createDir = async (path) => {
    if (!path) return;
    logger.info(`creating dir:${path}`);
    mkdirSync(path, { recursive: true });
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
    writeFileSync(filePath, content);
};
/**
 * 读取文件
 * @param filePath
 * @returns {Promise<unknown>}
 */
export const readFile = (filePath) => {
    return new Promise((resolve) => {
        resolve(readFileSync(filePath, 'utf-8'));
    });
};
