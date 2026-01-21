import { writeConfig } from '#common/utils/file/writeConfig.js';
import { existsSync } from 'node:fs';
import { removeFile } from '#common/utils/file/remove.js';
import { gitignoreContent } from '#common/constants/devtools.const.js';

/**
 * gitignore
 * @type {IPlugin}
 */
export const gitignore = {
    check: () => Promise.resolve(existsSync('.gitignore')),
    install: async ({ monorepo = false } = {}) => {
        return writeConfig('.gitignore', gitignoreContent);
    },
    uninstall: () => removeFile('.gitignore')
};
