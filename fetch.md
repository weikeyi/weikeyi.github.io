## fetch
### GET POST
fetch是一种新的网络请求方式，它是基于Promise的，可以替代XMLHttpRequest。
fetch的基本用法如下：
```js
            fetch('http://localhost:3000/txt',{
                signal:abort.signal
            }).then(res=>{
                return res.text()
            }).then(data=>{
                console.log(data)
            })

            fetch('http://localhost:3000/post',
                {
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({name:'zhangsan'})
                }
            ).then(res=>{
                //post 请求返回的是一个json对象
                return res.json()
            }).then(data=>{
                console.log(data)
            })
```
### progress
fetch可以通过`getReader`来获取reader对象
```js
            fetch('http://localhost:3000/txt').then(async res=>{
                const response = res.clone()
                const reader = res.body.getReader()//返回一个reader对象
                const total = res.headers.get('Content-Length')
                let loaded = 0
                // reader.read().then(function processResult(result){
                //     if(result.done){
                //         console.log('读取完毕')
                //         return
                //     }
                //     loaded += result.value.byteLength
                //     console.log(`加载进度${loaded}/${total}`)
                //     document.getElementById('progress').innerText = `${loaded}/${total}`
                //     return reader.read().then(processResult)
                // })
                while(true){
                    const {done,value} = await reader.read()
                    if(done){
                        console.log('读取完毕')
                        break
                    }
                    loaded += value.byteLength
                    console.log(`加载进度${loaded}/${total}`)
                    document.getElementById('progress').innerText = `${loaded}/${total}`
                }
                return response.text()
            }).then(data=>{
                console.log(data)
            })

            stop.addEventListener('click',()=>{
                abort.abort()
            })
```
### abort
fetch可以通过`AbortController`来中断请求
```js
            const abort = new AbortController()
            fetch('http://localhost:3000/txt',{
                signal:abort.signal
            }).then(res=>{
                return res.text()
            }).then(data=>{
                console.log(data)
            })

            stop.addEventListener('click',()=>{
                abort.abort()
            })
```