import { npmInstall } from '#common/utils/manager/npm.js';
import { getPackageJson } from '#common/utils/file/getPackageJson.js';

export const update = async () => {
    const { name } = await getPackageJson();
    return npmInstall(name, false, true);
};
