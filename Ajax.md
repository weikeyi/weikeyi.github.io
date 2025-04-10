## AJAX
### get
`onreadystatechange`属性存储一个函数，当readyState属性改变时，会调用这个函数。
`timeout`属性设置请求超时时间，单位为毫秒。
`abort`方法用于中断请求。

```js
        const sendajax =()=>{
            const xhr = new XMLHttpRequest();
            //请求方式 请求地址 是否异步（默认为true）
            xhr.open('GET','http://localhost:3000/api/txt',true)

            // xhr.timeout = 1000
            
            // xhr.addEventListener('timeout',()=>{
            //     console.log('请求超时')
            // })

            xhr.addEventListener('abort',()=>{
                console.log('请求中断')
            })
            stop.addEventListener('click',()=>{
                xhr.abort()
            })

            xhr.addEventListener('progress',()=>{
                const progress = document.getElementById('progress')
                progress.innerText = `${(event.loaded/event.total*100).toFixed(2)}%`
            })

            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        console.log(xhr.responseText)
                    }
                }
            }

            xhr.send(null)
        }
```
### POST
`setRequestHeader`方法用于设置请求头。
`send`方法用于发送请求，如果是POST请求，需要在send方法中传入请求体。
请求头中的`Content-Type`字段用于设置请求体的类型，常见的有`application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`等。

:::tip
1. application/x-www-form-urlencoded：表单数据，键值对的形式，如name=123&age=18
2. multipart/form-data：表单数据，支持文件上传
3. text/plain：纯文本数据

JSON 数据格式 要序列化
urlencoded 数据格式 不用序列化
:::
```js
        const sendajax =()=>{
            const xhr = new XMLHttpRequest();
            //请求方式 请求地址 是否异步（默认为true）
            xhr.open('POST','http://localhost:3000/api/txt',true)
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        console.log(xhr.responseText)
                    }
                }
            }

            xhr.send('name=123')
        }
```
```js
        const sendajax =()=>{
            const xhr = new XMLHttpRequest();
            //请求方式 请求地址 是否异步（默认为true）
            xhr.open('POST','http://localhost:3000/api/txt',true)
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        console.log(xhr.responseText)
                    }
                }
            }

            xhr.send('name=123')
        }
```
### 文件上传
1. 新建一个FormData对象 用于上传文件 
2. 通过append方法添加文件 'file'为后端接收文件的字段名 要与后端保持一致 file.files[0]为文件对象 
3. 一般不自己设置请求头 由浏览器自动设置（boundary一般有浏览器生成随机码加----）
```js
        //新建一个FormData对象 用于上传文件 通过append方法添加文件 'file'为后端接收文件的字段名 要与后端保持一致 file.files[0]为文件对象 一般不自己设置请求头 由浏览器自动设置 
        file.addEventListener('change',()=>{
            const formData = new FormData()
            formData.append('file',file.files[0])
            const xhr = new XMLHttpRequest();
            xhr.open('POST','http://localhost:3000/api/upload',true)
            // xhr.setRequestHeader('Content-Type','multipart/form-data')
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        console.log(xhr.responseText)
                    }
                }
            }
            xhr.send(formData)
        })
```
:::tip
addEventListener('load')
load事件会在页面或图像加载完成后立即发生。
可以替代`xhr.readyState === 4`
:::
```html AJAX完整代码
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>
        <button>Sendajax</button>
        <h2><span id="progress"></span></h2>
        <button id="stop">中断请求</button>
        <input type="file" name="file" id="file">
    </div>
    <script>
        const btn = document.querySelector('button')
        const stop = document.getElementById('stop')
        const file = document.getElementById('file')

        //新建一个FormData对象 用于上传文件 通过append方法添加文件 'file'为后端接收文件的字段名 要与后端保持一致 file.files[0]为文件对象 一般不自己设置请求头 由浏览器自动设置 
        file.addEventListener('change',()=>{
            const formData = new FormData()
            formData.append('file',file.files[0])
            const xhr = new XMLHttpRequest();
            xhr.open('POST','http://localhost:3000/api/upload',true)
            // xhr.setRequestHeader('Content-Type','multipart/form-data')
            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        console.log(xhr.responseText)
                    }
                }
            }
            xhr.send(formData)
        })


        const sendajax =()=>{
            const xhr = new XMLHttpRequest();
            //请求方式 请求地址 是否异步（默认为true）
            // xhr.open('GET','http://localhost:3000/api/txt',true)
            xhr.open('POST','http://localhost:3000/api/txt',true)
            //设置请求头 一定要在open之后
            // xhr.setRequestHeader('Content-Type','application/json')
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded')

            // xhr.timeout = 1000
            
            // xhr.addEventListener('timeout',()=>{
            //     console.log('请求超时')
            // })

            xhr.addEventListener('abort',()=>{
                console.log('请求中断')
            })
            stop.addEventListener('click',()=>{
                xhr.abort()
            })

            xhr.addEventListener('progress',()=>{
                const progress = document.getElementById('progress')
                progress.innerText = `${(event.loaded/event.total*100).toFixed(2)}%`
            })

            xhr.onreadystatechange = ()=>{
                if(xhr.readyState === 4){
                    if(xhr.status === 200){
                        console.log(xhr.responseText)
                    }
                }
            }
            //传递JSON数据一定要序列化
            //urlencoded格式的数据不需要序列化
            xhr.send('name:zhangsan&age:18')
        }
    </script>
</body>
</html>
```