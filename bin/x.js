#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';
import { Examples } from '#common/constants/text.js';
import { init } from '#common/command/init/init.js';
import { logger } from '#common/utils/logger.js';
import { plugin } from '#common/command/plugin/plugin.js';
import { update } from '#common/command/update/update.js';
import { newProject } from '#common/command/new/new.js';

const version = process.env.VERSION ?? DefaultVer;
program
    .version(version)
    .description(`A cli for any create standard project.`)
    .allowUnknownOption() // 允许未知选项，以便我们可以捕获自定义命令
    .on('command:*', (cmd) => {
        console.error(`Invalid command: ${cmd}`);
        process.exit(1);
    })
    .on('--help', () => {
        console.log(Examples);
    });

// 初始化
program
    .command('init')
    .description('Initialize cli dependencies')
    .action(() => {
        logger.info(`Initializing cli dependencies`);
        init()
            .then(() => {
                logger.info(`Initialized cli dependencies`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });
// 处理自定义命令
program
    .command('new <projectName>')
    .description('Initialize a new project')
    .action((projectName) => {
        logger.info(`Initializing new project: ${projectName}`);
        newProject(projectName)
            .then(() => {
                logger.info(`Initialized new project: ${projectName}.`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program
    .command('create <type> <name> [-d <directory>]')
    .description('Create a new component, directive, pipe, service, or documentation')
    .action((type, name, directory) => {
        logger.info(`Creating ${type} named ${name}`);
        // todo 调用创建组件的逻辑
    });

program
    .command('remove <type> <name>')
    .option('-d,--directory <directory>')
    .description('Remove an existing component, directive, pipe, service, or documentation')
    .action((type, name, { directory }) => {
        logger.info(`Removing ${type} named ${name}`, directory);
        // todo 调用移除组件的逻辑
    });

program
    .command('plugin <add|remove|list> [pluginName]')
    .description('Manage plugins by adding, removing, or listing them')
    .action((action, pluginName) => {
        plugin(action, pluginName)
            .then(() => {
                logger.info(`The ${pluginName ?? 'plugins'} has been ${action}ed.`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program
    .command('update')
    .description('Update x-cli to lts.')
    .action(() => {
        logger.info(`Updating...`);
        update()
            .then(() => {
                logger.info(`Updated.`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program.parse(process.argv);
