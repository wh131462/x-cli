import { createFile } from '#common/utils/file/create.js';

/**
 * 写入配置文件
 * @param filename
 * @param config
 */
export const writeConfig = async (filename, config) => {
    let content;
    if (typeof config === 'object' || config === null) {
        content = JSON.stringify(config, null, 2);
    } else {
        content = config;
    }
    await createFile(filename, content);
};
