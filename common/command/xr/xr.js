import { logger } from '#common/utils/x/logger.js';
import { managerExec } from '#common/utils/x/managerExec.js';
import { executeInteraction } from '#common/utils/node/execute.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * 获取当前工作目录的 package.json
 * @returns {object}
 */
const getCwdPackageJson = () => {
    try {
        return JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'));
    } catch {
        return {};
    }
};

/**
 * 检查 package.json 中是否存在指定的 script
 * @param {string} scriptName - 脚本名称
 * @returns {boolean}
 */
const hasScript = (scriptName) => {
    const pkg = getCwdPackageJson();
    return !!(pkg.scripts && pkg.scripts[scriptName]);
};

/**
 * xr
 * npm run xxx / yarn / pnpm run
 * 如果 script 不存在，回退到执行 shell 命令
 */
export const xr = async (script) => {
    if (!script) {
        const warning = '[X] Please enter the script name.';
        logger.warn(warning);
        throw new Error(warning);
    }

    // 获取脚本名称（不含参数）
    const scriptName = script.split(' ')[0];

    // 检查是否为 package.json 中的 script
    if (hasScript(scriptName)) {
        await managerExec(async ({ run }) => {
            await run(script);
        });
    } else {
        // 不是 npm script，直接执行 shell 命令
        logger.info(`Script "${scriptName}" not found in package.json, executing as shell command...`);
        await executeInteraction(script);
    }
};
