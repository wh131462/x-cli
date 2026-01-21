import { npmHas, npmInstall, npmRun, npmUninstall, npx } from '#common/utils/manager/npm.js';
import { pnpmInstall, pnpmRun, pnpmUninstall, pnpx } from '#common/utils/manager/pnpm.js';
import { yarnCreate, yarnInstall, yarnRun, yarnUninstall } from '#common/utils/manager/yarn.js';
import { bunInstall, bunRun, bunUninstall, bunx } from '#common/utils/manager/bun.js';
import { readdir } from 'node:fs/promises';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execute } from '#common/utils/node/execute.js';
import { ManagerLockEnum, ManagerPriority, managerLockFiles, DefaultManager } from '#common/constants/manager.const.js';

/**
 * 根据包管理器名称获取对应的操作接口
 * @param manager
 * @returns {{has, install, uninstall, run, npx}}
 */
export const getManagerByName = (manager) => {
    switch (manager) {
        case 'bun':
            return {
                has: npmHas,
                install: bunInstall,
                uninstall: bunUninstall,
                run: bunRun,
                npx: bunx
            };
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
 * 第一优先级：从 package.json 的 packageManager 字段获取
 * 格式: "pnpm@8.0.0" 或 "yarn@4.0.0" 等
 * @returns {Promise<string|undefined>}
 */
export const getManagerFromPackageJson = async () => {
    try {
        const packageJsonPath = resolve(process.cwd(), 'package.json');
        if (!existsSync(packageJsonPath)) return undefined;

        const content = readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(content);
        const { packageManager } = packageJson;

        if (!packageManager) return undefined;

        // 解析格式如 "pnpm@8.0.0" -> "pnpm"
        const [managerName] = packageManager.split('@');
        if (['npm', 'yarn', 'pnpm', 'bun'].includes(managerName)) {
            return managerName;
        }
        return undefined;
    } catch (e) {
        return undefined;
    }
};

/**
 * 第二优先级：根据锁文件获取包管理器
 * @returns {Promise<string|undefined>}
 */
export const getManagerNameByLock = async () => {
    try {
        const files = await readdir(resolve('.'));
        const foundLocks = files.filter((f) => managerLockFiles.includes(f));

        if (foundLocks.length === 0) return undefined;

        // 如果有多个锁文件，按优先级返回
        for (const lockFile of managerLockFiles) {
            if (foundLocks.includes(lockFile)) {
                return ManagerLockEnum[lockFile];
            }
        }

        return ManagerLockEnum[foundLocks[0]];
    } catch (e) {
        return undefined;
    }
};

/**
 * 第三优先级：检测全局安装的包管理器
 * 优先级: pnpm > yarn > bun > npm
 * @returns {Promise<string|undefined>}
 */
export const getManagerFromGlobal = async () => {
    for (const manager of ManagerPriority) {
        try {
            const result = await execute(`${manager} --version`);
            if (result && result !== false) {
                return manager;
            }
        } catch (e) {
            continue;
        }
    }
    return undefined;
};

/**
 * 获取包管理器（新逻辑）
 * 1. package.json 的 packageManager 字段
 * 2. 锁文件检测
 * 3. 全局安装的包管理器（pnpm > yarn > bun > npm）
 * 4. npm 兜底
 * @returns {Promise<string>}
 */
export const getManagerName = async () => {
    // 第一优先级：package.json 的 packageManager
    let manager = await getManagerFromPackageJson();
    if (manager) return manager;

    // 第二优先级：锁文件检测
    manager = await getManagerNameByLock();
    if (manager) return manager;

    // 第三优先级：全局安装的包管理器
    manager = await getManagerFromGlobal();
    if (manager) return manager;

    // 第四优先级：npm 兜底
    return DefaultManager;
};

/**
 * 包管理 has
 * @param args
 * @returns {Promise<boolean>}
 */
export const managerHas = async (...args) => {
    return await getManagerByName(await getManagerName()).has(...args);
};

/**
 * 包管理 install
 * @param args
 * @returns {Promise<unknown>}
 */
export const managerInstall = async (...args) => {
    return await getManagerByName(await getManagerName()).install(...args);
};

/**
 * 包管理 uninstall
 * @param args
 * @returns {Promise<unknown>}
 */
export const managerUninstall = async (...args) => {
    return await getManagerByName(await getManagerName()).uninstall(...args);
};
