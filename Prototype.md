## 原型链
### Prototype   显式原型
    他是个函数的属性
### __proto__隐式原型
    他是个对象的属性

#### 构造函数指向该函数本身
- __proto__指向构造函数函数的 Prototype
- 只有顶层是null
- 先从自身找，自身找不到就去Prototype去找

::: tip 原型链
JS中，原型链用于实现对象的继承。每个JAvaScript对象都有一个内部属性，叫做Prototype，该对象的__proto__指向这个Prototype，称为对象的原型。当我们访问对象上的方法时，如果我们在对象自身上找不到该属性，JavaScript会沿着原型链一直向上查找，直到找到该属性或者原型链的末端，通常情况下，原型链的末端是Object.prototype,指向null
:::

## 箭头函数与普通函数区别
- 没有constructor 无法被new
- 箭头函数this，arguments指向上下文
- 消除函数二义性

::: tip 二义性
函数被调用有两种方式，一是使用new作为构造函数，而是加括号直接调用，因此不能直接分辨该函数的使用方法，使用箭头函数可以避免这个问题
:::


## jQuery 的 无new构建
- 直接返回new自身属性实例
- 通过原型链继承方法

```js {3}
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
`textContent`
- 如果节点是Document，或者 DOCTYPE，返回null，对于其他节点类型，textContent 将所有子节点的 textContent 合并后返回
:::tip
textContent 会获取所有元素的内容，包括`<script>` 和` <style> `元素，然而 innerText 只展示给人看的元素
textContent 会返回节点中的每一个元素。相反，innerText 受 CSS 样式的影响，并且不会返回隐藏元素的文本
:::
`style`
- 一个实时的 CSSStyleDeclaration 对象。
`parent`
- 返回当前节点的父元素节点，如果该元素没有父节点，或者父节点不是一个 DOM 元素，则返回 null。
`chirldren`
- 返回 一个 Node 的子elements
`next`
- 当前元素在其父元素的子元素节点中的后一个元素节点
`prev`
- 返回当前节点的前一个兄弟节点

::: details 点我查看代码
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
:::

::: danger requestAnimationFrame
告诉浏览器你希望执行一个动画。它要求浏览器在下一次重绘之前，调用用户提供的回调函数。
:::

::: danger performance.now()
返回值表示为从time origin(为当前文档生命周期的开始节点的标准时间)之后到当前调用时经过的时间
:::

::: danger getComputedStyle
返回该对象在计算后报告元素的所有 CSS 属性的值
:::


::: details 动画引擎animate
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
:::



::: details 完整代码
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
:::


