#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';
import { Examples } from '#common/constants/text.js';
import { init } from '#common/command/init/init.js';
import { logger } from '#common/utils/x/logger.js';
import { plugin } from '#common/command/plugin/plugin.js';
import { update } from '#common/command/update/update.js';
import { newProject } from '#common/command/new/new.js';
import { loadFile } from '#common/utils/file/create.js';
import { resolve } from 'node:path';
import { rootPath } from '#common/utils/file/path.js';

const version = process.env.VERSION ?? DefaultVer;

program
    .version(version)
    .description('A CLI for creating frontend projects and managing dev tools.')
    .allowUnknownOption()
    .on('command:*', (cmd) => {
        logger.error(`Invalid command: ${cmd}`);
        process.exit(1);
    })
    .on('--help', () => {
        console.log(Examples);
        process.exit(0);
    });

// 初始化 CLI 依赖
program
    .command('init')
    .description('Initialize CLI dependencies')
    .action(() => {
        logger.info('Initializing CLI dependencies...');
        init()
            .then(() => {
                logger.info('CLI dependencies initialized.');
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

// 创建新项目
program
    .command('new <projectName>')
    .description('Create a new project (Vue/React/Angular)')
    .action((projectName) => {
        logger.info(`Creating new project: ${projectName}`);
        newProject(projectName)
            .then(() => {
                logger.info(`Project ${projectName} created successfully.`);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

// 插件管理
program
    .command('plugin <action> [pluginName]')
    .description('Manage dev tools (install/uninstall/list/init)')
    .action((action, pluginName) => {
        plugin(action, pluginName)
            .then(() => {
                if (action !== 'list') {
                    logger.info('Operation completed.');
                }
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

// 更新
program
    .command('update')
    .description('Update x-cli to latest version')
    .action(() => {
        logger.info('Updating...');
        update()
            .then(() => {
                logger.info('Updated.');
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

// 文档
program
    .command('doc')
    .description('Display documentation')
    .action(() => {
        logger.off();
        loadFile(resolve(rootPath, 'readme.md'))
            .then((content) => {
                logger.on();
                console.info(content);
                process.exit(0);
            })
            .catch(() => process.exit(1));
    });

program.parse(process.argv);
