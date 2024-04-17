/**
 * 插件的返回接口
 *
 * @typedef {Object} IPlugin
 * @property {(function(): Promise<boolean>)} check - 检查方法
 * @property {(function(): Promise<unknown>)} install - 安装流程
 * @property {(function(): Promise<unknown>)} uninstall - 卸载流程
 */
