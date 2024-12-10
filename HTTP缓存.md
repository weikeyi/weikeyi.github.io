## 浏览器缓存
:::tip
浏览器缓存分为强缓存和协商缓存，强缓存是根据http头信息来判断是否使用缓存，协商缓存是根据服务器返回的状态码来判断是否使用缓存。
:::
### 强缓存
强缓存之后，浏览器不会向服务器发送请求，而是从浏览器分别读取内存缓存和硬盘缓存中获取资源，所以强缓存是可以直接使用的，不会发起请求，状态码为200。
1. 内存缓存和硬盘缓存
- memory cache: 内存缓存，存储在浏览器内存当中，一般刷新网页会发现很多内存缓存，主要用于缓存css和js文件，内存缓存虽然读取高效，但是缓存空间小，且一旦关闭浏览器就会被清除。
- disk cache: 硬盘缓存，存储在硬盘中，一般存储一些静态资源，如图片、音频、视频等，硬盘缓存虽然读取速度慢，但是容量大，而且可以持久保存。

2. Expires
Expires是HTTP/1.0的产物，表示资源过期时间，浏览器再次加载资源时，会根据资源的过期时间判断是否发送请求到服务器。Expires是服务器返回的响应头字段，告诉浏览器在过期时间前可以直接从浏览器缓存中获取资源，而无需再次请求。Expires是一个绝对时间，即使本地时间和服务器时间存在偏差，也不会影响缓存的使用。
- Expires 该字段制定缓存的到期时间
- 判断机制：当客户端请求资源时，或获取本地时间戳，与Expires进行比较，如果本地时间戳小于Expires时间戳，则直接使用缓存，否则向服务器请求资源。
```js
//动态资源缓存 接口
//Expires 强缓存
app.get('/api',(req,res)=>{
    res.setHeader('Expires',new Date(Date.now()+1000).toUTCString())
    res.send('Expires')
})
```
3.cache-control
Cache-Control是HTTP/1.1的产物，优先级高于Expires，当Cache-Control与Expires同时存在时，Cache-Control优先级高。Cache-Control的值有多种，常见的值如下：
- public: 表示响应可以被客户端和代理服务器缓存
- private: 表示响应只能被客户端缓存，而不能被代理服务器缓存
- no-cache: 表示不使用强缓存，需要使用协商缓存
- no-store: 表示不使用任何缓存，即不进行缓存存储
- max-age: 表示资源在本地缓存多少秒
- s-maxage: 覆盖max-age，作用于代理服务器缓存
- must-revalidate: 表示客户端必须验证缓存，即发送请求到服务器确认资源是否有更新 
- proxy-revalidate: 与must-revalidate类似，但只作用于代理服务器缓存
- no-transform: 代理服务器不得对资源进行转换
- immutable: 表示资源不会发生改变，可以直接使用缓存
- stale-while-revalidate: 表示资源过期后，依然可以使用缓存，但同时发起请求到服务器更新资源
- stale-if-error: 表示资源过期后，依然可以使用缓存，但是当资源失效时，返回错误码
```js
//Cache-Control 强缓存
//PUBLIC 共有缓存 任何服务器都可以缓存包括代理服务器 CDN
//PRIVATE 私有缓存 只有浏览器可以缓存
//MAX-AGE=60 60秒后过期
//Expires 和 Cache-Control 同时存在时 Cache-Control的max-age 优先级高
app.get('/api1',(req,res)=>{
    res.setHeader('Cache-Control','public,max-age=10')
    res.send('Cache-Control')
})
```
:::warning
强缓存和协商缓存是可以一起使用的，强缓存优先级高于协商缓存，即当强缓存生效时，浏览器直接使用缓存，不会再发起请求到服务器。
:::

### 协商缓存
协商缓存是强缓存失效后，浏览器携带缓存标识向服务器发送请求，由服务器根据缓存标识决定是否使用缓存的过程。协商缓存可以分为两种情况：
1. Last-Modified和If-Modified-Since
```js
//强缓存与协商缓存一起出现，浏览器优先使用强缓存
//如何解决这个问题
//no-cache 告诉浏览器，不要使用强缓存，要使用协商缓存
//no-store 告诉浏览器，不要使用任何缓存
//last-modified 设置资源最后修改时间

const getFileModifyTime = (filePath) => {
    return fs.statSync('./index.js').mtime.toUTCString()
}
app.get('/api2', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache')
    const fileModifyTime = getFileModifyTime()
    const ifModifiedSince = req.headers['if-modified-since']
    if (ifModifiedSince && ifModifiedSince === fileModifyTime) {
        console.log('协商缓存命中');
        
        res.statusCode = 304
        res.send('Not Modified')
        res.end()
        return
    }
    console.log('没有缓存');
    res.setHeader('Last-Modified', fileModifyTime)
    res.send('Cache-Control')
})
```
2. Etag和If-None-Match
```js
//Etag 和 If-None-Match
//Etag 是服务器生成的资源唯一标识
//If-None-Match 浏览器发送请求时，携带上次资源的Etag
//服务器根据If-None-Match判断资源是否更新，如果没有更新，返回304，否则返回新的资源
const getFileEtag = (filePath) => {
    return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex')
}
app.get('/api3', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache')
    const fileEtag = getFileEtag('./index.js')
    const ifNoneMatch = req.headers['if-none-match']
    if (ifNoneMatch && ifNoneMatch === fileEtag) {
        console.log('协商缓存命中');
        res.statusCode = 304
        res.send('Not Modified')
        res.end()
        return
    }
    console.log('没有缓存');
    res.setHeader('Etag', fileEtag)
    res.send('Cache-Control')
})
```
