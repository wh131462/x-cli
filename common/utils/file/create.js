import { logger } from '#common/utils/logger.js';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

/**
 * 创建路径 - 无视路径
 * @param path
 */
export const createDir = async (path) => {
    if (!path) return;
    logger.info(`creating dir: ${path}`);
    try {
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
 * 读取文件
 * @param filePath
 * @returns {Promise<unknown>}
 */
export const loadFile = async (filePath) => {
    logger.info(`loading file:${filePath}`);
    await readFile(filePath, 'utf-8');
};
