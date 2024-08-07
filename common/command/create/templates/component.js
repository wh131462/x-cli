import { createDir, createFile, replaceFile, updateFile } from '#common/utils/file/create.js';
import { resolve } from 'node:path';
import { executeTogether } from '#common/utils/node/execute.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import { getXConfig } from '#common/utils/x/getXConfig.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

/**
 * 创建组件
 * html scss ts stories index
 * @param name
 * @param directory
 * @param needExport
 * @returns {Promise<void>}
 */
export const createComponent = async (name, directory, { needExport = false } = {}) => {
    const { prefix } = await getXConfig();
    name = kebabcase(name);
    const componentDir = resolve(directory, name);
    const componentsIndexPath = resolve(directory, 'index.ts');

    const htmlPath = resolve(componentDir, `${name}.component.html`);
    const scssPath = resolve(componentDir, `${name}.component.scss`);
    const tsPath = resolve(componentDir, `${name}.component.ts`);
    const storiesPath = resolve(componentDir, `${name}.stories.ts`);
    const indexPath = resolve(componentDir, `index.ts`);
    // 1. 创建组件目录
    await createDir(componentDir);
    // 2. 创建文件
    const tags = { name, prefix };
    await executeTogether(
        createFile(htmlPath, convertTemplateByTags(componentHTML, tags)),
        createFile(scssPath, convertTemplateByTags(componentSCSS, tags)),
        createFile(tsPath, convertTemplateByTags(componentTS, tags)),
        createFile(storiesPath, convertTemplateByTags(componentStory, tags)),
        createFile(indexPath, convertTemplateByTags(componentIndex, tags))
    );

    // 3. 导出组件
    if (needExport) await updateFile(componentsIndexPath, convertTemplateByTags(externalIndex, tags));
};
/**
 * 创建组件对应的demo
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const createComponentDemo = async (name, directory) => {
    const { prefix, name: project } = await getXConfig();
    name = kebabcase(name);
    const demoDir = resolve(directory, name);
    const demoTs = resolve(demoDir, `${name}.component.ts`);
    const demoRoute = resolve(directory, '../app', 'app.routes.ts');
    const tags = { name, project, prefix };
    await createDir(demoDir);
    await createFile(demoTs, convertTemplateByTags(componentDemo, tags));
    // 更改配置
    // 1. 在 app-route 创建路由对象
    await replaceFile(demoRoute, `/router';`, `/router';\n${convertTemplateByTags(componentDemoRouteImport, tags)}\n`);
    await replaceFile(demoRoute, `Route[] = [`, `Route[] = [\n${convertTemplateByTags(componentDemoRoute, tags)}`);
};

export const componentHTML = `<!-- {@PREFIX}-{@NAME__KEBABCASE} -->`;
export const componentSCSS = ``;
export const componentTS = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms"

@Component({
  selector: '{@PREFIX}-{@NAME__KEBABCASE}',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './{@NAME__KEBABCASE}.component.html',
  styleUrls: ['./{@NAME__KEBABCASE}.component.scss']
})
export class {@NAME__CAMEL__CAPITAL}Component {}
`;
/**
 * 组件文档
 * @type {string}
 */
export const componentStory = `import type { Meta, StoryObj } from '@storybook/angular';
import {{@NAME__CAMEL__CAPITAL}Component} from './{@NAME}.component';

const meta: Meta<{@NAME__CAMEL__CAPITAL}Component> = {
  component: {@NAME__CAMEL__CAPITAL}Component,
  title: '组件/{@NAME__KEBABCASE}',
  argTypes: {}
};
export default meta;
type Story = StoryObj<{@NAME__CAMEL__CAPITAL}Component>;

export const Primary: Story = {
  name: '',
  parameters: {},
  args: {}
};
`;
/**
 * 组件导出内容
 * @type {string}
 */
export const componentIndex = `export * from "./{@NAME__KEBABCASE}.component"`;
/**
 * 外部的index导出
 * @type {string}
 */
export const externalIndex = `export * from "./{@NAME__KEBABCASE}";`;
/**
 * demo 组件
 * @type {string}
 */
export const componentDemo = `import { Component } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { {@NAME__CAMEL__CAPITAL}Component } from "{@PROJECT}"
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,{@NAME__CAMEL__CAPITAL}Component],
  selector: '{@PROJECT}-{@NAME__KEBABCASE}-demo',
  template: \`
  <p>{@NAME__KEBABCASE}-demo</p>
  <{@PREFIX}-{@NAME__KEBABCASE}></{@PREFIX}-{@NAME__KEBABCASE}>
  \`,
  styles: [\`\`],
})
export class {@NAME__CAMEL__CAPITAL}DemoComponent {
}
`;
/**
 * 路由对象
 * @type {string}
 */
export const componentDemoRouteImport = `import { {@NAME__CAMEL__CAPITAL}DemoComponent } from "../components/{@NAME__KEBABCASE}/{@NAME__KEBABCASE}.component";`;
export const componentDemoRoute = `  {
    path: '{@NAME__KEBABCASE}-demo',
    loadComponent: () => {@NAME__CAMEL__CAPITAL}DemoComponent
  },`;
