#!/usr/bin/env node
import { program } from 'commander';
import { logger } from '#common/utils/x/logger.js';
import { DefaultVer } from '#common/constants/x.const.js';
import { xr } from '#common/command/xr/xr.js';

const version = process.env.VERSION ?? DefaultVer;

program
    .version(version)
    .arguments('[script]')
    .description('Run the specified script by correctly.')
    .action((script) => {
        logger.info(`The script ${script} is running...`);
        xr(script)
            .then(() => {
                logger.info(`The ${script} has been executed successfully.`);
                process.exit(0);
            })
            .catch(() => {
                process.exit(1);
            });
    });

program.parse(process.argv);
