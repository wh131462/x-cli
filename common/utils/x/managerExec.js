import { logger } from '#common/utils/x/logger.js';
import { getManagerByName, getManagerName } from '#common/utils/manager/manager.js';
import { DefaultManager } from '#common/constants/manager.const.js';

/**
 * 执行 manager 操作
 * @param callback
 * @returns {Promise<void>}
 */
export const managerExec = async (callback) => {
    let managerName;
    try {
        logger.off();
        managerName = await getManagerName();
        logger.on();
    } catch (e) {
        managerName = DefaultManager;
    } finally {
        const manager = getManagerByName(managerName);
        logger.info(`Using package manager: ${managerName}`);
        await callback?.(manager);
    }
};
