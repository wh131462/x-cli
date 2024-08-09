#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';
import { xi } from '#common/command/xi/xi.js';
import { logger } from '#common/utils/x/logger.js';

const version = process.env.VERSION ?? DefaultVer;
program
    .version(version)
    .arguments('[packageName]')
    .option('-D,--save-dev', 'Save as development dependency')
    .option('-g,--global', 'Save as global dependency')
    .description('Install or uninstall a dependency in the project.')
    .allowUnknownOption(true)
    .action((packageName, { saveDev, global }) => {
        xi(packageName, saveDev, global)
            .then(() => {
                logger.info(`The ${packageName ?? 'packages'} has been installed successfully.`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program.parse(process.argv);
