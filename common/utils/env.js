import path from 'node:path';
import { __dirname } from '#common/utils/path.js';

/**
 * 获取环境是开发还是已发布
 * @returns {string}
 */
export const env = () => {
    if (import.meta.url.endsWith('env.js')) {
        return 'dev';
    } else {
        return 'prod';
    }
};
/**
 * 根路径
 * @type {string}
 */
export const rootPath = env() === 'dev' ? path.resolve(__dirname, '../../') : path.resolve(__dirname, '../');
