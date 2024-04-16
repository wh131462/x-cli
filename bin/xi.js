#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';

const version = process.env.VERSION ?? DefaultVer;
program
    .version(version)
    .allowUnknownOption() // 允许未知选项，以便我们可以捕获自定义命令
    .arguments('[packageName]')
    .option('-D,--save-dev', 'Save as development dependency')
    .option('-g,--global', 'Save as global dependency')
    .description('Install or uninstall a dependency in the project.')
    .action((packageName, { saveDev, global }) => {
        console.log(packageName, saveDev, global);
        // manager(packageName)
        //     .then(() => {
        //         logger.info(``);
        //         process.exit(0);
        //     })
        //     .catch(() => process.exit(1));
    });

program.parse(process.argv);
