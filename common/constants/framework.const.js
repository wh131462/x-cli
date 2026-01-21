/**
 * 框架配置
 */
export const FrameworkConfig = {
    vue: {
        name: 'Vue',
        choices: [
            { name: 'create-vue (Vite, recommended)', value: 'create-vue' },
            { name: '@vue/cli (Webpack)', value: 'vue-cli' }
        ],
        commands: {
            'create-vue': (projectName) => `create-vue ${projectName}`,
            'vue-cli': (projectName) => `@vue/cli create ${projectName}`
        }
    },
    react: {
        name: 'React',
        choices: [
            { name: 'Vite (recommended)', value: 'vite-react' },
            { name: 'create-react-app', value: 'cra' },
            { name: 'Next.js', value: 'nextjs' }
        ],
        commands: {
            'vite-react': (projectName) => `create-vite ${projectName} --template react-ts`,
            'cra': (projectName) => `create-react-app ${projectName} --template typescript`,
            'nextjs': (projectName) => `create-next-app@latest ${projectName}`
        }
    },
    angular: {
        name: 'Angular',
        choices: [{ name: '@angular/cli', value: 'angular-cli' }],
        commands: {
            'angular-cli': (projectName) => `@angular/cli new ${projectName}`
        }
    },
    vanilla: {
        name: 'Vanilla (JS/TS)',
        choices: [{ name: 'Vite', value: 'vite-vanilla' }],
        commands: {
            'vite-vanilla': (projectName) => `create-vite ${projectName} --template vanilla-ts`
        }
    },
    taro: {
        name: 'Taro',
        choices: [
            { name: 'Taro + React (recommended)', value: 'taro-react' },
            { name: 'Taro + Vue3', value: 'taro-vue3' }
        ],
        commands: {
            'taro-react': (projectName) => `@tarojs/cli init ${projectName} --template=default --framework=react --typescript --npm=npm --auto-install=false`,
            'taro-vue3': (projectName) => `@tarojs/cli init ${projectName} --template=default --framework=vue3 --typescript --npm=npm --auto-install=false`
        }
    },
    uniapp: {
        name: 'UniApp',
        choices: [
            { name: 'Vue3 + Vite + TS (recommended)', value: 'uniapp-vue3-vite' },
            { name: 'Vue3 + Vite', value: 'uniapp-vue3-vite-js' }
        ],
        commands: {
            'uniapp-vue3-vite': (projectName) => `degit dcloudio/uni-preset-vue#vite-ts ${projectName}`,
            'uniapp-vue3-vite-js': (projectName) => `degit dcloudio/uni-preset-vue#vite ${projectName}`
        }
    }
};

/**
 * 框架选择列表
 */
export const FrameworkChoices = [
    { name: 'Vue', value: 'vue' },
    { name: 'React', value: 'react' },
    { name: 'Angular', value: 'angular' },
    { name: 'Vanilla (JS/TS)', value: 'vanilla' },
    { name: 'Taro (小程序)', value: 'taro' },
    { name: 'UniApp (小程序)', value: 'uniapp' }
];
