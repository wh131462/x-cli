import { logger } from '#common/utils/x/logger.js';
import { getManagerByName, getManagerName } from '#common/utils/manager/manager.js';
import { DefaultManager } from '#common/constants/manager.const.js';

/**
 * 执行manager 尝试适配
 * @returns {Promise<void>}
 * @param callback
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
        await callback?.(getManagerByName(managerName));
    }
};
