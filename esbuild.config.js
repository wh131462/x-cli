import path from 'node:path';
import fs from 'node:fs';
import esbuild from 'esbuild';
import { rootPath } from '#common/utils/file/path.js';
import { getPackageJson } from '#common/utils/file/getPackageJson.js';
const packageJson = getPackageJson();
const outputDir = 'dist';
const esbuildConfig = {
    entryPoints: ['bin/x.js', 'bin/xi.js', 'bin/xu.js', 'bin/xr.js'],
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

/**
 * 清理文件
 */
function clean() {
    return new Promise((resolve) => {
        fs.rm(path.resolve(rootPath, outputDir), { recursive: true }, (err) => {
            if (err) resolve();
            else resolve();
        });
    });
}

/**
 * 构建完成后的操作
 * @returns {Promise<void>}
 */
async function afterBuild() {
    await makePackageJson();
    await copyDocs();
}

/**
 * 创建package.json
 * @returns {Promise<void>}
 */
function makePackageJson() {
    return new Promise((resolve) => {
        const publishExcludeFields = ['scripts', 'devDependencies', 'imports', 'main', 'config', 'packageManager'];
        const newPackageJson = packageJson;
        publishExcludeFields?.forEach((key) => {
            delete newPackageJson[key];
        });
        fs.writeFileSync(path.resolve(rootPath, `${outputDir}/package.json`), JSON.stringify(newPackageJson));
        resolve();
    });
}

/**
 * 复制文档
 */
function copyDocs() {
    return new Promise((resolve) => {
        const docs = ['readme.md'];
        docs.forEach((doc) => {
            fs.copyFileSync(path.resolve(rootPath, doc), path.resolve(rootPath, `${outputDir}/${doc}`));
        });
        resolve();
    });
}
/**
 * 主进程
 */
async function main() {
    try {
        await clean();
        await esbuild.build(esbuildConfig);
        await afterBuild();
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}

await main();
