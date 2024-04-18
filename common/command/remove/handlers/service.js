import { resolve } from 'node:path';
import { removeFile } from '#common/utils/file/remove.js';

/**
 * 删除service
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removeService = async (name, directory) => {
    const servicePath = resolve(directory, `${name}.service.ts`);
    await removeFile(servicePath);
};
