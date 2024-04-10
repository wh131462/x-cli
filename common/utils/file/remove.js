import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';

/**
 * 删除
 * @param filePath
 * @returns {Promise<string>}
 */
export const removeFile = async (filePath) => {
    if (!existsSync(filePath)) {
        return '不存在此文件';
    }
    await rm(filePath, { recursive: true, force: true });
};
/**
 * 删除dir
 * @param dirPath
 * @returns {Promise<string>}
 */
export const removeDir = async (dirPath) => {
    if (!existsSync(dirPath)) {
        return '不存在此目录';
    }
    await rm(dirPath, { recursive: true, force: true });
};
