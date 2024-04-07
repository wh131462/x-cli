#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';

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
        console.log(`\nExamples:\n  # Initialize a new project\n  $ x new myProject\n  # Create a component\n`);
        console.log('  $ x create component myComponent -d src/App');
        console.log('');
        console.log('  # Remove a service');
        console.log('  $ x remove service myService -d src/App');
        console.log('');
        console.log('  # Add a plugin');
        console.log('  $ x plugin add myPlugin');
        console.log('');
    });
// 处理自定义命令
program
    .command('new <projectName>')
    .description('Initialize a new project')
    .action((projectName) => {
        console.log(`Initializing new project: ${projectName}`);
        // todo 创建项目
    });

program
    .command('create <type> <name> [-d <directory>]')
    .description('Create a new component, directive, pipe, service, or documentation')
    .action((type, name, directory) => {
        console.log(`Creating ${type} named ${name}`);
        // todo 调用创建组件的逻辑
    });

program
    .command('remove <type> <name>')
    .option('-d,--directory <directory>')
    .description('Remove an existing component, directive, pipe, service, or documentation')
    .action((type, name, { directory }) => {
        console.log(`Removing ${type} named ${name}`, directory);
        // todo 调用移除组件的逻辑
    });

program
    .command('plugin <add|remove|list> [pluginName]')
    .description('Manage plugins by adding, removing, or listing them')
    .action((action, pluginName) => {
        console.log(`Plugin action: ${action}, Plugin name: ${pluginName}`);
        // todo 调用插件管理的逻辑 plugin(action, pluginName);
    });

program
    .command('update')
    .description('Update x-cli to lts.')
    .action(() => {
        console.log(`Updating...`);
        // todo 更新逻辑
    });

program.parse(process.argv);
