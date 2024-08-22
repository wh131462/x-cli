import { readConfig, writeConfig } from '#common/utils/file/writeConfig.js';
import { defaultExport } from '#common/constants/config.js';
import { createDir, createFile, replaceFile } from '#common/utils/file/create.js';
import { removeFile } from '#common/utils/file/remove.js';
import { resolve } from 'node:path';
import { uiStorybookMain } from '#common/command/new/templates/ui-storybook-main.js';
import { npx } from '#common/utils/manager/npm.js';
import { executeByOrder, executeInteraction, executeTogether } from '#common/utils/node/execute.js';
import { existsSync } from 'node:fs';
import { inquire } from '#common/utils/ui/promot.js';
import { DefaultVer } from '#common/constants/x.const.js';
import { getManagerByName } from '#common/utils/manager/manager.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';
import { BaseReadmeTemplate } from '#common/command/new/templates/readme.js';
import { PreviewTemplate } from '#common/command/new/templates/preview.js';
import { appSelectRoutes, appSelectScss, appSelectTs } from '#common/command/new/templates/app-select.js';
import { gitignore } from '#common/command/new/templates/gitignore.js';

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
 * @param packageManager
 * @param componentLibName
 * @param demoLibName
 * @returns {Promise<void>}
 */
export const handleProject = async ({ projectName, packageManager, prefix, componentLibName, demoLibName }) => {
    await npx(
        `create-nx-workspace@16.10.0 ${projectName} --preset=apps --framework=none --packageManager=${packageManager} --nxCloud=skip --e2eTestRunner=none --workspaceType=integrated `
    );
    process.chdir(projectName);
    const manager = getManagerByName(packageManager);
    await manager.install('@nx/angular@16.10.0', true);
    // 防御性校验 - 安装nx
    if (!(await manager.has('nx', true))) {
        await manager.install('nx', true);
    }
    await executeInteraction(
        `nx g @nx/angular:library ${componentLibName} --buildable=true --publishable=true --prefix=${prefix ?? ''} --importPath=${projectName} --skipTests=true`
    );
    await executeInteraction(
        `nx g @nx/angular:storybook-configuration ${componentLibName} --interactionTests=false --generateStories=false --configureStaticServe=false`
    );
    await executeInteraction(`nx g @nx/angular:application ${demoLibName} --routing=true --standalone=true`);
};
/**
 * 对目录的处理
 */
export const handleDirectory = async ({ projectName, componentLibName, demoLibName }) => {
    const dirs = ['components', 'directives', 'pipes'];
    const variablesPath = resolve(`${componentLibName}/src/lib/styles/variables/public.scss`);
    const publishScssPath = resolve(`${componentLibName}/src/lib/styles/public.scss`);
    const baseDocumentPath = resolve(`${componentLibName}/src/document/readme.mdx`);
    const previewPath = `${componentLibName}/.storybook/preview.ts`;
    const documentationPath = `${componentLibName}/documentation.json`;
    const tsconfigPath = `${componentLibName}/tsconfig.json`;
    const tsconfig = await readConfig(tsconfigPath);
    tsconfig.compilerOptions.resolveJsonModule = true;
    const mainPath = `${componentLibName}/.storybook/main.ts`;
    await executeTogether(
        // library
        removeFile(`${componentLibName}/src/lib/${componentLibName}.module.ts`),
        removeFile(`${componentLibName}/src/test-setup.ts`),
        ...dirs.map((dir) => {
            const tempIndex = `${componentLibName}/src/lib/${dir}/index.ts`;
            return writeConfig(tempIndex, defaultExport);
        }),
        writeConfig(
            `${componentLibName}/src/index.ts`,
            dirs.reduce((reducer, dir) => (reducer += `export * from "./lib/${dir}";\n`), '')
        ),
        writeConfig(variablesPath, `@mixin variables() {\n}`),
        writeConfig(publishScssPath, `@import "./variables/public";\n@include variables();`),
        createFile(baseDocumentPath, BaseReadmeTemplate),
        writeConfig(documentationPath, '{}'),
        writeConfig(previewPath, PreviewTemplate),
        writeConfig(tsconfigPath, tsconfig),
        createFile(mainPath, uiStorybookMain),
        // demo
        ...dirs.map((dir) => {
            const tempDir = `${demoLibName}/src/${dir}`;
            return createDir(tempDir);
        }),
        removeFile(`${demoLibName}/src/app/nx-welcome.component.ts`),
        removeFile(`${demoLibName}/src/app/app.component.spec.ts`),
        removeFile(`${demoLibName}/src/app/app.component.css`),
        createFile(`${demoLibName}/src/app/app.component.scss`),
        replaceFile(
            `${demoLibName}/src/app/app.component.html`,
            `<${projectName}-nx-welcome></${projectName}-nx-welcome> `,
            ''
        ),
        // 去除 ts 中的多余内容
        replaceFile(`${demoLibName}/src/app/app.component.ts`, [
            [`import { NxWelcomeComponent } from './nx-welcome.component';`, ''],
            [`NxWelcomeComponent, `, ''],
            [`'./app.component.css'`, '']
        ])
    );
};
/**
 * 处理选择
 * @param projectName
 * @param componentLibName
 * @param demoLibName
 * @returns {Promise<void>}
 */
