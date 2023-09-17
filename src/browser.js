// 创建一个元素
function createElement(tag) {
    return document.createElement(tag)
}

// 添加元素的文本内容
function setTextContent(el, text) {
    el.textContent = text
}

// 在元素前添加内容，anchor 未指定则是在当前父元素的末尾添加
function insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
}

// 对不同情况下的 prop 属性做处理
function patchProps(key, el, propVal) {

    // 匹配所有事件
    if (/^on/.test(key)) {
        // 设置事件存储器
        let invokers = el._evi || (el._evi = {})

        // 匹配具体事件类型的绑定值
        let invoker = invokers[key]

        // 如果传入值存在时
        if (propVal) {

            // 如果绑定的事件类型值不存在时添加事件
            if (!invoker) {

                // 通过高阶函数创建虚拟指向
                invoker = el._evi[key] = (e) => {
                    // e.timeStamp 为执行时事件触发的时间
                    // 事件触发的时间 < 事件委托的时间时，则不触发
                    if (e.timeStamp < invoker.attachTime) return false

                    // 一个类型上绑定多个事件时，循环触发
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn)
                    } else if (Object.prototype.toString.call(invoker.value) === '[object Object]') {
                        // 绑定为非函数时警告
                        console.warn('事件值要为函数');
                    } else {
                        // 正常执行
                        invoker.value(e)
                    }
                }

                // 将传入的值赋值给高阶函数中具体执行逻辑
                invoker.value = propVal

                // 赋值事件触发时间
                // performance 为高精度时间
                invoker.attachTime = performance.now()

                // 给元素添加事件
                const type = key.slice(2).toLowerCase()
                el.addEventListener(type, invoker)
            } else {
                invoker.value = propVal
            }
        } else {
            if (invoker) {
                el.removeEventListener(type, invoker)
            }
        }
    }
    if (key === 'class') {
        el.className = propVal
    } else if(shouldSetAttr(key, el)) {
        // 判断是否只设置 key，没有设置 value
        if(typeof el[key] === 'boolean' && propVal === '') {
            el[key] = true
        } else {
            el[key] = propVal
        }
    } else {
        el.setAttribute(key, propVal) 
    }
}

// 判断属性是否只能通过 setAttribute 设置
function shouldSetAttr(key, el) {
    // 对于表单情况的特殊处理
    if(el.tagName === 'INPUT' && key === 'form') return false

    // 判断当前属性在 DOM properties 上是否存在
    return key in el
}

export { createElement, setTextContent, insert, patchProps }