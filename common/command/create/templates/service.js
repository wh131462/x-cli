import { resolve } from 'node:path';
import { createFile } from '#common/utils/file/create.js';
import { convertTemplateByTags } from '#common/utils/tag/tag.js';

export const createService = async (name, directory) => {
    const servicePath = resolve(directory, `${name}.service.ts`);
    await createFile(servicePath, convertTemplateByTags(service, { name }));
};
export const service = `import {Injectable} from "@angular/core"
@Injectable({
  providedIn: "root"
})
export class {@NAME__CAPITAL}Service {
    constructor() {}
}
`;
