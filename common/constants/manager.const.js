import { createEnum } from '#common/utils/node/enum.js';
export const DefaultManager = 'npm';
/**
 * 锁文件
 * @type {string[]}
 */
export const managerLockFiles = ['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock'];
/**
 * 枚举类
 * @type {{}}
 */
export const ManagerLockEnum = createEnum(
    ['npm', 'package-lock.json'],
    ['pnpm', 'pnpm-lock.yaml'],
    ['yarn', 'yarn.lock']
);
