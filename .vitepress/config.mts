import path from 'node:path'
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: '远方os Code Collection',
    description: '🪂 code collection of 远方os(Alfred-Skyblue)',
    themeConfig: {
        logo: '/logo.jpeg',
        nav: [
            { text: '首页', link: '/' },
            { text: '视频集合', link: '/video/vue-composite-function-encapsulation' },
            { text: '代码集', link: '/code/create-context' },
        ],
        sidebar: {
            '/video/': {
                items: [
                    { text: 'vue 组合式函数封装', link: '/video/vue-composite-function-encapsulation' },
                    { text: 'vue 中如何优雅的处理按钮 loading', link: '/video/button-encapsulation-loading' },
                    { text: 'vue 组件的二次封装 - 究极版', link: '/video/component-encapsulation-ultimate-end' },
                    { text: 'vue中的无渲染组件', link: '/video/vue-no-render-component' },
                    {
                        text: '第三方插件封装 vue 组合式函数',
                        link: '/video/third-plugins-encapsulate-vue-composite-function',
                    },
                    { text: 'vue异步组件实现原理', link: '/video/vue-async-component' },
                    { text: 'vue 实现全局状态管理', link: '/video/vue-global-status' },
                    { text: 'vue 组件内的模板复用', link: '/video/use-template-reuse' },
                    { text: 'vue 组件的二次封装 - 终极版', link: '/video/component-encapsulation-ultimate' },
                    { text: '请求竞态处理', link: '/video/createCancelTask' },
                ],
            },
            '/code/': {
                items: [
                    { text: 'createContext', link: '/code/create-context' },
                    { text: '远程组件加载', link: '/code/define-async-component' },
                    { text: '动态表单', link: '/code/dynamic-form' },
                    { text: 'useStorageRef', link: '/code/use-storage-ref' },
                    { text: 'useAsyncState', link: '/code/use-async-state' },
                ],
            },
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/lonewolfyx/awesome-alfred-skyblue' },
        ],
        editLink: {
            pattern: 'https://github.com/lonewolfyx/awesome-alfred-skyblue/edit/master/src/:path',
        },
        aside: false,
        outline: false,
    },
    lastUpdated: true,
    srcDir: path.resolve(__dirname, '../src'),
    rewrites: {
        'content/(.*)': '(.*)',
    },
    vite: {
        server: {
            port: 2025,
            host: '0.0.0.0',
            open: true,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '../src'),
            },
        },
    },
})
