import { resolve } from 'node:path';
import { removeFile } from '#common/utils/file/remove.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

/**
 * 删除service
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removeService = async (name, directory) => {
    name = kebabcase(name);
    const servicePath = resolve(directory, `${name}.service.ts`);
    await removeFile(servicePath);
};
