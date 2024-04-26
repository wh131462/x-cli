import { resolve } from 'node:path';
import { createComponent, createComponentDemo } from '#common/command/create/templates/component.js';
import { createService } from '#common/command/create/templates/service.js';
import { createDoc } from '#common/command/create/templates/doc.js';
import { getProjectNames, getXConfig } from '#common/utils/x/getXConfig.js';
import { setRoot } from '#common/utils/x/setRoot.js';
import { createDirective, createDirectiveDemo } from '#common/command/create/templates/directive.js';
import { createPipe, createPipeDemo } from '#common/command/create/templates/pipe.js';
import { inX, where } from '#common/utils/x/where.js';

/**
 * 创建行为 - 默认根据规则创建 指定目录则在指定位置创建
 * @param type {"component"|"pipe"|"directive"|"service"|"doc"}
 * @param name {string}
 * @param directory {?string}
 * @param bind {?string}
 */
export const create = async (type, name, directory, bind) => {
    // 如果存在目录就直接在指定目录创建,否则在指定目录创建
    // 指定目录的文件不会创建对应的demo 因为会被默认为子组件
    if (!(await inX())) {
        throw new Error('当前项目不是 x 项目');
    }
    const withDemo = !directory && ['component', 'directive', 'pipe'].includes(type);
    const dirPath = resolve(process.cwd(), directory ?? '');
    await rules[type](name, dirPath, withDemo, bind);
};
/**
 * 创建策略
 * @type {{component: ((function(*, *): Promise<void>)|*), service: ((function(*, *): Promise<*>)|*), doc: ((function(*, *): Promise<*>)|*), pipe: ((function(*, *): Promise<*>)|*), directive: ((function(*, *): Promise<*>)|*)}}
 */
const rules = {
    // 组件
    component: async (name, dir, withDemo, bind) => {
        await whetherDemo(
            withDemo,
            async (comLibName, demoLibName) => {
                await createComponent(name, resolve(`${comLibName}/src/lib/components`), { bind, needExport: true });
                await createComponentDemo(name, resolve(`${demoLibName}/src/components`));
            },
            async () => {
                await createComponent(name, dir, { bind, needExport: false });
            }
        );
    },
    // 指令
    directive: async (name, dir, withDemo, bind) => {
        await whetherDemo(
            withDemo,
            async (comLibName, demoLibName) => {
                await createDirective(name, resolve(`${comLibName}/src/lib/directives`), { bind, needExport: true });
                await createDirectiveDemo(name, resolve(`${demoLibName}/src/directives`));
            },
            async () => {
                await createDirective(name, dir, { bind, needExport: false });
            }
        );
    },
    // 管道
    pipe: async (name, dir, withDemo, bind) => {
        await whetherDemo(
            withDemo,
            async (comLibName, demoLibName) => {
                await createPipe(name, resolve(`${comLibName}/src/lib/pipes`), { bind, needExport: true });
                await createPipeDemo(name, resolve(`${demoLibName}/src/pipes`));
            },
            async () => {
                await createPipe(name, dir, { bind, needExport: false });
            }
        );
    },
    // 服务
    service: async (name, dir, widthDemo, bind) => {
        await createService(name, dir, { bind });
    },
    // 文档
    doc: async (name, dir, widthDemo, bind) => {
        await createDoc(name, dir, { bind });
    }
};
/**
 * 获取with demo的基础环境 - 高级函数
 * @param withDemo
 * @param callback
 * @param withCallback
 * @returns {Promise<*>}
 */
export const whetherDemo = async (withDemo, withCallback, callback) => {
    if (withDemo) {
        const config = await getXConfig();
        const [comLibName] = getProjectNames(config, 'component');
        const [demoLibName] = getProjectNames(config, 'demo');
        await setRoot();
        await withCallback?.(comLibName, demoLibName);
    } else {
        await callback();
    }
};
