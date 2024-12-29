import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Keyi's Blog",
  description: "学习笔记",
  head:[
    ['link',{rel:'icon',href:'./../assets/blog_logo.jpg'}],
  ],
  outDir:"docs",//打包输出的目录
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '前端', link: '/Prototype' },
      { text: '遥感', link: '/RemoteSencing' },
    ],

    sidebar: [
      {
        text: '前端',
        items: [
          { text: 'SEO', link: '/SEO_webBuild' },
          { text: '原型链', link: '/Prototype' },
          { text: '埋点', link: '/埋点' },
          { text: 'Webpack', link: '/Webpack' },
          { text: 'PWA', link: '/PWA' },
          { text: '网络', link: '/网络' },
          { text: '补充知识点', link: '/补充知识点' },
        ]
      },
      {
        text: '遥感',
        items: [
          { text: 'Remote', link: '/RemoteSencing' },
        ]
      },
      {
        text: '关于',
        items: [
          { text: 'README', link: '/README' },
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
