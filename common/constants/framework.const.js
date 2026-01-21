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
    }
};

/**
 * 框架选择列表
 */
export const FrameworkChoices = [
    { name: 'Vue', value: 'vue' },
    { name: 'React', value: 'react' },
    { name: 'Angular', value: 'angular' },
    { name: 'Vanilla (JS/TS)', value: 'vanilla' }
];
