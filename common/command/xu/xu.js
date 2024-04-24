import { setRoot } from '#common/utils/x/setRoot.js';
import { readConfig } from '#common/utils/file/writeConfig.js';
import { getManager } from '#common/utils/manager/manager.js';
import { logger } from '#common/utils/x/logger.js';
a;

/**
 * 卸载
 * @returns {Promise<void>}
 */
export const xu = async (packageName, isGlobal) => {
    if (!packageName) {
        const warning = 'Require a packageName.';
        logger.warn(warning);
        throw new Error(warning);
    }
    await setRoot();
    const { manager } = await readConfig('.xrc');
    const { has, uninstall } = getManager(manager);
    if (packageName) {
        if (await has(packageName)) {
            await uninstall(packageName, isGlobal);
        } else {
            logger.warn(`${packageName} not found`);
        }
    }
};
