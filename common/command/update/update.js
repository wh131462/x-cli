import { getPackageJson } from '#common/utils/file/getPackageJson.js';
import { logger } from '#common/utils/x/logger.js';
import { inX } from '#common/utils/x/where.js';
import { npmInstall } from '#common/utils/manager/npm.js';
import { rootPath } from '#common/utils/file/path.js';

/**
 * 更新脚本
 * @returns {Promise<void>}
 */
export const update = async () => {
    const { name } = await getPackageJson();
    logger.info(name, rootPath);
    console.log((await inX()) ? '在' : '不在');
    await npmInstall(name, false, true);
};
