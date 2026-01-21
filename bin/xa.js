#!/usr/bin/env node
import { program } from 'commander';
import { DefaultVer } from '#common/constants/x.const.js';
import { ai } from '#common/command/ai/ai.js';
import { logger } from '#common/utils/x/logger.js';

const version = process.env.VERSION ?? DefaultVer;

program
    .version(version)
    .description('X-CLI AI Workspace - Powered by OpenCode TUI')
    .option('-p, --provider [provider]', 'AI provider to use (interactive selection if not specified)')
    .option('-m, --model [model]', 'Model to use (interactive selection if not specified)')
    .option('-c, --config', 'Run configuration wizard')
    .option('--manage', 'Manage multiple providers (add/switch/edit/remove)')
    .action((options) => {
        ai(options)
            .catch((error) => {
                logger.error(error.message);
                process.exit(1);
            });
    });

program.parse(process.argv);
