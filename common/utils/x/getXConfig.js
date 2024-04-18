import { where } from '#common/utils/x/where.js';
import { readConfig } from '#common/utils/file/writeConfig.js';
import { resolve } from 'node:path';

/**
 * x 插件配置
 *
 * @typedef {Object} IXrc
 * @property {string} name
 * @property {string} prefix
 * @property {string} version
 * @property {Object.<string, IProject>} projects
 * @property {string} packageManager
 */

/**
 * x 项目配置
 *
 * @typedef {Object} IProject
 * @property {string} type
 */

/**
 * 获取当前的xrc配置
 * @returns {Promise<IXrc>}
 */
export const getXConfig = async () => {
    const root = await where();
    return await readConfig(resolve(root, '.xrc'));
};
/**
 * 获取指定类型的项目名称列表
 * @param xConfig {IXrc}
 * @param type {"demo"|"component"}
 * @returns {string[]}
 */
export const getProjectNames = (xConfig, type) => {
    if (!xConfig) return [];
    return Object.keys(xConfig.projects).filter((key) => xConfig.projects[key].type === type);
};
