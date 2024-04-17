import { setRoot } from '#common/utils/x/setRoot.js';
import { readConfig } from '#common/utils/file/writeConfig.js';
import { getManager } from '#common/utils/manager/manager.js';
import { logger } from '#common/utils/x/logger.js';
import { npmRun } from '#common/utils/manager/npm.js';

/**
 * xr
 * npm run xxx / yarn / pnpm run
 */
export const xr = async (script, force = false) => {
    if (!script) {
        const warning = 'Please enter the script name';
        logger.warn(warning);
        throw new Error(warning);
    }
    if (!force) {
        await setRoot();
        const { manager } = await readConfig('.xrc');
        const { run } = getManager(manager);
        await run(script);
    } else {
        await npmRun(script);
    }
};
