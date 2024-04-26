import { getPackageJson } from '#common/utils/file/getPackageJson.js';
import { npmInstall } from '#common/utils/manager/npm.js';

/**
 * 更新脚本
 * @returns {Promise<void>}
 */
export const update = async () => {
    const { name } = await getPackageJson();
    await npmInstall(name, false, true);
};