export const handleSelect = async ({ projectName, componentLibName, demoLibName }) => {
    // 创建两个文件
    // 修改路由
    await executeTogether(
        createFile(`${demoLibName}/src/app/app.select.ts`, appSelectTs(kebabcase(projectName))),
        createFile(`${demoLibName}/src/app/app.select.scss`, appSelectScss),
        createFile(`${demoLibName}/src/app/app.routes.ts`, appSelectRoutes)
    );
};
/**
 * 处理storybook
 * @param componentLibName
 * @param packageManager
 * @returns {Promise<void>}
 */
export const handleStory = async ({ packageManager, componentLibName }) => {
    await getManagerByName(packageManager).install(
        [
            '@compodoc/compodoc',
            '@storybook/addon-essentials',
            '@storybook/addon-docs',
            '@storybook/react-dom-shim',
            '@storybook/builder-webpack5',
            'esbuild@^0.19.2',
            'react',
            'react-dom'
        ],
        true
    );
    const storyTsConfigPath = resolve(`${componentLibName}/.storybook/tsconfig.json`);
    const tsConfigStory = await readConfig(storyTsConfigPath);
    tsConfigStory?.include?.push('../src/**/*.ts');
    await writeConfig(storyTsConfigPath, tsConfigStory);
    // 调整json支持
    const tsBaseConfigPath = resolve('tsconfig.base.json');
    const tsBaseConfig = await readConfig(tsBaseConfigPath);
    tsBaseConfig.compilerOptions.resolveJsonModule = true;
    tsBaseConfig.compilerOptions.allowSyntheticDefaultImports = true;
    await writeConfig(tsBaseConfigPath, tsBaseConfig);
    // main.ts 调整
    const mainPath = resolve(`${componentLibName}/.storybook/main.ts`);

    const projectJsonPath = resolve(`${componentLibName}/project.json`);
    const projectJson = await readConfig(projectJsonPath);
    const compodocConfig = {
        compodoc: true,
        compodocArgs: [
            '-e',
            'json',
            '-d',
            `${componentLibName}/src`,
            '-p',
            `${componentLibName}/tsconfig.json`,
            '--disablePrivate',
            '--disableInternal',
            '--disableProtected',
            '--disableLifeCycleHooks'
        ],
        styles: [`${componentLibName}/src/lib/styles/public.scss`]
    };
    Object.assign(projectJson.targets?.['storybook'].options, compodocConfig);
    Object.assign(projectJson.targets?.['build-storybook']?.options, compodocConfig);
    await writeConfig(projectJsonPath, projectJson);
    await createFile(`.gitignore`, gitignore);
};
/**
 * 处理package.json
 * @returns {Promise<void>}
 */
export const handlePackageJson = async ({ projectName, componentLibName, demoLibName, registry }) => {
    const packageJsonPath = 'package.json';
    const packageJson = await readConfig(packageJsonPath);
    Object.assign(packageJson.scripts, {
        'fix:nx': 'rm -rf .nx && rm -rf .angular',
        'clean': 'rm -rf dist && rm -rf node_modules',
        'play': `nx run ${demoLibName ?? 'play'}:serve`,
        'doc:serve': `nx run ${componentLibName ?? 'ui'}:storybook`,
        'doc:build': `nx run ${componentLibName ?? 'ui'}:build-storybook`,
        'ui:build': `nx run ${componentLibName ?? 'ui'}:build`,
        'ui:unpublish': `npm unpublish ${projectName} --force --registry ${registry}`,
        'ui:publish': `pnpm build && cd dist/${projectName} && npm publish --registry ${registry}`
    });
    await writeConfig(packageJsonPath, packageJson);
};
/**
 * 处理xrc
 * @param projectName
 * @param packageManager
 * @param prefix
 * @param componentLibName
 * @param demoLibName
 * @returns {Promise<void>}
 */
export const handleXrc = async ({ projectName, packageManager, prefix, componentLibName, demoLibName }) => {
    const xConfigPath = '.xrc';
    const xConfig = {
        version: process.env.VERSION ?? DefaultVer,
        name: projectName,
        prefix: prefix,
        projects: {
            [componentLibName]: {
                type: 'component'
            },
            [demoLibName]: {
                type: 'demo'
            }
        },
        packageManager: packageManager
    };
    await writeConfig(xConfigPath, xConfig);
};
