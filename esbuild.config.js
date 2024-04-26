import { resolve } from 'node:path';
import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import esbuild from 'esbuild';
import { rootPath } from '#common/utils/file/path.js';
import { getPackageJson } from '#common/utils/file/getPackageJson.js';
import { executeTogether } from '#common/utils/node/execute.js';
import { logger } from '#common/utils/x/logger.js';

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
async function clean() {
    await rm(resolve(rootPath, outputDir), { recursive: true, force: true });
}

/**
 * 构建完成后的操作
 * @returns {Promise<void>}
 */
async function afterBuild() {
    await makePackageJson();
    await copyDocs();
    await copyResources();
}

/**
 * 创建package.json
 * @returns {Promise<void>}
 */
async function makePackageJson() {
    const publishExcludeFields = ['scripts', 'devDependencies', 'imports', 'main', 'config', 'packageManager'];
    const newPackageJson = packageJson;
    publishExcludeFields?.forEach((key) => {
        delete newPackageJson[key];
    });
    await writeFile(resolve(rootPath, `${outputDir}/package.json`), JSON.stringify(newPackageJson));
}

/**
 * 复制文档
 */
async function copyDocs() {
    const docs = ['readme.md'];
    await Promise.allSettled(
        docs.map((doc) => {
            copyFile(resolve(rootPath, doc), resolve(rootPath, `${outputDir}/${doc}`));
        })
    );
}

/**
 * 复制资源文件
 * @returns {Promise<void>}
 */
async function copyResources() {
    try {
        const files = await readdir(resolve(rootPath, 'resources'), 'utf8');
        await executeTogether(
            mkdir(resolve(rootPath, `${outputDir}/resources`)),
            ...files.map((file) =>
                copyFile(resolve(rootPath, 'resources', file), resolve(rootPath, `${outputDir}/resources/${file}`))
            )
        );
    } catch (error) {
        logger.error('An error occurred while copying resources:', error);
        throw error;
    }
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
        logger.info(e);
        process.exit(1);
    }
}

await main();
