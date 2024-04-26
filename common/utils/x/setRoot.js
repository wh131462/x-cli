import { where } from '#common/utils/x/where.js';
import { logger } from '#common/utils/x/logger.js';

/**
 * 设置root
 * @returns {Promise<void>}
 */
export const setRoot = async () => {
    try {
        const root = await where();
        process.chdir(root);
        logger.info(`当前工作目录：${root}`);
    } catch {}
};
