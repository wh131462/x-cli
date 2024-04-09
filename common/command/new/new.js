import { executeInteraction } from '#common/utils/node/execute.js';
import { npmInstall } from '#common/utils/manager/npm.js';
import { readConfig, writeConfig } from '#common/utils/file/writeConfig.js';
import { resolve } from 'node:path';
import { pnpmInstall } from '#common/utils/manager/pnpm.js';
import { createFile, readFile } from '#common/utils/file/create.js';

export const newProject = async (projectName) => {
    await executeInteraction(`npx create-nx-workspace@latest ${projectName} --packageManager=pnpm`);
    process.chdir(projectName);
    await pnpmInstall('@nx/angular@16.10.0', true);
    await executeInteraction(
        `nx g @nx/angular:library ui --buildable=true --publishable=true --prefix=cses --importPath=${projectName} --skipTests=true`
    );
    await executeInteraction(`nx g @nx/angular:storybook-configuration ui`);
    await executeInteraction(`nx g @nx/angular:application play`);
    // 添加compodoc 配置
    // 1. 添加依赖
    await pnpmInstall('@compodoc/compodoc', true);
    // 2. 更改 ui/.storybook/tsconfig.json -> include + "../src/**/*.ts"
    const storyTsConfigPath = resolve('ui/.storybook/tsconfig.json');
    const tsConfigStory = await readConfig(storyTsConfigPath);
    tsConfigStory?.include?.push('../src/**/*.ts');
    await writeConfig(storyTsConfigPath, tsConfigStory);
    // 3. 设置 ui/project.json -> targets.[storybook,build-storybook].options +
    const projectJsonPath = resolve('ui/project.json');
    const projectJson = await readConfig(projectJsonPath);
    const compodocConfig = {
        compodoc: true,
        compodocArgs: [
            '-e',
            'json',
            '-d',
            'ui/src',
            '--u',
            '--disablePrivate',
            '--disableInternal',
            '--disableProtected',
            '--disableLifeCycleHooks'
        ],
        styles: ['ui/src/lib/styles/public.scss']
    };
    Object.assign(projectJson.targets?.['storybook'].options, compodocConfig);
    Object.assign(projectJson.targets?.['build-storybook']?.options, compodocConfig);
    await writeConfig(projectJsonPath, projectJson);
    // 4. style 创建 styles -> [ variables,public.scss ]
    const variablesPath = resolve('ui/styles/variables/publish.scss');
    const publishScssPath = resolve('ui/styles/publish.scss');
    await writeConfig(variablesPath, `@mixin variables() {\n}`);
    await writeConfig(publishScssPath, `@import "./variables/public";\n@include variables();`);

    // 5. 在 ui/.storybook/preview.ts  创建文件  ui/documentation.json
    const previewPath = 'ui/.storybook/preview.ts';
    const documentationPath = 'ui/documentation.json';
    await writeConfig(documentationPath, '');
    await writeConfig(
        previewPath,
        `import { setCompodocJson } from '@storybook/addon-docs/angular';\nimport docJson from '../documentation.json';\nsetCompodocJson(docJson);`
    );
    // 6. ui/tsconfig.json + compilerOptions -> "resolveJsonModule": true
    const tsconfigPath = 'ui/tsconfig.json';
    const tsconfig = await readConfig(tsconfigPath);
    tsconfig.compilerOptions.resolveJsonModule = true;
    await writeConfig(tsconfigPath, tsconfig);
    // 7. ui/.storybook/main.ts +
    // docs: {
    //     autodocs: true,
    //     defaultName: '说明',
    //   },
    const mainPath = 'ui/.storybook/main.ts';
    const mainContent = await readFile(mainPath);
    await createFile(mainPath, mainContent);

    // 8. 在package.json 中添加指令
    const packageJsonPath = 'package.json';
    const packageJson = await readConfig(packageJsonPath);
    Object.assign(packageJson.scripts, {
        'fix:nx': 'rm -rf .nx && rm -rf .angular',
        'clean': 'rm -rf dist && rm -rf node_modules',
        'play': 'nx run play:serve',
        'doc:serve': 'nx run ui:storybook',
        'doc:build': 'nx run ui:build-storybook',
        'ui:build': 'nx run ui:build',
        'ui:unpublish': 'npm unpublish cses-ui --registry http://npm.runtongqiuben.com --force',
        'ui:publish': 'pnpm build && cd dist/cses-ui && npm publish --registry https://npm.runtongqiuben.com'
    });
};
