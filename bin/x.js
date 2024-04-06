#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';
const version = process.env.VERSION ?? DefaultVer;

program
    .version(version)
    .description(`A cli for any needed.`)
    .arguments('[command]')
    .option('-i, --install <module>', 'Install specified module.')
    .option('-c, --create <part>', 'Create specified part.')
    .option('-u, --uninstall <module>', 'Uninstall specified module.')
    .parse(process.argv);
// 接收值列表
const cmdArgs = program.args;
// 参数列表
const cmdOpts = program.opts();

console.log(cmdArgs, cmdOpts);
