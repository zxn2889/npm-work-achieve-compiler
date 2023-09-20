import { NodeType } from './public/common'
import { HAstNode, FunctionNameNode, FunctionName } from './public/interface/hNode'

/**
 * 注意：
 * 1. 入参都是模板 AST 节点
 * 2. jsNode 都为 JS AST 节点
 */

interface ParserAstTextNode {
    type: NodeType.Text,
    content: string,
    jsNode?: JsAstTextNode
}

interface ParserAstElementNode {
    type: NodeType.Element,
    tag: HTMLElement,
    children?: Array<ParserAstElementNode>,
    jsNode?: HAstNode
}

interface ParserAstRootNode {
    type: NodeType.Root,
    children: ParserAstElementNode | ParserAstTextNode,
    jsNode?: {
        type: NodeType.FunctionDecl,
        id: {
            type: NodeType.Identifier,
            name: FunctionName.Render
        },
        params: [],
        body: [
            {
                type: NodeType.ReturnStatement,
                return: HAstNode
            }
        ]
    }
}

interface JsAstTextNode {
    type: NodeType.Text,
    context: string
}

interface JsAstTagNode {
    type: NodeType.TagNode,
    name: HTMLElement
}

interface JsAstArrayParamsNode {
    type: NodeType.ArrayParamsNode,
    params: Array<HAstNode>
}

// h 函数的第一个参数
function setTagNode(tag: HTMLElement): JsAstTagNode {
    return {
        type: NodeType.TagNode,
        name: tag
    }
}

// h 函数的第二个参数
function setArrayParamsNode(params: JsAstArrayParamsNode["params"]): JsAstArrayParamsNode {
    return {
        type: NodeType.ArrayParamsNode,
        params
    }
}

// 设置函数的节点名
function setFunctionNameNode(name: FunctionName): FunctionNameNode {
    return {
        type: NodeType.Identifier,
        name
    }
}

// 设置文本节点
function setTextNode(value: string): JsAstTextNode {
    return {
        type: NodeType.Text,
        context: value
    }
}

// 设置 h 函数的节点
function setHNode(params: HAstNode["nodes"]): HAstNode {
    return {
        type: NodeType.CallExpression,
        id: setFunctionNameNode(FunctionName.H),
        nodes: params
    }
}

// 转换文本节点
function transformTextJsNode(node: ParserAstTextNode): Function {
    return () => {
        if (node.type !== NodeType.Text) return
        
        node.jsNode = setTextNode(node.content)
    }
}

// 转换元素节点
function transformElementJsNode(node: ParserAstElementNode): Function {
    return () => {
        if (node.type !== NodeType.Element) return

        const tag = setTagNode(node.tag)

        // 设置 h 函数的第一个参数的标签名
        const hNode = setHNode([tag])

        // 设置 h 函数的第二个参数
        // 如果是一个节点做文本节点录入
        if (node.children.length === 1) {
            hNode.nodes.push(node.children[0].jsNode)
        }
        // 如果不是则说明嵌套的为 h 函数
        else {
            hNode.nodes.push(setArrayParamsNode(node.children.map(c => c.jsNode)))
        }

        node.jsNode = hNode
    }
}

// 转换逻辑根节点
function transformRootJsNode(node: ParserAstRootNode): Function {
    return () => {
        if (node.type !== NodeType.Root) return

        const realNode = node.children[0].jsNode

        node.jsNode = {
            type: NodeType.FunctionDecl,
            id: {
                type: NodeType.Identifier,
                name: FunctionName.Render
            },
            params: [],
            body: [
                {
                    type: NodeType.ReturnStatement,
                    return: realNode
                }
            ]
        }
    }
}

export { transformTextJsNode, transformElementJsNode, transformRootJsNode }