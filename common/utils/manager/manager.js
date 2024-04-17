import { npmHas, npmInstall, npmRun, npmUninstall, npx } from '#common/utils/manager/npm.js';
import { pnpmInstall, pnpmRun, pnpmUninstall, pnpx } from '#common/utils/manager/pnpm.js';
import { yarnCreate, yarnInstall, yarnRun, yarnUninstall } from '#common/utils/manager/yarn.js';

/**
 *
 * @param manager
 * @returns {{uninstall: ((function(*, boolean=, {}=): Promise<*>)|*), install: ((function(*, boolean=, boolean=, {}=): Promise<*>)|*), npx: ((function(*): (Promise<never>|Promise<*>))|*), run: ((function(*, {}=): Promise<*>)|*), has: ((function(*, boolean=): Promise<boolean|*>)|*)}|{uninstall: ((function(*, boolean=, {}=): Promise<*>)|*), install: ((function(*, boolean=, boolean=, {}=): Promise<*>)|*), npx: ((function(*): (Promise<never>|Promise<*>))|*), run: ((function(*, {}=): Promise<*>)|*), has: ((function(*, boolean=): Promise<boolean|*>)|*)}}
 */
export const getManager = (manager) => {
    switch (manager) {
        case 'pnpm':
            return {
                has: npmHas,
                install: pnpmInstall,
                uninstall: pnpmUninstall,
                run: pnpmRun,
                npx: pnpx
            };

        case 'yarn':
            return {
                has: npmHas,
                install: yarnInstall,
                uninstall: yarnUninstall,
                run: yarnRun,
                npx: yarnCreate
            };
        case 'npm':
        default:
            return {
                has: npmHas,
                install: npmInstall,
                uninstall: npmUninstall,
                run: npmRun,
                npx: npx
            };
    }
};
