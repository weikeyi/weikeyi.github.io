## 原型链
### Prototype   显式原型
    他是个函数的属性
### __proto__隐式原型
    他是个对象的属性

#### 构造函数指向该函数本身
__proto__指向该函数的 Prototype
只有顶层是null
先从自身找，自身找不到就去Prototype去找


## 箭头函数与普通函数区别
- 消除函数二义性
- 没有arguments constructor 无法被new
- 箭头函数没有自己的this，所以箭头函数的this是继承而来的

## jQuery 的 无new构建
- 直接返回new自身属性实例
- 通过原型链继承方法

```js
;(function () {
    const jQuery = function (selector, context = document) {
        return new jQuery.prototype.init(selector, context)
    }
    jQuery.fn = jQuery.prototype

    jQuery.prototype.init = function (selector, context) {
        if (!selector) return this
        this.dom = document.querySelectorAll(selector)
        return this
    }
    jQuery.fn.$extend = function(obj){
        for(let key in obj){
            this[key] = obj[key]
        }
        return this
    }
    jQuery.ready = function(callback){
        //只需要等待DOM完成加载即可
        //支持async defer 加载
        if(document.readyState === 'complete'){
            callback()
        }else{
            document.addEventListener('DOMContentLoaded',callback)
        }
    }

    globalThis.jQuery = jQuery
    globalThis.$ = jQuery
})(typeof window !== 'undefined' ? window : globalThis)
```
## Dom获取与操作
- text
- css
- parent
- sibling
- next 
- prev
```js
jQuery.fn.text = function (text) {
    this.dom.forEach((item) => {
        item.textContent = text
    })
    return this
}

//css
jQuery.fn.css = function (key, value) {
    this.dom.forEach((el) => {
        el.style[key] = value
    })
    return this
}
jQuery.fn.parent = function () {
    return this.dom[0].parentElement
}

jQuery.fn.siblings = function () {
    const parent = this.dom[0].parentElement
    const children = parent.children
    const siblings = []
    for (let i = 0; i < children.length; i++) {
        if (children[i] !== this.dom[0]) {
            siblings.push(children[i])
        }
    }
    return siblings
}

//next
jQuery.fn.next = function () {
    return this.dom[0].nextElementSibling
}
//prev
jQuery.fn.prev = function () {
    return this.dom[0].previousElementSibling
}
```
## 动画引擎animate
```js
//动画引擎animate
jQuery.fn.animate = function (properties, duration, easing = 'linear',callback) {
    //记录原始状态
    //记录要变化的状态
    //计算增量
    //计算帧率
    //duration 总耗时
    const startStyle = {}
    const startTime = performance.now() //返回微秒，她是从页面加载到此刻所经过的时间
    const currentDom = this.dom[0]

    for (let key in properties) {
        startStyle[key] = parseFloat(window.getComputedStyle(currentDom)[key])
    }

    const animateStep = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const cssNumberProperties = ['opacity','zIndex','fontWeight','lineHeight','zoom','flexGrow','flexShrink','order']
        const easingFunctions ={
            linear: (t) => t,
            easeInQuad: (t) => t * t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        }

        for (let key in properties) {
            const startValue = startStyle[key] //开始值
            const endValue = properties[key] //结束值         
            const easingFunction = easingFunctions[easing]         
            const easingValue = easingFunction(progress)
            const value = startValue + (endValue - startValue) * easingValue
            currentDom.style[key] = cssNumberProperties.includes(key) ? value : `${value}px`
        }

        if (progress < 1) {
            requestAnimationFrame(animateStep)
        } else {
            callback && callback()
        }
    }
    requestAnimationFrame(animateStep)
}
```

### 完整代码
```js
//跟JQuery很像  无new构建
//JQuery的动画引擎计时器  RAF技术  动画引擎

;(function () {
    const jQuery = function (selector, context = document) {
        return new jQuery.prototype.init(selector, context)
    }
    jQuery.fn = jQuery.prototype

    jQuery.prototype.init = function (selector, context) {
        if (!selector) return this
        this.dom = document.querySelectorAll(selector)
        return this
    }
    jQuery.fn.$extend = function(obj){
        for(let key in obj){
            this[key] = obj[key]
        }
        return this
    }
    jQuery.ready = function(callback){
        //只需要等待DOM完成加载即可
        //支持async defer 加载
        if(document.readyState === 'complete'){
            callback()
        }else{
            document.addEventListener('DOMContentLoaded',callback)
        }
    }

    globalThis.jQuery = jQuery
    globalThis.$ = jQuery
})(typeof window !== 'undefined' ? window : globalThis)
//判断环境
//浏览器环境指向  window  node环境指向 global

jQuery.fn.init.prototype = jQuery.fn

jQuery.fn.text = function (text) {
    this.dom.forEach((item) => {
        item.textContent = text
    })
    return this
}

//css
jQuery.fn.css = function (key, value) {
    this.dom.forEach((el) => {
        el.style[key] = value
    })
    return this
}
jQuery.fn.parent = function () {
    return this.dom[0].parentElement
}

jQuery.fn.siblings = function () {
    const parent = this.dom[0].parentElement
    const children = parent.children
    const siblings = []
    for (let i = 0; i < children.length; i++) {
        if (children[i] !== this.dom[0]) {
            siblings.push(children[i])
        }
    }
    return siblings
}

//next
jQuery.fn.next = function () {
    return this.dom[0].nextElementSibling
}
//prev
jQuery.fn.prev = function () {
    return this.dom[0].previousElementSibling
}

//动画引擎animate
jQuery.fn.animate = function (properties, duration, easing = 'linear',callback) {
    //记录原始状态
    //记录要变化的状态
    //计算增量
    //计算帧率
    //duration 总耗时
    const startStyle = {}
    const startTime = performance.now() //返回微秒，她是从页面加载到此刻所经过的时间
    const currentDom = this.dom[0]

    for (let key in properties) {
        startStyle[key] = parseFloat(window.getComputedStyle(currentDom)[key])
    }

    const animateStep = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const cssNumberProperties = ['opacity','zIndex','fontWeight','lineHeight','zoom','flexGrow','flexShrink','order']
        const easingFunctions ={
            linear: (t) => t,
            easeInQuad: (t) => t * t,
            easeOutQuad: (t) => t * (2 - t),
            easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        }

        for (let key in properties) {
            const startValue = startStyle[key] //开始值
            const endValue = properties[key] //结束值         
            const easingFunction = easingFunctions[easing]         
            const easingValue = easingFunction(progress)
            const value = startValue + (endValue - startValue) * easingValue
            currentDom.style[key] = cssNumberProperties.includes(key) ? value : `${value}px`
        }

        if (progress < 1) {
            requestAnimationFrame(animateStep)
        } else {
            callback && callback()
        }
    }
    requestAnimationFrame(animateStep)
}

jQuery.ajax = function(url,options){
    const xhr =new XMLHttpRequest()
    xhr.open(options.method || 'GET',url,true)
    xhr.send(options.data || null)
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            options.success && options.success(xhr.responseText)
        }
    }
}

$.ajax('http://127.0.0.1:11489/index.html',{
    success:function(data){
        console.log(data);
    }
})
$.fn.$extend({
    fadeIn:function(){
        this.animate({opacity:1},2000)
    },
    fadeOut:function(){
        this.animate({opacity:0},2000)
    }
})

console.log($('div'))
$('div').animate({ width: 500, height: 500,opacity:1 }, 2000, 'linear',() => {})
````