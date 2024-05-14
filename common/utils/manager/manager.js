import { npmHas, npmInstall, npmRun, npmUninstall, npx } from '#common/utils/manager/npm.js';
import { pnpmInstall, pnpmRun, pnpmUninstall, pnpx } from '#common/utils/manager/pnpm.js';
import { yarnCreate, yarnInstall, yarnRun, yarnUninstall } from '#common/utils/manager/yarn.js';
import { getXConfig } from '#common/utils/x/getXConfig.js';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { ManagerLockEnum, managerLockFiles } from '#common/constants/manager.const.js';

/**
 *
 * @param manager
 * @returns {{uninstall: ((function(*, boolean=, {}=): Promise<*>)|*), install: ((function(*, boolean=, boolean=, {}=): Promise<*>)|*), npx: ((function(*): (Promise<never>|Promise<*>))|*), run: ((function(*, {}=): Promise<*>)|*), has: ((function(*, boolean=): Promise<boolean|*>)|*)}|{uninstall: ((function(*, boolean=, {}=): Promise<*>)|*), install: ((function(*, boolean=, boolean=, {}=): Promise<*>)|*), npx: ((function(*): (Promise<never>|Promise<*>))|*), run: ((function(*, {}=): Promise<*>)|*), has: ((function(*, boolean=): Promise<boolean|*>)|*)}}
 */
export const getManagerByName = (manager) => {
    switch (manager) {
        case 'pnpm':
            return {
                has: npmHas,
                install: pnpmInstall,
                uninstall: pnpmUninstall,
                run: pnpmRun,
                npx: pnpx
            };

        case 'yarn':
            return {
                has: npmHas,
                install: yarnInstall,
                uninstall: yarnUninstall,
                run: yarnRun,
                npx: yarnCreate
            };
        case 'npm':
        default:
            return {
                has: npmHas,
                install: npmInstall,
                uninstall: npmUninstall,
                run: npmRun,
                npx: npx
            };
    }
};
/**
 * 获取当前的manager
 * @returns {Promise<string>}
 */
export const getManagerNameByX = async () => {
    try {
        const xConfig = await getXConfig();
        const { packageManager } = xConfig;
        return packageManager;
    } catch (e) {
        return undefined;
    }
};
/**
 * 根据锁文件获取当前的包管理器
 * @returns {Promise<string>}
 */
export const getManagerNameByLock = async () => {
    const lockDirectory = await readdir(resolve('.'));
    const foundLocks = lockDirectory.filter((o) => managerLockFiles.includes(o));
    if (foundLocks.length > 1) {
        throw new Error('There are multiple lock files in the project, please remove one of them');
    } else {
        const [lock = 'package-lock.json'] = foundLocks;
        return ManagerLockEnum[lock];
    }
};
/**
 * 无论如何都获取一个manager
 * @returns {Promise<string|undefined>}
 */
export const getManagerName = async () => {
    const managerName = await getManagerNameByX();
    if (!managerName) {
        return await getManagerNameByLock();
    } else {
        return managerName;
    }
};

/**
 * 包管理 has
 * @param args
 * @returns {Promise<void>}
 */
export const managerHas = async (...args) => {
    await getManagerByName(await getManagerName()).has(...args);
};

export const managerInstall = async (...args) => {
    await getManagerByName(await getManagerName()).install(...args);
};

export const managerUninstall = async (...args) => {
    await getManagerByName(await getManagerName()).uninstall(...args);
};

export const managerRun = async (...args) => {
    await getManagerByName(await getManagerName()).run(...args);
};

export const managerNpx = async (...args) => {
    await getManagerByName(await getManagerName()).run(...args);
};
