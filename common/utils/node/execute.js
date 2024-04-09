import { exec, spawn } from 'child_process';
import { resolve } from 'node:path';
import { logger } from '#common/utils/logger.js';

/**
 * 执行
 * 简单执行 exec
 * 复杂带交互的执行使用 spawn
 */
/**
 * 简单执行 - 失败返回false
 * @param command
 * @returns {Promise<unknown>}
 */
export const execute = (command) => {
    if (!command) {
        return Promise.reject('Not a standard command.');
    }
    logger.info(command);
    return new Promise((resolve) => {
        exec(command, (error, stdout, stderr) => {
            if (error) resolve(false);
            resolve(stdout);
        });
    });
};
/**
 * 执行带交互的内容
 */
export const executeInteraction = (command) => {
    if (!command) {
        return Promise.reject('Not a standard command.');
    }
    logger.info(command);
    return new Promise((resolve, reject) => {
        const [core, ...params] = command.split(/\s+/).filter((o) => o);
        const thread = spawn(core, params, {
            stdio: 'inherit', // 继承父进程的文件描述符（stdin, stdout, stderr）
            shell: true // 使用shell来执行命令
        });
        // 监听子进程退出事件
        thread.on('close', (code) => {
            if (code === 0) {
                resolve(true);
            } else {
                reject(code);
            }
        });
    });
};
