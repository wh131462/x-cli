import { logger } from '#common/utils/x/logger.js';
import { managerExec } from '#common/utils/x/managerExec.js';
import { executeInteraction } from '#common/utils/node/execute.js';
import { select } from '#common/utils/ui/promot.js';
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
 * 获取 package.json 中所有的 scripts
 * @returns {object} scripts 对象
 */
const getScripts = () => {
    const pkg = getCwdPackageJson();
    return pkg.scripts || {};
};

/**
 * 交互式选择脚本
 * @returns {Promise<string|null>} 选中的脚本名称，无脚本时返回 null
 */
export const selectScript = async () => {
    const scripts = getScripts();
    const scriptNames = Object.keys(scripts);

    if (scriptNames.length === 0) {
        logger.warn('当前项目 package.json 中没有定义任何 scripts');
        return null;
    }

    // 构建选择列表，显示脚本名称和对应命令
    const choices = scriptNames.map((name) => ({
        name: `${name.padEnd(20)} → ${scripts[name]}`,
        value: name
    }));

    const selectedScript = await select('请选择要运行的脚本:', null, choices);
    return selectedScript;
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
