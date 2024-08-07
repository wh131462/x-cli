import { resolve } from 'node:path';
import { removeFile } from '#common/utils/file/remove.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

/**
 * 删除文档
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removeDoc = async (name, directory) => {
    name = kebabcase(name);
    const docPath = resolve(directory, `${name}.mdx`);
    await removeFile(docPath);
};
