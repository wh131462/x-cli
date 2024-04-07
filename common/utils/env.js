import fs from 'node:fs';
import path from 'node:path';
import { rootPath } from '#common/utils/path.js';

/**
 * 获取环境是开发还是生产
 * @returns {string}
 */
export const env = import.meta.url?.endsWith('env.js') ? 'dev' : 'prod';
/**
 * package json
 * @type {any}
 */
export const getPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.resolve(rootPath, 'package.json'), 'utf-8'));
};
