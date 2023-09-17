import { createRenderer } from './renderer.js'
import { createElement, setTextContent, insert } from './browser.js'
import { setInstance, getInstance } from './instance'
import { unmount, onMounted } from './lifeCycle'

export {
    createRenderer,
    createElement, setTextContent, insert,
    setInstance, getInstance,
    unmount, onMounted
}