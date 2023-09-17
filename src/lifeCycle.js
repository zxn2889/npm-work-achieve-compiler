import { getInstance } from './instance.js'

// 删除 vnode 对应的真实 DOM
function unmount(vnode) {
    // 根节点有多个则循环卸载
    if (vnode.type === Fragment) {
        vnode.children.forEach(v => unmount(v))
        return
    } else if (typeof vnode.type === 'object') {
        const subTree = vnode._component.subTree
        // keep-alive 组件则假卸载
        if (vnode.type._isKeepAlive) {
            vnode._component.keptAlive.__deActivate(subTree)
        } else {
            unmount(subTree)
        }
    }
    const parent = vnode._el.parentNode
    if (parent) parent.removeChild(vnode._el)
}

// 挂载生命周期-setup 内
function onMounted(fn) {
    const instance = getInstance()
    if (instance) {
        instance.mounted.push(fn)
    }
}

export { unmount, onMounted }