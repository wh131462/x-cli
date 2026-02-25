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
    .action((_packageName, { saveDev, global }) => {
        const packages = [];
        const extraArgs = [];
        for (const arg of program.args) {
            if (arg.startsWith('-')) {
                extraArgs.push(arg);
            } else {
                packages.push(arg);
            }
        }
        xi(packages.length ? packages : undefined, saveDev, global, extraArgs)
            .then(() => {
                const installedPackages = packages.filter((p) => !p.startsWith('-'));
                logger.info(
                    installedPackages.length
                        ? `The [${installedPackages}] have been installed successfully.`
                        : 'Dependencies installed successfully.'
                );
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program.parse(process.argv);
