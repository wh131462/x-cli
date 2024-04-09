import { logger } from '#common/utils/logger.js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

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
    return new Promise((resolve) => {
        const dir = filePath.substring(0, filePath.lastIndexOf('/'));
        createDir(dir);
        writeFileSync(filePath, content);
        resolve();
    });
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
