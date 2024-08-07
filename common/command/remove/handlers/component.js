import { getXConfig } from '#common/utils/x/getXConfig.js';
import { resolve } from 'node:path';
import { removeDir } from '#common/utils/file/remove.js';
import { replaceFile } from '#common/utils/file/create.js';
import {
    componentDemoRoute,
    componentDemoRouteImport,
    externalIndex
} from '#common/command/create/templates/component.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

/**
 * 删除组件
 * html scss ts stories index
 * @param name
 * @param directory
 * @param needExport
 * @returns {Promise<void>}
 */
export const removeComponent = async (name, directory, { needExport = false } = {}) => {
    name = kebabcase(name);
    const { prefix } = await getXConfig();
    const tags = { name, prefix };
    const componentDir = resolve(directory, name);
    const componentsIndexPath = resolve(directory, 'index.ts');
    await removeDir(componentDir);
    await replaceFile(componentsIndexPath, '\n' + convertTemplateByTags(externalIndex, tags), '');
};
/**
 * 删除组件对应的demo
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removeComponentDemo = async (name, directory) => {
    name = kebabcase(name);
    const { prefix, name: project } = await getXConfig();
    const demoDir = resolve(directory, name);
    const demoRoute = resolve(directory, '../app', 'app.routes.ts');
    const tags = { name, project, prefix };
    await removeDir(demoDir);
    // 1. 在 app-route 剔除
    await replaceFile(demoRoute, convertTemplateByTags(componentDemoRouteImport, tags), '');
    await replaceFile(demoRoute, convertTemplateByTags(componentDemoRoute, tags), '');
};
