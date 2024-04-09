import { logger } from '#common/utils/logger.js';
import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * 创建路径 - 无视路径
 * @param path
 */
export const createDir = (path) => {
    logger.info(`create:${path}`);
    mkdirSync(path, { recursive: true });
};
/**
 * 创建文件 - 无视路径
 * @param filePath
 * @param content
 */
export const createFile = (filePath, content) => {
    const dir = filePath.substring(0, filePath.lastIndexOf('/'));
    createDir(dir);
    writeFileSync(filePath, content);
};
