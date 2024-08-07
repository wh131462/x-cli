import { getXConfig } from '#common/utils/x/getXConfig.js';
import { resolve } from 'node:path';
import { removeDir, removeFile } from '#common/utils/file/remove.js';
import { replaceFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import {
    componentDemoRoute,
    componentDemoRouteImport,
    externalIndex
} from '#common/command/create/templates/component.js';
import { externalPipeIndex, pipeDemoRoute, pipeDemoRouteImport } from '#common/command/create/templates/pipe.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

/**
 * 删除pipe
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removePipe = async (name, directory) => {
    name = kebabcase(name);
    const { prefix } = await getXConfig();
    const tags = { name, prefix };
    const pipePath = resolve(directory, `${name}.pipe.ts`);
    const pipesIndexPath = resolve(directory, 'index.ts');
    await removeFile(pipePath);
    await replaceFile(pipesIndexPath, '\n' + convertTemplateByTags(externalPipeIndex, tags), '');
};
/**
 * 删除pipe demo
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const removePipeDemo = async (name, directory) => {
    name = kebabcase(name);
    const { prefix, name: project } = await getXConfig();
    const demoTs = resolve(directory, `${name}.pipe.ts`);
    const demoRoute = resolve(directory, '../app', 'app.routes.ts');
    const tags = { name, project, prefix };
    await removeFile(demoTs);
    // 1. 在 app-route 剔除
    await replaceFile(demoRoute, convertTemplateByTags(pipeDemoRouteImport, tags), '');
    await replaceFile(demoRoute, convertTemplateByTags(pipeDemoRoute, tags), '');
};
