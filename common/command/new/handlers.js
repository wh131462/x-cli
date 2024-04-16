import { readConfig, writeConfig } from '#common/utils/file/writeConfig.js';
import { defaultExport } from '#common/constants/config.js';
import { createDir, createFile } from '#common/utils/file/create.js';
import { removeFile } from '#common/utils/file/remove.js';
import { resolve } from 'node:path';
import { uiStorybookMain } from '#common/command/new/templates/ui-storybook-main.js';
import { pnpmInstall } from '#common/utils/manager/pnpm.js';
import { npx } from '#common/utils/manager/npm.js';
import { executeInteraction, executeTogether } from '#common/utils/node/execute.js';
import { existsSync } from 'node:fs';
import { inquire } from '#common/utils/ui/promot.js';

/**
 * 预处理
 * @param projectName
 * @returns {Promise<void>}
 */
export const handlePrepare = async (projectName) => {
    if (existsSync(resolve(process.cwd(), projectName))) {
        const del = await inquire('发现同名项目,是否确认删除此项目以创建新项目?', null, 'confirm');
        if (del) {
            await removeFile(resolve(process.cwd(), projectName));
        } else {
            throw new Error('用户拒绝了创建项目!');
        }
    }
};
/**.
 * 处理项目基础
 * @param projectName
 * @param prefix
 * @param manager
 * @param compLibName
 * @returns {Promise<void>}
 */
export const handleProject = async ({ projectName, prefix, manager, compLibName, playLibName }) => {
    await npx(
        `create-nx-workspace@16.10.0 ${projectName} --preset=apps --framework=none --packageManager=${manager} --nxCloud=skip --e2eTestRunner=none --workspaceType=integrated `
    );
    process.chdir(projectName);
    await pnpmInstall('@nx/angular@16.10.0', true);
    await executeInteraction(
        `nx g @nx/angular:library ${compLibName} --buildable=true --publishable=true --prefix=${prefix ?? ''} --importPath=${projectName} --skipTests=true`
    );
    await executeInteraction(
        `nx g @nx/angular:storybook-configuration ${compLibName} --interactionTests=false --generateStories=false --configureStaticServe=false`
    );
    await executeInteraction(`nx g @nx/angular:application ${playLibName} --routing=true --standalone=true`);
};
/**
 * 对目录的处理
 */
export const handleDirectory = async ({ compLibName, playLibName }) => {
    const dirs = ['components', 'directives', 'pipes'];
    const variablesPath = resolve(`${compLibName}/src/lib/styles/variables/public.scss`);
    const publishScssPath = resolve(`${compLibName}/src/lib/styles/public.scss`);
    const baseDocumentPath = resolve(`${compLibName}/src/document/readme.mdx`);
    const previewPath = `${compLibName}/.storybook/preview.ts`;
    const documentationPath = `${compLibName}/documentation.json`;
    const tsconfigPath = `${compLibName}/tsconfig.json`;
    const tsconfig = await readConfig(tsconfigPath);
    tsconfig.compilerOptions.resolveJsonModule = true;
    const mainPath = `${compLibName}/.storybook/main.ts`;
    await executeTogether(
        removeFile(`${compLibName}/src/lib/${compLibName}.module.ts`),
        removeFile(`${compLibName}/src/test-setup.ts`),
        ...dirs.map((dir) => {
            const tempDir = `${playLibName}/src/${dir}`;
            return createDir(tempDir);
        }),
        ...dirs.map((dir) => {
            const tempIndex = `${compLibName}/src/lib/${dir}/index.ts`;
            return writeConfig(tempIndex, defaultExport);
        }),
        writeConfig(
            `${compLibName}/src/index.ts`,
            dirs.reduce((reducer, dir) => (reducer += `export * from "./lib/${dir}";\n`), '')
        ),
        writeConfig(variablesPath, `@mixin variables() {\n}`),
        writeConfig(publishScssPath, `@import "./variables/public";\n@include variables();`),
        createFile(
            baseDocumentPath,
            `import { Meta, Controls } from '@storybook/blocks';\n<Meta title="文档/README" />\n# README`
        ),
        writeConfig(documentationPath, ''),
        writeConfig(
            previewPath,
            `import { setCompodocJson } from '@storybook/addon-docs/angular';\nimport docJson from '../documentation.json';\nsetCompodocJson(docJson);`
        ),
        writeConfig(tsconfigPath, tsconfig),
        createFile(mainPath, uiStorybookMain)
    );
};
/**
 * 处理storybook
 * @param compLibName
 * @returns {Promise<void>}
 */
export const handleStory = async ({ compLibName }) => {
    await pnpmInstall('@compodoc/compodoc', true);
    const storyTsConfigPath = resolve(`${compLibName}/.storybook/tsconfig.json`);
    const tsConfigStory = await readConfig(storyTsConfigPath);
    tsConfigStory?.include?.push('../src/**/*.ts');
    await writeConfig(storyTsConfigPath, tsConfigStory);
    const projectJsonPath = resolve(`${compLibName}/project.json`);
    const projectJson = await readConfig(projectJsonPath);
    const compodocConfig = {
        compodoc: true,
        compodocArgs: [
            '-e',
            'json',
            '-d',
            `${compLibName}/src`,
            '--u',
            '--disablePrivate',
            '--disableInternal',
            '--disableProtected',
            '--disableLifeCycleHooks'
        ],
        styles: [`${compLibName}/src/lib/styles/public.scss`]
    };
    Object.assign(projectJson.targets?.['storybook'].options, compodocConfig);
    Object.assign(projectJson.targets?.['build-storybook']?.options, compodocConfig);
    await writeConfig(projectJsonPath, projectJson);
};
/**
 * 处理package.json
 * @returns {Promise<void>}
 */
export const handlePackageJson = async ({ projectName, playLibName, compLibName }) => {
    const packageJsonPath = 'package.json';
    const packageJson = await readConfig(packageJsonPath);
    Object.assign(packageJson.scripts, {
        'fix:nx': 'rm -rf .nx && rm -rf .angular',
        'clean': 'rm -rf dist && rm -rf node_modules',
        'play': `nx run ${playLibName ?? 'play'}:serve`,
        'doc:serve': `nx run ${compLibName ?? 'ui'}:storybook`,
        'doc:build': `nx run ${compLibName ?? 'ui'}:build-storybook`,
        'ui:build': `nx run ${compLibName ?? 'ui'}:build`,
        'ui:unpublish': `npm unpublish ${projectName} --registry http://npm.runtongqiuben.com --force`,
        'ui:publish': `pnpm build && cd dist/${projectName} && npm publish --registry https://npm.runtongqiuben.com`
    });
    await writeConfig(packageJsonPath, packageJson);
};
/**
 * 处理xrc
 * @param projectName
 * @param manager
 * @param prefix
 * @param compLibName
 * @param playLibName
 * @returns {Promise<void>}
 */
export const handleXrx = async ({ projectName, manager, prefix, playLibName, compLibName }) => {
    const xConfigPath = '.xrc';
    const xConfig = {
        project: projectName,
        prefix: prefix,
        demoName: playLibName,
        libName: compLibName,
        manager: manager
    };
    await writeConfig(xConfigPath, xConfig);
};
