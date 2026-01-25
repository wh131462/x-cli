/**
 * AI 配置文件管理模块
 * 负责配置文件的读取、写入和路径管理
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { rootPath } from '#common/utils/file/path.js';

/**
 * 获取 OpenCode 全局配置文件路径
 * 遵循 XDG 规范: ~/.config/opencode/opencode.json
 */
export const getGlobalConfigPath = () => {
    const home = homedir();
    return resolve(home, '.config', 'opencode', 'opencode.json');
};

/**
 * 获取 X-CLI 配置文件路径（存放在脚手架安装目录）
 */
export const getConfigPath = () => {
    return resolve(rootPath, 'opencode.json');
};

/**
 * 获取模板配置文件路径
 */
export const getExampleConfigPath = () => {
    return resolve(rootPath, 'opencode.example.json');
};

/**
 * 获取 OpenCode 官方 auth.json 路径
 * 遵循 XDG 规范: ~/.local/share/opencode/auth.json
 */
export const getAuthPath = () => {
    const home = homedir();
    const dataDir = resolve(home, '.local', 'share', 'opencode');
    return resolve(dataDir, 'auth.json');
};

/**
 * 读取 JSON 配置文件
 * @param {string} filePath - 文件路径
 * @returns {object} 配置对象，失败返回空对象
 */
const readJsonFile = (filePath) => {
    if (!existsSync(filePath)) {
        return {};
    }
    try {
        return JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch {
        return {};
    }
};

/**
 * 写入 JSON 配置文件
 * @param {string} filePath - 文件路径
 * @param {object} data - 配置数据
 */
const writeJsonFile = (filePath, data) => {
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2));
};

/**
 * 读取全局配置
 */
export const loadGlobalConfig = () => {
    return readJsonFile(getGlobalConfigPath());
};

/**
 * 读取 X-CLI 配置
 */
export const loadConfig = () => {
    return readJsonFile(getConfigPath());
};

/**
 * 保存 X-CLI 配置
 */
export const saveConfig = (config) => {
    writeJsonFile(getConfigPath(), config);
};

/**
 * 读取模板配置
 */
export const loadExampleConfig = () => {
    return readJsonFile(getExampleConfigPath());
};

/**
 * 读取 auth.json
 */
export const loadAuth = () => {
    return readJsonFile(getAuthPath());
};

/**
 * 保存 auth.json
 */
export const saveAuth = (auth) => {
    writeJsonFile(getAuthPath(), auth);
};

/**
 * 确保基础配置文件存在
 * 如果 opencode.json 不存在，则从 opencode.example.json 生成基础配置
 * 同时检查全局配置，询问是否导入已有的 provider 配置
 * @returns {Promise<{needsConfig: boolean}>} 是否需要运行配置向导
 */
export const ensureBaseConfig = async () => {
    const { confirm } = await import('#common/utils/ui/promot.js');
    const configPath = getConfigPath();

    // 如果配置文件已存在，直接返回
    if (existsSync(configPath)) {
        return { needsConfig: false };
    }

    console.log('\n👋 欢迎使用 X-CLI AI 工作区!\n');

    // 从模板文件生成基础配置
    const exampleConfig = loadExampleConfig();
    let baseConfig = {
        $schema: 'https://opencode.ai/config.json',
        // 复制样式配置
        ...(exampleConfig.theme && { theme: exampleConfig.theme }),
        ...(exampleConfig.username && { username: exampleConfig.username }),
        ...(exampleConfig.tui && { tui: exampleConfig.tui }),
        ...(exampleConfig.keybinds && { keybinds: exampleConfig.keybinds }),
        // 复制 agent 配置
        ...(exampleConfig.agent && { agent: exampleConfig.agent }),
        ...(exampleConfig.default_agent && { default_agent: exampleConfig.default_agent }),
        // 空的 provider 和 model，等待用户配置
        provider: {},
        model: ''
    };

    // 检查是否有全局配置可以导入
    const globalConfig = loadGlobalConfig();
    const hasGlobalProviders = globalConfig.provider && Object.keys(globalConfig.provider).length > 0;

    if (hasGlobalProviders) {
        console.log('检测到已有的 OpenCode 全局配置:');
        console.log(`  位置: ${getGlobalConfigPath()}`);
        console.log(`  Providers: ${Object.keys(globalConfig.provider).length} 个\n`);

        const importGlobal = await confirm('是否导入已有配置?', true);
        if (importGlobal) {
            // 合并 provider 配置
            baseConfig.provider = { ...globalConfig.provider };

            // 如果有默认模型，也一起导入
            if (globalConfig.model) {
                baseConfig.model = globalConfig.model;
            }

            console.log(`\n✓ 已导入 ${Object.keys(baseConfig.provider).length} 个 Provider`);
            if (baseConfig.model) {
                console.log(`✓ 已导入默认模型: ${baseConfig.model}`);
            }
            console.log('');
        } else {
            console.log('\n提示: 稍后可通过 xa --manage 导入全局配置\n');
        }
    }

    saveConfig(baseConfig);

    // 引导用户完成配置
    if (Object.keys(baseConfig.provider).length === 0) {
        console.log('当前还没有配置任何 Provider。\n');
        console.log('你可以选择:');
        console.log('  1. 立即配置 Provider (推荐)');
        console.log('  2. 稍后在 TUI 中使用 /connect 命令配置');
        console.log('  3. 使用 xa --manage 管理配置\n');

        const configNow = await confirm('是否立即配置?', true);
        return { needsConfig: configNow };
    }

    return { needsConfig: false };
};
