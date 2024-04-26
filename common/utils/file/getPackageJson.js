import { rootPath } from '#common/utils/file/path.js';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';

/**
 * package json
 * @type {any}
 */
export const getPackageJson = () => {
    try {
        return JSON.parse(readFileSync(resolve(rootPath, 'package.json'), 'utf-8'));
    } catch (e) {
        return {};
    }
};
