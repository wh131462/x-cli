import { where } from '#common/utils/x/where.js';
import { readConfig } from '#common/utils/file/writeConfig.js';
import { resolve } from 'node:path';

/**
 * 获取当前的xrc配置
 * @returns {Promise<*>}
 */
export const getXConfig = async () => {
    const root = await where();
    return await readConfig(resolve(root, '.xrc'));
};
