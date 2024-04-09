import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { env } from '#common/utils/node/env.js';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
/**
 * 本文件的dir位置
 * @type {string}
 * @private
 */
const __dirname = dirname(__filename);
/**
 * 根路径
 * @type {string}
 */
export const rootPath = env() === 'dev' ? resolve(__dirname, '../../../') : resolve(__dirname, '../../');
