import { resolve } from 'node:path';
import { removeFile } from '#common/utils/file/remove.js';

/**
 * 删除文档
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removeDoc = async (name, directory) => {
    const docPath = resolve(directory, `${name}.mdx`);
    await removeFile(docPath);
};
