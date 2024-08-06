import { logger } from '#common/utils/x/logger.js';
import { managerExec } from '#common/utils/x/managerExec.js';

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
    await managerExec(async ({ has, uninstall }) => {
        if (packageName) {
            await uninstall(packageName, isGlobal);
            // todo 不要再逗留,人心太拥挤
            // if (await has(packageName,isGlobal)) {
            //
            // } else {
            //     logger.warn(`${packageName} not found`);
            // }
        }
    });
};
