import { rootPath } from '#common/utils/file/path.js';
import { copyFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { logger } from '#common/utils/x/logger.js';

/**
 * comment
 * @type {IPlugin}
 */
export const comment = {
    check: async () => {
        if (existsSync(resolve(rootPath, 'resources', 'settings.zip'))) {
            return existsSync(resolve(process.cwd(), 'settings.zip'));
        } else {
            return false;
        }
    },
    install: async () => {
        logger.info(
            `文件下载至: file://${resolve(process.cwd(), 'settings.zip')}\n请按照操作路径进行导入:\n文件->管理IDE设置->导入设置->选择settings.zip文件->确认导入`
        );
        await copyFile(resolve(rootPath, 'resources', 'settings.zip'), resolve(process.cwd(), 'settings.zip'));
    },
    uninstall: async () => {
        await rm(resolve(process.cwd(), 'settings.zip'));
    }
};
