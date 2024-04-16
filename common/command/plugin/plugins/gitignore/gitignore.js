import { writeConfig } from '#common/utils/file/writeConfig.js';
import { exists } from 'node:fs';
import { removeFile } from '#common/utils/file/remove.js';
const gitignoreContent = `# Compiled output
dist
tmp
out-tsc
bazel-out
# Node
node_modules
npm-debug.log
yarn-error.log
# IDEs and editors
.idea/
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace
# Visual Studio Code
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*
# Miscellaneous
.angular/cache
.sass-cache/
connect.lock
coverage
libpeerconnection.log
testem.log
typings
# System files
.DS_Store
Thumbs.db
yarn.lock
package-lock.json
pnpm-lock.yaml`;
/**
 * gitignore
 * @type {IPlugin}
 */
export const gitignore = {
    check: () => new Promise((resolve) => exists('.gitignore', (has) => resolve(has))),
    install: () => writeConfig('.gitignore', gitignoreContent),
    uninstall: () => removeFile('.gitignore')
};
