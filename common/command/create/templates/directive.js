import { getProjectNames, getXConfig } from '#common/utils/x/getXConfig.js';
import { resolve } from 'node:path';
import { createFile, replaceFile, updateFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';

export const createDirective = async (name, directory, { needExport = false } = {}) => {
    const config = await getXConfig();
    const [prefix] = await getProjectNames(config, 'component');
    const directivePath = resolve(directory, `${name}.directive.ts`);
    const directivesIndexPath = resolve(directory, 'index.ts');
    // 2. 创建文件
    const tags = { name, prefix };
    await createFile(directivePath, convertTemplateByTags(directive, tags));
    // 3. 导出
    if (needExport) await updateFile(directivesIndexPath, convertTemplateByTags(externalDirectiveIndex, tags));
};
export const createDirectiveDemo = async (name, directory) => {
    const { prefix, name: project } = await getXConfig();
    const demoTs = resolve(directory, `${name}.directive.ts`);
    const demoRoute = resolve(directory, '../app', 'app.routes.ts');
    const tags = { name, project, prefix };
    await createFile(demoTs, convertTemplateByTags(directiveDemo, tags));
    // 更改配置
    // 1. 在 app-route 创建路由对象
    await replaceFile(demoRoute, `/router';`, `/router';\n${convertTemplateByTags(directiveDemoRouteImport, tags)}\n`);
    await replaceFile(demoRoute, `Route[] = [`, `Route[] = [\n${convertTemplateByTags(directiveDemoRoute, tags)}`);
};
export const directive = `import { Directive } from '@angular/core';

@Directive({
  selector: '[{@PREFIX__CANIMAL}{@NAME__CAPITAL}]',
  standalone: true,
})
export class {@NAME__CAPITAL}Directive {
  constructor() {}
}
`;

/**
 * 外部导出
 * @type {string}
 */
export const externalDirectiveIndex = `export * from "./{@NAME}.directive";`;

export const directiveDemo = `import { Component } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { {@NAME__CAPITAL}Directive } from "{@PROJECT}"
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,{@NAME__CAPITAL}Directive ],
  selector: '{@PROJECT}-{@NAME}-directive-demo',
  template: \`
  <p>{@NAME}-directive-demo</p>
  \`,
  styles: [\`\`],
})
export class {@NAME__CAPITAL}DirectiveDemoComponent {
}`;

export const directiveDemoRouteImport = `import { {@NAME__CAPITAL}DirectiveDemoComponent } from "../directives/{@NAME}.directive";`;
export const directiveDemoRoute = `  {
    path: '{@NAME}-directive-demo',
    loadComponent: () => {@NAME__CAPITAL}DirectiveDemoComponent
  },`;
