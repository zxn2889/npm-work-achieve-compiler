import { insert, createElement } from "./browser.js"
import { getInstance } from './lifeCycle.js'

const KeepAlive = {
    _isKeepAlive: true,
    setup() {
        function move(vnode, container, anchor) {
            insert(vnode._el, container, anchor)
        }

        const instance = getInstance()
        const hideContainer = createElement('div')
        
        // 伪挂载隐藏容器中节点
        function activate(vnode, container, anchor) {
            move(vnode, container, anchor)
        }
        
        // 伪卸载 keep-alive 内容
        function deActivate(vnode) {
            move(vnode, hideContainer)
        }
        
        instance.keptAlive = {
            _activate: activate,
            _deActivate: deActivate
        }
        
        const defaultVnode = instance.slots.default()
        const cache = new Map()
        const cacheVnode = cache.get(defaultVnode.type)
        if (cacheVnode) {
            defaultVnode._component = cacheVnode._component
            defaultVnode._isCacheKeepAlive = true
        } else {
            cache.set(defaultVnode.type, defaultVnode)
        }

        return defaultVnode
    }
}