#!/usr/bin/env node
import { program } from 'commander';
import { logger } from '#common/utils/x/logger.js';
import { DefaultVer } from '#common/constants/x.const.js';
import { xr, selectScript } from '#common/command/xr/xr.js';

const version = process.env.VERSION ?? DefaultVer;

program
    .version(version)
    .arguments('[script]')
    .allowUnknownOption(true)
    .description('Run the specified script by correctly.')
    .action(async (script) => {
        try {
            // 如果没有指定脚本，进入交互式选择模式
            if (!script) {
                const selectedScript = await selectScript();
                if (!selectedScript) {
                    process.exit(1);
                }
                script = selectedScript;
            }

            logger.info(`The script ${script} is running...`);
            const extraOptions = program.args.slice(1).join(' ');
            const command = extraOptions ? `${script} ${extraOptions}` : script;
            await xr(command);
            logger.info(`The ${script} has been executed successfully.`);
            process.exit(0);
        } catch {
            process.exit(1);
        }
    });

program.parse(process.argv);
