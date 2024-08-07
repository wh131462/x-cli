import { getXConfig } from '#common/utils/x/getXConfig.js';
import { resolve } from 'node:path';
import { createFile, replaceFile, updateFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

export const createPipe = async (name, directory, { needExport = false } = {}) => {
    const { prefix } = await getXConfig();
    name = kebabcase(name);
    const pipePath = resolve(directory, `${name}.pipe.ts`);
    const pipesIndexPath = resolve(directory, 'index.ts');
    // 2. 创建文件
    const tags = { name, prefix };
    await createFile(pipePath, convertTemplateByTags(pipe, tags));
    // 3. 导出
    if (needExport) await updateFile(pipesIndexPath, convertTemplateByTags(externalPipeIndex, tags));
};
export const createPipeDemo = async (name, directory) => {
    const { prefix, name: project } = await getXConfig();
    name = kebabcase(name);
    const demoTs = resolve(directory, `${name}.pipe.ts`);
    const demoRoute = resolve(directory, '../app', 'app.routes.ts');
    const tags = { name, project, prefix };
    await createFile(demoTs, convertTemplateByTags(pipeDemo, tags));
    // 更改配置
    // 1. 在 app-route 创建路由对象
    await replaceFile(demoRoute, `/router';`, `/router';\n${convertTemplateByTags(pipeDemoRouteImport, tags)}\n`);
    await replaceFile(demoRoute, `Route[] = [`, `Route[] = [\n${convertTemplateByTags(pipeDemoRoute, tags)}`);
};
/**
 * pipe模板
 * @type {string}
 */
export const pipe = `import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: '{@NAME__CAMEL}',
  standalone: true,
})
export class {@NAME__CAMEL__CAPITAL}Pipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
`;
/**
 * 外部导出
 * @type {string}
 */
export const externalPipeIndex = `export * from "./{@NAME__KEBABCASE}.pipe";`;

export const pipeDemo = `import { Component } from '@angular/core';
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { {@NAME__CAMEL__CAPITAL}Pipe } from "{@PROJECT}"
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,{@NAME__CAMEL__CAPITAL}Pipe ],
  selector: '{@PROJECT}-{@NAME__KEBABCASE}-pipe-demo',
  template: \`
  <p>{@NAME__KEBABCASE}-pipe-demo</p>
  \`,
  styles: [\`\`],
})
export class {@NAME__CAMEL__CAPITAL}PipeDemoComponent {
}`;

export const pipeDemoRouteImport = `import { {@NAME__CAMEL__CAPITAL}PipeDemoComponent } from "../pipes/{@NAME__KEBABCASE}.pipe";`;
export const pipeDemoRoute = `  {
    path: '{@NAME__KEBABCASE}-pipe-demo',
    loadComponent: () => {@NAME__CAMEL__CAPITAL}PipeDemoComponent
  },`;
