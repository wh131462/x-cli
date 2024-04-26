import { resolve } from 'node:path';
import { whetherDemo } from '#common/command/create/create.js';
import { removeComponent, removeComponentDemo } from '#common/command/remove/handlers/component.js';
import { removeDirective, removeDirectiveDemo } from '#common/command/remove/handlers/directive.js';
import { removePipe, removePipeDemo } from '#common/command/remove/handlers/pipe.js';
import { removeDoc } from '#common/command/remove/handlers/doc.js';
import { removeService } from '#common/command/remove/handlers/service.js';
import { inX } from '#common/utils/x/where.js';
import { logger } from '#common/utils/x/logger.js';

export const remove = async (type, name, directory) => {
    if (!(await inX())) {
        const warn = '当前项目不是 x 项目';
        logger.warn(warn);
        throw new Error(warn);
    }
    const withDemo = !directory && ['component', 'directive', 'pipe'].includes(type);
    const dirPath = resolve(process.cwd(), directory ?? '');
    await rules[type](name, dirPath, withDemo);
};

/**
 * 删除策略
 * @type {{component: ((function(*, *): Promise<void>)|*), service: ((function(*, *): Promise<*>)|*), doc: ((function(*, *): Promise<*>)|*), pipe: ((function(*, *): Promise<*>)|*), directive: ((function(*, *): Promise<*>)|*)}}
 */
const rules = {
    // 组件
    component: async (name, dir, withDemo) => {
        await whetherDemo(
            withDemo,
            async (comLibName, demoLibName) => {
                await removeComponent(name, resolve(`${comLibName}/src/lib/components`), { needExport: true });
                await removeComponentDemo(name, resolve(`${demoLibName}/src/components`));
            },
            async () => {
                await removeComponent(name, dir, { needExport: false });
            }
        );
    },
    // 指令
    directive: async (name, dir, withDemo) => {
        await whetherDemo(
            withDemo,
            async (comLibName, demoLibName) => {
                await removeDirective(name, resolve(`${comLibName}/src/lib/directives`));
                await removeDirectiveDemo(name, resolve(`${demoLibName}/src/directives`));
            },
            async () => {
                await removeDirective(name, dir);
            }
        );
    },
    // 管道
    pipe: async (name, dir, withDemo) => {
        await whetherDemo(
            withDemo,
            async (comLibName, demoLibName) => {
                await removePipe(name, resolve(`${comLibName}/src/lib/pipes`));
                await removePipeDemo(name, resolve(`${demoLibName}/src/pipes`));
            },
            async () => {
                await removePipe(name, dir);
            }
        );
    },
    // 服务
    service: async (name, dir) => {
        await removeService(name, dir);
    },
    // 文档
    doc: async (name, dir) => {
        await removeDoc(name, dir);
    }
};
