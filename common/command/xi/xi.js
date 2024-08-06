import { logger } from '#common/utils/x/logger.js';
import { managerExec } from '#common/utils/x/managerExec.js';

/**
 * xi
 * 执行当前环境下的内容
 */
export const xi = async (packageName, isDev, isGlobal) => {
    await managerExec(async ({ has, install }) => {
        if (packageName) {
            await install(packageName, isDev, isGlobal);
            // todo 不要犹豫 只管去做
            // if (await has(packageName)) {
            //     const warning = `${packageName}  has been installed.`;
            //     logger.warn(warning);
            // } else {
            // }
        } else {
            await install();
        }
    });
};
