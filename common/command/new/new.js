import { executeInteraction } from '#common/utils/node/execute.js';
import { npx } from '#common/utils/manager/npm.js';
import { readConfig, writeConfig } from '#common/utils/file/writeConfig.js';
import { resolve } from 'node:path';
import { pnpmInstall } from '#common/utils/manager/pnpm.js';
import { createFile } from '#common/utils/file/create.js';
import { uiStorybookMain } from '#common/command/new/templates/ui-storybook-main.js';
import { inquire } from '#common/utils/ui/promote.js';

export const newProject = async (projectName) => {
    // 执行创建工作区
    await npx(
        `create-nx-workspace@16.10.0 ${projectName} --preset=apps --framework=none --packageManager=pnpm --nxCloud=skip --e2eTestRunner=none --workspaceType=integrated `
    );
    process.chdir(projectName);
    await pnpmInstall('@nx/angular@16.10.0', true);
    // 获取前缀
    const compLibName = await inquire('请输入组件库的名称(回车确认)', 'ui');
    const prefix = await inquire('请输入组件库使用的组件前缀[prefix](回车确认)', compLibName);
    const playLibName = await inquire('请输入demo库的名称(回车确认)', 'play');
    await executeInteraction(
        `nx g @nx/angular:library ${compLibName ?? 'ui'} --buildable=true --publishable=true --prefix=${prefix ?? ''} --importPath=${projectName} --skipTests=true`
    );
    await executeInteraction(
        `nx g @nx/angular:storybook-configuration ${compLibName ?? 'ui'} --interactionTests=false --generateStories=false --configureStaticServe=false`
    );
    await executeInteraction(`nx g @nx/angular:application ${playLibName ?? 'play'} --routing=true --standalone=true`);
    // 添加compodoc 配置
    // 1. 添加依赖
    await pnpmInstall('@compodoc/compodoc', true);
    // 2. 更改 ui/.storybook/tsconfig.json -> include + "../src/**/*.ts"
    const storyTsConfigPath = resolve(`${compLibName ?? 'ui'}/.storybook/tsconfig.json`);
    const tsConfigStory = await readConfig(storyTsConfigPath);
    tsConfigStory?.include?.push('../src/**/*.ts');
    await writeConfig(storyTsConfigPath, tsConfigStory);
    // 3. 设置 ui/project.json -> targets.[storybook,build-storybook].options +
    const projectJsonPath = resolve(`${compLibName ?? 'ui'}/project.json`);
    const projectJson = await readConfig(projectJsonPath);
    const compodocConfig = {
        compodoc: true,
        compodocArgs: [
            '-e',
            'json',
            '-d',
            `${compLibName ?? 'ui'}/src`,
            '--u',
            '--disablePrivate',
            '--disableInternal',
            '--disableProtected',
            '--disableLifeCycleHooks'
        ],
        styles: [`${compLibName ?? 'ui'}/src/lib/styles/public.scss`]
    };
    Object.assign(projectJson.targets?.['storybook'].options, compodocConfig);
    Object.assign(projectJson.targets?.['build-storybook']?.options, compodocConfig);
    await writeConfig(projectJsonPath, projectJson);
    // 4. style 创建 styles -> [ variables,public.scss ]
    const variablesPath = resolve(`${compLibName ?? 'ui'}/styles/variables/publish.scss`);
    const publishScssPath = resolve(`${compLibName ?? 'ui'}/styles/publish.scss`);
    await writeConfig(variablesPath, `@mixin variables() {\n}`);
    await writeConfig(publishScssPath, `@import "./variables/public";\n@include variables();`);

    // 5. 在 ui/.storybook/preview.ts  创建文件  ui/documentation.json
    const previewPath = `${compLibName ?? 'ui'}/.storybook/preview.ts`;
    const documentationPath = `${compLibName ?? 'ui'}/documentation.json`;
    await writeConfig(documentationPath, '');
    await writeConfig(
        previewPath,
        `import { setCompodocJson } from '@storybook/addon-docs/angular';\nimport docJson from '../documentation.json';\nsetCompodocJson(docJson);`
    );
    // 6. ui/tsconfig.json + compilerOptions -> "resolveJsonModule": true
    const tsconfigPath = `${compLibName ?? 'ui'}/tsconfig.json`;
    const tsconfig = await readConfig(tsconfigPath);
    tsconfig.compilerOptions.resolveJsonModule = true;
    await writeConfig(tsconfigPath, tsconfig);
    // 7. ui/.storybook/main.ts
    const mainPath = `${compLibName ?? 'ui'}/.storybook/main.ts`;
    await createFile(mainPath, uiStorybookMain);

    // 8. 在package.json 中添加指令
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
