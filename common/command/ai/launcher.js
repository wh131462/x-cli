/**
 * OpenCode TUI 启动器
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { logger } from '#common/utils/x/logger.js';
import { rootPath } from '#common/utils/file/path.js';
import { getConfigPath } from './config.js';

/**
 * 获取本地 opencode 可执行文件路径
 */
export const getOpencodeBinPath = () => {
    // Windows 上使用 .bin/opencode.cmd，Unix 上使用 .bin/opencode
    const binName = process.platform === 'win32' ? 'opencode.cmd' : 'opencode';

    try {
        // 使用 import.meta.resolve 定位 opencode-ai 包的 package.json
        const packageJsonPath = import.meta.resolve('opencode-ai/package.json');
        // packageJsonPath 格式: file:///path/to/node_modules/opencode-ai/package.json
        const packageDir = fileURLToPath(new URL('.', packageJsonPath));
        // 从包目录向上找到 node_modules，再找 .bin
        const nodeModulesDir = resolve(packageDir, '..');
        const binPath = resolve(nodeModulesDir, '.bin', binName);
        return binPath;
    } catch {
        // 回退：尝试从 rootPath 查找
        return resolve(rootPath, 'node_modules', '.bin', binName);
    }
};

/**
 * 启动 OpenCode TUI
 */
export const launchOpencode = (options = {}) => {
    const args = [];

    // 优先使用命令行参数
    if (options.model) {
        args.push('--model', options.model);
    }

    // 获取本地安装的 opencode 可执行文件路径
    const opencodeBin = getOpencodeBinPath();

    // 检查可执行文件是否存在
    if (!existsSync(opencodeBin)) {
        logger.error(`未找到 opencode: ${opencodeBin}`);
        logger.error('请尝试重新安装 @eternalheart/x-cli');
        process.exit(1);
    }

    // 通过 OPENCODE_CONFIG 环境变量指定配置文件路径
    // Windows 上执行 .cmd 文件需要 shell: true
    const opencode = spawn(opencodeBin, args, {
        stdio: 'inherit',
        cwd: process.cwd(),
        shell: process.platform === 'win32',
        env: {
            ...process.env,
            FORCE_COLOR: '1',
            OPENCODE_CONFIG: getConfigPath()
        }
    });

    opencode.on('error', (err) => {
        logger.error(`启动 OpenCode 失败: ${err.message}`);
        process.exit(1);
    });

    opencode.on('close', (code) => {
        process.exit(code || 0);
    });
};
