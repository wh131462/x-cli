import { logger } from '#common/utils/x/logger.js';

/**
 * 计算运行时长
 * @param callback
 * @returns {*}
 */
export const calcTime = (callback) => {
    const start = performance.now();
    const res = callback();
    const end = performance.now();
    logger.info(`Time cost：${(end - start).toFixed(2)} ms`);
    return res;
};
