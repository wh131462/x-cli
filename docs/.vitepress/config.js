import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'X-CLI',
  description: '一站式前端项目脚手架和开发工具管理',
  lang: 'zh-CN',
  base: '/x-cli/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/x-cli/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'X-CLI - 前端项目脚手架' }],
    ['meta', { name: 'og:description', content: '一站式前端项目脚手架和开发工具管理' }]
  ],

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '命令', link: '/commands/overview', activeMatch: '/commands/' },
      { text: '框架', link: '/frameworks/overview', activeMatch: '/frameworks/' },
      {
        text: '链接',
        items: [
          { text: 'npm', link: 'https://www.npmjs.com/package/@eternalheart/x-cli' },
          { text: 'GitHub', link: 'https://github.com/wh131462/x-cli' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '简介', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '为什么选择 X-CLI', link: '/guide/why' }
          ]
        }
      ],
      '/commands/': [
        {
          text: '命令参考',
          items: [
            { text: '概览', link: '/commands/overview' },
            { text: 'x new', link: '/commands/new' },
            { text: 'x plugin', link: '/commands/plugin' },
            { text: 'x update', link: '/commands/update' }
          ]
        },
        {
          text: '包管理器',
          items: [
            { text: 'xi - 安装依赖', link: '/commands/xi' },
            { text: 'xu - 卸载依赖', link: '/commands/xu' },
            { text: 'xr - 运行脚本', link: '/commands/xr' }
          ]
        },
        {
          text: 'AI 助手',
          items: [
            { text: 'xa - AI 工作区', link: '/commands/xa' }
          ]
        }
      ],
      '/frameworks/': [
        {
          text: '前端框架',
          items: [
            { text: '概览', link: '/frameworks/overview' },
            { text: 'Vue', link: '/frameworks/vue' },
            { text: 'React', link: '/frameworks/react' },
            { text: 'Angular', link: '/frameworks/angular' },
            { text: 'Vanilla', link: '/frameworks/vanilla' }
          ]
        },
        {
          text: '小程序框架',
          items: [
            { text: 'Taro', link: '/frameworks/taro' },
            { text: 'UniApp', link: '/frameworks/uniapp' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wh131462/x-cli' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@eternalheart/x-cli' }
    ],

    footer: {
      message: '基于 MIT 许可发布',
      copyright: `Copyright © ${new Date().getFullYear()} EternalHeart`
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文档', buttonAriaLabel: '搜索文档' },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    },

    outline: {
      label: '页面导航',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    lastUpdated: {
      text: '最后更新于'
    },

    editLink: {
      pattern: 'https://github.com/wh131462/x-cli/edit/master/docs/:path',
      text: '在 GitHub 上编辑此页面'
    }
  }
})
