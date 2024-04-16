#!/usr/bin/env node
import { program } from 'commander';
import { plugin } from '#common/command/plugin/plugin.js';
import { logger } from '#common/utils/logger.js';
import { DefaultVer } from '#common/constants/x.const.js';
const version = process.env.VERSION ?? DefaultVer;

program
    .command('[script]')
    .version(version)
    .description('Run the specified script by correctly.')
    .action((script) => {
        console.log(script);
        //
        // plugin(action, pluginName)
        //     .then(() => {
        //         logger.info(`The ${pluginName ?? 'plugins'} has been ${action}ed.`);
        //         process.exit(0);
        //     })
        //     .catch(() => process.exit(1));
    });
