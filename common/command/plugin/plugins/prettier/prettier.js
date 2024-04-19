import { writeConfig } from '#common/utils/file/writeConfig.js';
import { npmHas, npmInstall, npmUninstall } from '#common/utils/manager/npm.js';
import { removeFile } from '#common/utils/file/remove.js';
import { managerHas, managerInstall, managerUninstall } from '#common/utils/manager/manager.js';

const prettierConfig = {
    singleQuote: true,
    experimentalTernaries: false,
    semi: true,
    tabWidth: 4,
    trailingComma: 'none',
    printWidth: 360,
    quoteProps: 'consistent',
    bracketSpacing: true,
    bracketSameLine: true,
    arrowParens: 'always',
    htmlWhitespaceSensitivity: 'css',
    endOfLine: 'lf',
    singleAttributePerLine: true
};

/**
 * prettier
 * @type {IPlugin}
 */
export const prettier = {
    check: () => managerHas('prettier'),
    install: () => Promise.allSettled([managerInstall('prettier', true), writeConfig('.prettierrc', prettierConfig)]),
    uninstall: () => Promise.allSettled([managerUninstall('prettier', true), removeFile('.prettierrc')])
};
