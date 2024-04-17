import { dirname } from 'node:path';
import { logger } from '#common/utils/x/logger.js';
import { readdirSync } from 'node:fs';

/**
 * where
 * 返回当前项目根路径
 */
export const where = async () => {
    let projectRoot = process.cwd();
    while (projectRoot !== '/') {
        if (readdirSync(projectRoot).includes('.xrc')) {
            break;
        }
        projectRoot = dirname(projectRoot);
    }
    if (projectRoot === '/') {
        logger.error('Not in a x project');
        throw new Error();
    }
    logger.info(`root: ${projectRoot}`);
    return projectRoot;
};
