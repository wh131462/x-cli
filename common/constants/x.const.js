import { PNPM_INSTALL } from '#common/utils/manager/pnpm.js';
import { exec } from 'child_process';

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
                    if (error) reject();
                    if (stdout.includes('.')) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            });
        },
        install: PNPM_INSTALL
    }
];
