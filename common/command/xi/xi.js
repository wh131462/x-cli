import { managerExec } from '#common/utils/x/managerExec.js';

/**
 * xi
 * 执行当前环境下的内容
 */
export const xi = async (packageName, isDev, isGlobal, extraArgs = []) => {
    await managerExec(async ({ install }) => {
        if (packageName) {
            await install(packageName, isDev, isGlobal, {}, extraArgs);
        } else {
            await install(undefined, false, false, {}, extraArgs);
        }
    });
};
