# Express
### 模块化
- Express模块化
1. 创建Express模块，通过Export导出
2. 在app.js中引入Express模块
3. 在app.js中使用Express模块(app.use())

### 中间件
1. 中间件是一个函数，接收req、res、next三个参数(需要写next()来继续执行下一个中间件，否则会卡死)
2. 中间件可以在请求到达路由之前或之后执行

## 基本使用
express.static()：用于提供静态文件服务
- 语法：express.static(root, [options])
- root：静态文件的根目录
- options：可选参数，配置静态文件服务的选项
- 返回值：一个中间件函数，用于处理静态文件请求
```js
const express = require('express')
const app = express()

```
### 常用API
app.get
- 用于处理GET请求
- 语法：app.get(path, callback)
- path：请求的路径，可以是字符串或正则表达式
- callback：处理请求的回调函数，接收req、res参数
```js
app.get('/api/user', (req, res) => {
    res.send('Hello World')
})
```
app.post
- 用于处理POST请求
- 语法：app.post(path, callback)
- path：请求的路径，可以是字符串或正则表达式
- callback：处理请求的回调函数，接收req、res参数
```js
app.post('/api/user', (req, res) => {
    res.send('Hello World')
})
```
app.put
- 用于处理PUT请求
- 语法：app.put(path, callback)
- path：请求的路径，可以是字符串或正则表达式
- callback：处理请求的回调函数，接收req、res参数
```js
app.put('/api/user', (req, res) => {
    res.send('Hello World')
})
```
### 可以通过req.params获取请求参数
```js
app.get('/api/user/:id', (req, res) => {
    const id = req.params.id
    res.send(`Hello World ${id}`)
})
```
### 可以通过req.query获取查询参数
```js
app.get('/api/user', (req, res) => {
    const id = req.query.id
    res.send(`Hello World ${id}`)
})
```
### 可以通过req.body获取请求体参数
```js
app.post('/api/user', (req, res) => {
    const id = req.body.id
    res.send(`Hello World ${id}`)
})
```
### 可以通过req.headers获取请求头参数
```js
app.get('/api/user', (req, res) => {
    const id = req.headers.id
    res.send(`Hello World ${id}`)
})
```
### 可以通过req.cookies获取cookie参数
```js
app.get('/api/user', (req, res) => {
    const id = req.cookies.id
    res.send(`Hello World ${id}`)
})
```
### 可以通过req.session获取session参数
```js
app.get('/api/user', (req, res) => {
    const id = req.session.id
    res.send(`Hello World ${id}`)
})
```
### 可以通过req.file获取文件参数
```js
app.post('/api/user', (req, res) => {
    const file = req.file
    res.send(`Hello World ${file}`)
})
```