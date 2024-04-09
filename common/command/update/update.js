import { npmInstall } from '#common/utils/manager/npm.js';

export const update = () => {
    return npmInstall('x-cli', false, true, { registry: 'http://npm.runtongqiuben.com' });
};
