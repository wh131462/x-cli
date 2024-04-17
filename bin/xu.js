#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';
import { logger } from '#common/utils/x/logger.js';
import { xu } from '#common/command/xu/xu.js';

const version = process.env.VERSION ?? DefaultVer;
program
    .version(version)
    .arguments('[packageName]')
    .option('-g,--global', 'Uninstall the global dependency')
    .description('Uninstall a dependency in the project.')
    .action((packageName, { global }) => {
        xu(packageName, global)
            .then(() => {
                logger.info(`The ${packageName} has been uninstalled successfully.`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program.parse(process.argv);
