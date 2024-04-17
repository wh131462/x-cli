import { setRoot } from '#common/utils/x/setRoot.js';
import { readConfig } from '#common/utils/file/writeConfig.js';
import { getManager } from '#common/utils/manager/manager.js';
import { logger } from '#common/utils/x/logger.js';

/**
 * xr
 * npm run xxx / yarn / pnpm run
 */
export const xr = async (script) => {
    if (!script) {
        const warning = 'Please enter the script name';
        logger.warn(warning);
        throw new Error(warning);
    }
    await setRoot();
    const { manager } = await readConfig('.xrc');
    const { run } = getManager(manager);
    await run(script);
};
