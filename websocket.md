## WebSocket
WebSocket是一种双向通信协议，它允许客户端和服务器之间建立一个持久的连接，双方可以随时向对方发送数据。WebSocket是基于握手协议的，它是一个独立的协议，不依赖HTTP协议。WebSocket是全双工通信的，客户端和服务器可以同时向对方发送数据。
适用场景：实时聊天、实时数据更新、在线游戏等。
### 主要API
1. WebSocket：用于创建一个WebSocket对象
```js
        let ws = new WebSocket('ws://localhost:3000')
```
2. onopen：连接建立时触发
```js
        ws.onopen = (event) => {
            console.log('连接建立')
        }
```
3. onmessage：接收到消息时触发
```js
        ws.onmessage = (event) => {
            console.log(event.data)
        }
```
4. onerror：连接出错时触发
```js
        ws.onerror = (event) => {
            console.log('连接出错')
        }
```
5. onclose：连接关闭时触发
```js
        ws.onclose = (event) => {
            console.log('连接关闭')
        }
```
6. send：发送消息
```js
        ws.send('hello')
```
7. close：关闭连接
```js
        ws.close()
```
### websocket广播消息
```js
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    })
})
```
### websocket心跳检测
心跳检测是为了保持连接的活跃状态，防止连接超时。可以通过定时发送ping消息来实现心跳检测。

```js
const state = {
    heart:1,
    message:0
}

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })
wws.on('connection',(ws)=>{
    ws.on('message',(message)=>{
        if(message === 'ping'){
            ws.send(JSON.stringify({
                type:state.message,
                message:"pong"
            }))
        }
    })
    let heartInterval = null
    const heartCheck = ()=>{
        if(wws.readyState === WebSocket.OPEN){
            ws.send(JSON.stringify({
                type:state.heart,
                message:"ping"}))
    }else{
        clearInterval(heartInterval)
    }
    }
    setInterval(hertCheck,5000)
})

```
### 服务器端
```js
const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3000 })
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received: %s', message)
    })
    ws.send('something')
})
```
