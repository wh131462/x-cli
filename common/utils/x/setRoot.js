import { where } from '#common/utils/x/where.js';

/**
 * 设置root
 * @returns {Promise<void>}
 */
export const setRoot = async () => {
    const root = await where();
    process.chdir(root);
};
