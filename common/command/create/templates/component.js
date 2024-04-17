import { createDir, createFile, updateFile } from '#common/utils/file/create.js';
import { resolve } from 'node:path';
import { executeTogether } from '#common/utils/node/execute.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import { getXConfig } from '#common/utils/x/getXConfig.js';

/**
 * 创建组件
 * html scss ts stories index
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const createComponent = async (name, directory) => {
    const { prefix } = await getXConfig();
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
    await updateFile(componentsIndexPath, externalIndex);
};
/**
 * 创建组件对应的demo
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const createComponentDemo = async (name, directory) => {
    const { prefix, name } = await getXConfig();
    const demoDir = resolve(directory, name);
    await createDir(demoDir);
};

export const componentHTML = `
<!-- @NAME -->
`;
export const componentSCSS = `
`;
export const componentTS = `
import { Component } from '@angular/core';
import { CommonModule, FormsModule } from '@angular/common';

@Component({
  selector: '@PREFIX-@NAME',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './@NAME.component.html',
  styleUrls: ['./@NAME.component.scss']
})
export class @NAME__CAPITALComponent {}
`;
/**
 * 组件文档
 * @type {string}
 */
export const componentStory = `import type { Meta, StoryObj } from '@storybook/angular';
import {@NAME__CAPITALComponent} from './@NAME.component';

const meta: Meta<@NAME__CAPITALComponent> = {
  component: @NAME__CAPITALComponent,
  title: '组件/@NAME',
  argTypes: {}
};
export default meta;
type Story = StoryObj<@NAME__CAPITALComponent>;

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
export const componentIndex = `export * from "./@NAME.component"`;

export const externalIndex = `export * from "./@NAME"`;
