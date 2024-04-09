// 1. 安装 prettier
import { npmInstall } from '#common/utils/npmInstall.js';
import { writeConfig } from '#common/utils/file/writeConfig.js';
console.log('Installing prettier...');

npmInstall('prettier', true);
// 生成 prettier 配置文件
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
writeConfig('.prettierrc', prettierConfig);
