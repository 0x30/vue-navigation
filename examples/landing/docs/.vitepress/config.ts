import { defineConfig } from 'vitepress'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
  title: 'Navigation',
  description: 'A powerful navigation library for Vue & React',
  
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }],
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '指南', link: '/guide/getting-started' },
      { text: 'API', link: '/api/' },
      {
        text: 'Demo',
        items: [
          { text: 'Vue Demo', link: isDev ? 'http://localhost:5171' : '/vue/' },
          { text: 'React Demo', link: isDev ? 'http://localhost:5172' : '/react/' },
        ]
      },
      { text: 'GitHub', link: 'https://github.com/0x30/vue-navigation' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/' },
            { text: '快速开始', link: '/guide/getting-started' },
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '导航', link: '/guide/navigation' },
            { text: '页面组件', link: '/guide/page-components' },
            { text: '生命周期', link: '/guide/lifecycle' },
            { text: '手势返回', link: '/guide/gesture' },
          ]
        },
        {
          text: '高级功能',
          items: [
            { text: 'Hero 动画', link: '/guide/hero-animation' },
            { text: 'Loading & Toast', link: '/guide/loading-toast' },
            { text: 'Popup 工具', link: '/guide/popup' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
          ]
        },
        {
          text: '导航方法',
          items: [
            { text: 'push', link: '/api/push' },
            { text: 'back', link: '/api/back' },
            { text: 'replace', link: '/api/replace' },
            { text: 'blackBoxBack', link: '/api/black-box-back' },
            { text: 'backToHome', link: '/api/back-to-home' },
          ]
        },
        {
          text: '页面组件',
          items: [
            { text: 'Navigator', link: '/api/navigator' },
            { text: 'NavPage', link: '/api/nav-page' },
            { text: 'Page', link: '/api/page' },
            { text: 'SidePage', link: '/api/side-page' },
            { text: 'Safearea', link: '/api/safearea' },
          ]
        },
        {
          text: 'Hooks',
          items: [
            { text: 'useLeaveBefore', link: '/api/use-leave-before' },
            { text: 'useQuietPage', link: '/api/use-quiet-page' },
            { text: 'useProgressExitAnimated', link: '/api/use-progress-exit-animated' },
            { text: '生命周期 Hooks', link: '/api/lifecycle-hooks' },
            { text: 'useHero', link: '/api/use-hero' },
          ]
        },
        {
          text: 'UI 组件',
          items: [
            { text: 'Loading', link: '/api/loading' },
            { text: 'Toast', link: '/api/toast' },
            { text: 'Popup', link: '/api/popup' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/0x30/vue-navigation' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 0x30'
    }
  }
})
