import { logger } from '#common/utils/x/logger.js';
import { managerExec } from '#common/utils/x/managerExec.js';

/**
 * xr
 * npm run xxx / yarn / pnpm run
 */
export const xr = async (script) => {
    if (!script) {
        const warning = '[X] Please enter the script name.';
        logger.warn(warning);
        throw new Error(warning);
    }
    await managerExec(async ({ run }) => {
        await run(script);
    });
};
