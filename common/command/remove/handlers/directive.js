import { getXConfig } from '#common/utils/x/getXConfig.js';
import { resolve } from 'node:path';
import { removeFile } from '#common/utils/file/remove.js';
import { replaceFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import {
    directiveDemoRoute,
    directiveDemoRouteImport,
    externalDirectiveIndex
} from '#common/command/create/templates/directive.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

export const removeDirective = async (name, directory) => {
    name = kebabcase(name);
    const { prefix } = await getXConfig();
    const tags = { name, prefix };
    const directivePath = resolve(directory, `${name}.directive.ts`);
    const directivesIndexPath = resolve(directory, 'index.ts');
    await removeFile(directivePath);
    await replaceFile(directivesIndexPath, '\n' + convertTemplateByTags(externalDirectiveIndex, tags), '');
};
export const removeDirectiveDemo = async (name, directory) => {
    name = kebabcase(name);
    const { prefix, name: project } = await getXConfig();
    const demoTs = resolve(directory, `${name}.directive.ts`);
    const demoRoute = resolve(directory, '../app', 'app.routes.ts');
    const tags = { name, project, prefix };
    await removeFile(demoTs);
    // 1. 在 app-route 剔除
    await replaceFile(demoRoute, convertTemplateByTags(directiveDemoRouteImport, tags), '');
    await replaceFile(demoRoute, convertTemplateByTags(directiveDemoRoute, tags), '');
};
