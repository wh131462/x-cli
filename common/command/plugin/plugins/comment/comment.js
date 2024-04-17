import { rootPath } from '#common/utils/file/path.js';
import { copyFile, readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

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
        await copyFile(resolve(rootPath, 'resources', 'settings.zip'), resolve(process.cwd(), 'settings.zip'));
    },
    uninstall: async () => {
        await rm(resolve(process.cwd(), 'settings.zip'));
    }
};
