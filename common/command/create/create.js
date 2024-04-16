import { resolve } from 'node:path';
import { createDir, createFile } from '#common/utils/file/create.js';
import {
    componentHTML,
    componentSCSS,
    componentStory,
    componentTS
} from '#common/command/create/templates/component.js';
import { directive } from '#common/command/create/templates/directive.js';
import { pipe } from '#common/command/create/templates/pipe.js';
import { service } from '#common/command/create/templates/service.js';
import { doc } from '#common/command/create/templates/doc.js';
import { calcTime } from '#common/utils/node/calcTime.js';

/**
 * 创建行为
 * @param type {"component"|"service"|"pipe"|""}
 * @param name {string}
 * @param directory {?string}
 */
export const create = async (type, name, directory) => {
    // 目录
    const dirPath = resolve(process.cwd(), directory ?? '');
    // 执行策略
    await rules[type](name, dirPath);
};
/**
 * 组件创建策略
 * @type {{component: ((function(*, *): Promise<void>)|*), service: ((function(*, *): Promise<*>)|*), doc: ((function(*, *): Promise<*>)|*), pipe: ((function(*, *): Promise<*>)|*), directive: ((function(*, *): Promise<*>)|*)}}
 */
export const rules = {
    // 组件
    component: async (name, dir) => {
        await calcTime(async () => {
            const baseDir = resolve(dir, name);
            await Promise.allSettled([
                createTemplate(componentHTML, name, resolve(baseDir, `${name}.component.html`)),
                createTemplate(componentSCSS, name, resolve(baseDir, `${name}.component.scss`)),
                createTemplate(componentTS, name, resolve(baseDir, `${name}.component.ts`)),
                createTemplate(componentStory, name, resolve(baseDir, `${name}.component.ts`))
            ]);
        });
    },
    // 指令
    directive: async (name, dir) => {
        await createTemplate(directive, name, resolve(dir, `${name}.directive.ts`));
    },
    // 管道
    pipe: async (name, dir) => {
        await createTemplate(pipe, name, resolve(dir, `${name}.pipe.ts`));
    },
    // 服务
    service: async (name, dir) => {
        await createTemplate(service, name, resolve(dir, `${name}.service.ts`));
    },
    // 文档
    doc: async (name, dir) => {
        await createTemplate(doc, name, resolve(dir, `${name}.mdx`));
    }
};
/**
 * 创建模板文件
 * @param template
 * @param name
 * @param fileName
 * @returns {Promise<void>}
 */
export const createTemplate = async (template, name, fileName) => {
    const content = template.replaceAll('@NAME', name);
    await createFile(fileName, content);
};
