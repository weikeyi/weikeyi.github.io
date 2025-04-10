## SSE-post
原生的的EventSource 不能使用post方法，只能使用get方法，所以我们需要使用fetch来实现post方法。

**前端实现核心为创建一个getReader方法，可读取响应体数据的reader对象，可以流式读取相应数据，他还提供了一个read()方法，可以异步读取下一个分块数据**

```js web
import { ref, onUpdated, Ref } from 'vue';

const controller: AbortController = new AbortController();
const signal: AbortSignal = controller.signal;
const userInput: Ref<string> = ref("");
const messages: Ref<{ id?: number; role: string; content: string }[]> = ref([]);
const chatMessages: Ref<HTMLElement | null> = ref(null);

const stop = () => {
  controller.abort();
};

const sendMessage = () => {
  if (!userInput.value) return;

  messages.value.push({ id: Date.now(), role: "user", content: userInput.value });
  messages.value.push({ id: Date.now() + 1, role: "bot", content: "你发送的消息是：" + userInput.value });

  userInput.value = "";
};

const testFunction = () => {
  fetch('http://localhost:3000/chat', {
    method: 'POST',
    signal,
  })
    .then((res: Response) => {
      if (!res.ok) {
        throw new Error(`请求失败: ${res.status}`);
      }
      if (!res.body) {
        throw new Error('请求体为空');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      read();
      messages.value.push({ id: Date.now(), role: "user", content: 'SSETEST' });
      messages.value.push({ id: Date.now() + 1, role: "bot", content: '' });
      let content = '';
      function read() {
        reader.read().then(({ done, value }) => {
          if (done) {
            console.log('SSE stream closed.');
            return;
          }
          content += decoder.decode(value);
          // 更新最后一个 bot 消息的内容
          if (messages.value.length > 0 && messages.value[messages.value.length - 1].role === 'bot') {
            messages.value[messages.value.length - 1].content = content;
          } else {
            messages.value.push({ role: 'bot', content: content });
          }
          read();
        });
      }
    })
    .catch((err) => {
      console.error('SSE Error:', err);
      messages.value.push({ role: 'bot', content: `SSE 连接错误: ${err.message}` });
    });
};

onUpdated(() => {
  if (chatMessages.value) {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  }
});
```
**后端实现核心为设置content-type为text/event-stream，设置Cache-Control为no-cache，设置Connection为keep-alive，并且在读取文件时分块读取**
```js server
import express from 'express'
//express
import * as fs from 'fs'
const app = express()
app.use(express.json())//支持post解析json格式

//get req.query获取参数
//第一个是参数api的地址
//第二个是回调函数 req是请求 res是返回
app.get('/get', (req, res) => {
    console.log(req.query)
    
    res.send('Hello GET')
})

//post 通过req.body获取
app.post('/post', (req, res) => {
    console.log(req.body)
    res.send('Hello POST')
})

//动态参数 通过req.params获取
app.get('/get/:id', (req, res) => {
    console.log(req.params)
    res.send('Hello ' + req.params.id)
})

app.post('/chat',async (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*'); // 设置允许的来源
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET');           // 设置允许的 HTTP 方法
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');        // 设置允许的请求头

    res.setHeader('Content-Type','text/event-stream')
    res.setHeader('Cache-Control','no-cache')
    res.setHeader('Connection','keep-alive')
    // res.flushHeaders()

    try{
        let count = 0
        const data = fs.readFileSync('./index.txt','utf-8')
        
        const arr = data.split('')
        let timer = setInterval(()=>{
            if(count<arr.length){
                res.write(`${arr[count]}\n\n`)
                count++
            }else{
             clearInterval(timer)
             res.end()
            }
        },500)
    }catch(err){
        console.log(err)
    }

})

app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000')
})
```

## SSE
SSE是一种服务器推送技术，它允许服务器向客户端发送事件，而不是客户端请求数据。SSE是基于HTTP协议的，所以它只能从服务器到客户端单向发送数据，而不能从客户端到服务器发送数据。SSE是基于事件的，服务器发送的数据是一个事件流，客户端通过监听事件来获取数据。
适用场景：实时数据更新、消息推送、日志输出等。
### 主要API
1. EventSource：用于创建一个SSE对象
```js
        let eventSource = new EventSource('http://localhost:3000/sse')
        eventSource.onmessage = (event) => {
            console.log(event.data)
        }
        //监听事件 事件默认为message 后端可以改变  前端监听的事件名要与后端一致
        eventSource.addEventListener('test',(event)=>{
            console.log(event.data)
        })
```
2. onopen：连接建立时触发
```js
        eventSource.onopen = (event) => {
            console.log('连接建立')
        }
```
3. onmessage：接收到消息时触发
```js
        eventSource.onmessage = (event) => {
            console.log(event.data)
        }
```
4. onerror：连接出错时触发
```js
        eventSource.onerror = (event) => {
            console.log('连接出错')
        }
```
5. close：关闭连接
```js
        eventSource.close()
```
### 服务器端
```js
app.get(
    '/sse',
    (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',//核心
            'Cache-Control': 'no-cache',//不缓存
            'Connection': 'keep-alive'// 保持长连接
        })
        const txt = 'data: hello\ns\nd\nadsa\n\nsadasd\n\n'
        const arr = txt.split('\n')
        let current = 0
        let timer = setInterval(() => {
            if (current < arr.length) {
                res.write(arr[current])
                current++
            }else{
                ClearInterval(timer)
            }
        }, 1000)
    }
)
```
完整代码
```js
        const btn = document.querySelector('button')
        const stop = document.getElementById('stop')
        const file = document.getElementById('file')
        const abort = new AbortController()

        const sendFetch = ()=>{
            //后端可能返回的对象
            //blob对象
            //json对象
            //formData对象
            //arrayBuffer对象
            //text对象
            //res.text().then(data=>console.log(data))
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

            
        }
```


### SSE
SSE（Server-Sent Events）是一种服务器推送技术，它允许服务器向客户端发送事件，而不是客户端请求数据。SSE是基于HTTP协议的，所以它只能从服务器到客户端单向发送数据，而不能从客户端到服务器发送数据。SSE是基于事件的，服务器发送的数据是一个事件流，客户端通过监听事件来获取数据。
:::tip Websocket
WebSocket是一种双向通信协议，它允许客户端和服务器之间建立一个持久的连接，双方可以随时向对方发送数据。WebSocket是基于TCP协议的，它是一个独立的协议，不依赖HTTP协议。WebSocket是全双工通信的，客户端和服务器可以同时向对方发送数据。
:::
:::tip SSE
1. SSE是基于HTTP协议的，所以它只能从服务器到客户端单向发送数据，而不能从客户端到服务器发送数据。
2. SSE是基于事件的，服务器发送的数据是一个事件流，客户端通过监听事件来获取数据。
3. SSE是基于长连接的，服务器发送的数据是一个持久的连接，客户端和服务器之间保持一个长连接。
4. SSE是基于文本的，服务器发送的数据是文本格式，客户端通过监听事件来获取数据。
:::

```js
app.get(
    '/sse',
    (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream')
        setInterval(() => {
            res.write('event: test\n')
            res.write('data: hello\n\n'+Date.now())
        }, 1000)
    }
)
```
```js
        let eventSource = new EventSource('http://localhost:3000/sse')
        eventSource.onmessage = (event) => {
            console.log(event.data)
        }
```