import { resolve } from 'node:path';
import { createFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';
import { kebabcase } from '#common/utils/string/kebabcase.js';

/**
 * 创建文档
 * @param name
 * @param directory
 * @param bind
 * @returns {Promise<void>}
 */
export const createDoc = async (name, directory, { bind }) => {
    name = kebabcase(name);
    const docPath = resolve(directory, `${name}.mdx`);
    await createFile(docPath, convertTemplateByTags(doc, { name }));
};
export const doc = `import { Meta, Controls } from '@storybook/blocks';
<Meta title="{@NAME__KEBACCASE}" />
# {@NAME__UPPER}`;
