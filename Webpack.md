# webpack构建项目

:::tip
webpack5必须与webpack-cli一起使用，webpack-cli是webpack的命令行工具，用于在命令行中运行webpack命令。
:::

`entry` 入口文件
`output` 输出文件
```js
  entry: "./src/main.ts", //入口文件
  output: {
    filename: "bundle.js", //输出文件
    path: path.resolve(process.cwd(), "dist"), //输出的文件夹
    clean: true, //每次打包，清空输出文件夹
  }
```

cli是command line interface的缩写，意为命令行接口。



:::tip
vite原生支持ts 是因为它使用了esbuild

webpack 原生支持 js json
:::

:::tip
process.cwd() // 当前工作目录根目录
:::

## Tree-shaking

:::tip tree-shaking
tree-shaking是一个术语，通常用于描述移除JavaScript上下文中的未引用代码(dead-code)。它依赖于ES2015模块系统中的静态结构特性，例如import和export。
声明的变量没有被引用，那么这些变量和函数将不会被打包到bundle中
以及永远走不进的代码块
:::


#### webpack 
只能支持js 和json文件，其他文件需要loader来处理

如果是处理文件 loader
如果是增加功能 plugin

### webpack支持图片
url-loader file-loader区别
1. url-loader依赖file-loader，url-loader可以将文件转为base64格式，而file-loader不可以
2. url-loader可以设置limit参数，小于limit的文件会转为base64格式，大于limit的文件会使用file-loader进行处理 而且可以指定输出的文件名，文件位置

## 声明文件  
用来帮助ts识别类型
ts声明文件
.d.ts文件是TypeScript的声明文件，用来帮助TypeScript编译器识别第三方库的类型定义，从而在编译过程中不报错。
image.d.ts
```ts
declare module '*.png' {
  const value: any;
  export default value;
}
```
vue声明文件
shim.d.ts
```ts
declare module '*.vue' {
  import { defineComponent } from 'vue';
  const component: ReturnType<typeof defineComponent>;
  export default component;
}
```

## webpack支持vue3
```shell
npm install vue-loader -D
```
配置项
```js
module: {
  rules: [
    {
      test: /\.vue$/,
      use: 'vue-loader'
    }
  ]
}
plugins: [
  new VueLoaderPlugin()
]
```
## webpack支持vue中的ts
#### ts-loader
```js
module: {
  rules: [
    {
      test: /\.ts$/,
      use: {
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      exclude: /node_modules/
    }
  ]
}
```
#### swc-loader
```js
module: {
  rules: [
    {
      test: /\.ts$/,
      use: {
        loader: 'swc-loader',
        options: {
          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: ture
            }
          }
        }
      },
      exclude: /node_modules/
    }
  ]
}
```
## webpack支持css
需要两个loader `css-loader` `style-loader`
#### css-loader
```js
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']//从右往左执行
    }
  ]
}
```
### less scss
需要安装对应的loader
```shell
npm install less less-loader -D
npm install sass sass-loader -D
```
```js
module: {
  rules: [
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    },
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    }
  ]
}
```
:::tip mini-css-extract-plugin
提取css文件
:::
```shell
npm install mini-css-extract-plugin -D
```
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module: {
  rules: [
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }
  ]
}
plugins: [
  new MiniCssExtractPlugin()
]
```
## optimization
优化器
拆出引入库的分支
```js
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
``` 
moment.js 语言包
```js
moment:{
    name: 'moment',
    test: /moment/,
    chunks: 'all',
    priority: 1
}
```
common 通用模块 通用模块是指在多个模块中都引入的模块
```js
common:{
    name: 'common',
    chunks: 'all',
    priority: 0//优先级
}
```
## resolve
解析
```js
resolve: {
  extensions: ['.js', '.ts', '.vue'],//自动解析扩展
  alias: {
    '@': path.resolve(__dirname, 'src')//别名
  }
}
```
## externals
外部引入（CDN）
```js
externals: {
  vue: 'Vue'//这样你打包的时候vue不会被打包进去
}
```
## cache
缓存：把你的文件生成为一个二进制文件，下次打包的时候，如果文件没有变化，就不会重新打包
```js
cache: {
  type: 'filesystem'//filesystem memory
}
```
## CDN
内容分发网络


:::tip
TTL 主机到服务器之间经过的路由器的数量
:::

CDN是用来加速网站的，把你的静态资源放到CDN上，用户访问的时候，会从离用户最近的CDN节点获取资源，这样就可以加速网站的访问速度。
并且自带缓存功能，可以减少服务器的压力。
负载均衡：把用户请求分发到不同的服务器上，这样可以减少单个服务器的压力

## 当你访问一个网址
1. 浏览器的DNS缓存
2. 查找etc目录下的DNS缓存
3. 查找本地hosts文件
4. 发送DNS请求
    1. 根域名查找 .
    2. 顶级域名查找 com. cn.
    3. 权威域名查找 www.baidu.com

如果配置CDN，不会经过这个流程，会直接直接访问CDN，DNS服务器就近分配