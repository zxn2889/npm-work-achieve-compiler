import { transformTextJsNode, transformElementJsNode, transformRootJsNode } from './transformer.js'
import { NodeType } from './public/common'

interface Context {
    currentNode: CurrentNode | null,
    childIndex: number | null,
    parentNode: CurrentNode | null,
    funcs: Array<Function>
    removeASTNode: Function,
    replaceASTNode: Function
}

type CurrentContext = Context | null
type ASTChildren = ParserAstElementNode | ParserAstTextNode
type CurrentNode = AST | ASTChildren

let currentContext: CurrentContext = null

interface AST {
    type: NodeType,
    children?: Array<ASTChildren>
}

interface ParserAstTextNode {
    type: NodeType.Text,
    content: string
}

interface ParserAstElementNode {
    type: NodeType.Element,
    tag: HTMLElement,
    children?: Array<ParserAstElementNode>
}

// 优化模板 AST
function optimizeParser(ast: AST, funcs: Array<Function> = []) {
    
    // 创建上下文
    const context: Context = {
        currentNode: null,
        childIndex: null, // 当前节点在父节点中的子节点
        parentNode: null,
        funcs: [transformTextJsNode, transformElementJsNode, transformRootJsNode, ...funcs],
        removeASTNode: () => setRemoveASTNode.call(context),
        replaceASTNode: (node: CurrentNode) => setReplaceASTNode.call(context, node)
    }

    // 将上下文赋予全局变量
    setCurrentContext(context)
    
    traverseNode(ast, context)

    // 将全局变量置为空
    setCurrentContext(null)
}

// 遍历 AST 树，并执行相应优化
function traverseNode(ast: CurrentNode, context: Context) {
    context.currentNode = ast
    const node: CurrentNode = ast
    const funcs: Array<Function> = context.funcs
    
    const callBackFunc = []
    if (funcs.length) {
        for (let i = 0; i < funcs.length; i++) {
            const fun = funcs[i](node, context)
            if (fun) {
                callBackFunc.push(fun)
            }
            if (!node) return
        }
    }
    
    if (node.type !== NodeType.Text) {
        const child = node.children
        if (child) {
            for (let i = 0; i < child.length; i++) {
                context.childIndex = i
                context.parentNode = node
                traverseNode(child[i], context)
            }
        }
    }

    if (callBackFunc.length) {
        for (let i = callBackFunc.length - 1; i >= 0; i--) {
            callBackFunc[i]();
        }
    }
}

// 平替 AST 节点
function setReplaceASTNode(node: CurrentNode) {
    if (this.parentNode) {
        this.currentNode = node
        this.parentNode.children[this.childIndex] = node
    }
}

// 删除 AST 节点
function setRemoveASTNode() {
    if (this.parentNode) {
        this.parentNode.children.splice(this.childIndex, 1)
        this.currentNode = null
    }
}

// 创建解析优化器
function createOptimizeParser(ast: CurrentNode, funcs: Array<Function> = []) {
    optimizeParser(ast, funcs)
}

// 设置上下文至当前上下文变量中
function setCurrentContext(context: CurrentContext): void {
    currentContext = context
}

// 获取当前上下文变量
function getCurrentContext(): CurrentContext {
    return currentContext
}

export { createOptimizeParser, getCurrentContext }