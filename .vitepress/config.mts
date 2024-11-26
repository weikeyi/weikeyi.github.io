import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Keyi's Blog",
  description: "学习笔记",
  outDir:"docs",//打包输出的目录
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '前端', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Study', link: '/markdown-examples' },
          { text: 'README', link: '/README' },
          { text: 'SEO_webBuild', link: '/SEO_webBuild' },
        ]
      }
    ],
    lastUpdated: {
      text: '最后更新',
      formatOptions:{
        dateStyle:'full',
        timeStyle:'short',
      }
    },
    search:{
      provider:'local',
    },
    docFooter: {
      prev:'上一页',
      next:'下一页',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/weikeyi' }
    ]
  }
})
