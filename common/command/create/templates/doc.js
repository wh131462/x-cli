import { resolve } from 'node:path';
import { createFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';

/**
 * 创建文档
 * @param name
 * @param directory
 * @returns {Promise<void>}
 */
export const createDoc = async (name, directory) => {
    const docPath = resolve(directory, `${name}.mdx`);
    await createFile(docPath, convertTemplateByTags(doc, { name }));
};
export const doc = `import { Meta, Controls } from '@storybook/blocks';
<Meta title="{@NAME}" />
# {@NAME__UPPER}`;
