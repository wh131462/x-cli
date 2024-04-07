import { writeFileSync } from 'fs';

/**
 * 创建文件
 * @param filename
 * @param config
 */
export const writeConfig = (filename, config) => {
    let content;
    if (typeof config === 'object' || config === null) {
        content = JSON.stringify(config, null, 2);
    } else {
        content = config;
    }
    writeFileSync(filename, content);
};
