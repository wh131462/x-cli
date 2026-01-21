import { createEnum } from '#common/utils/node/enum.js';

export const DefaultManager = 'npm';

/**
 * 包管理器优先级（用于全局检测）
 * pnpm > yarn > bun > npm
 */
export const ManagerPriority = ['pnpm', 'yarn', 'bun', 'npm'];

/**
 * 锁文件列表（添加 bun.lockb）
 * @type {string[]}
 */
export const managerLockFiles = ['pnpm-lock.yaml', 'yarn.lock', 'bun.lockb', 'package-lock.json'];

/**
 * 锁文件到包管理器的映射
 * @type {{}}
 */
export const ManagerLockEnum = createEnum(
    ['pnpm', 'pnpm-lock.yaml'],
    ['yarn', 'yarn.lock'],
    ['bun', 'bun.lockb'],
    ['npm', 'package-lock.json']
);
