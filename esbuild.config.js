import path from 'node:path';
import fs from 'node:fs';
import esbuild from 'esbuild';
import { rootPath } from '#common/utils/env.js';

// 读取 package.json 文件内容
const packageJson = JSON.parse(fs.readFileSync(path.resolve(rootPath, 'package.json'), 'utf-8'));
const outputDir = 'dist';
const esbuildConfig = {
    entryPoints: ['bin/x.js'],
    outdir: `${outputDir}/bin`,
    platform: 'node',
    target: ['node20'],
    format: 'esm',
    bundle: true,
    minify: true,
    packages: 'external',
    define: {
        'process.env.VERSION': JSON.stringify(packageJson.version)
    }
};

// 清理文件
function clean() {
    return new Promise((resolve) => {
        fs.rm(path.resolve(rootPath, outputDir), { recursive: true }, (err) => {
            if (err) resolve();
            else resolve();
        });
    });
}

/**
 * 主进程
 */
async function main() {
    await clean();
    await esbuild
        .build(esbuildConfig)
        .then(() => {
            // 构建完成后执行的操作
            process.exit(0);
        })
        .catch((e) => {
            process.exit(1);
        });
}

await main();
