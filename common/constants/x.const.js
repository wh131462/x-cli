import { PNPM_INSTALL } from '#common/utils/manager/pnpm.js';
import { exec } from 'child_process';
import { npmInstall } from '#common/utils/manager/npm.js';

export const DefaultVer = '0.0.0';
/**
 * 依赖项
 * @type {[{install: ((function(): Promise<*>)|*), name: string, check: ((function(): Promise<*>)|*)}]}
 */
export const cli_dependencies = [
    {
        name: 'pnpm',
        check: () => {
            return new Promise((resolve, reject) => {
                exec('pnpm -v', (error, stdout, stderr) => {
                    if (error) resolve(false);
                    resolve(!!stdout.includes('.'));
                });
            });
        },
        install: PNPM_INSTALL
    },
    {
        name: 'nx',
        check: () => {
            return new Promise((resolve) => {
                exec('nx --version', (error, stdout, stderr) => {
                    if (error) resolve(false);
                    resolve(!!stdout.includes('.'));
                });
            });
        },
        install: async () => {
            await npmInstall('nx', false, true);
        }
    }
];
