// h 函数的第一个参数
function setTagNode(tag) {
    return {
        type: 'TagNode',
        name: tag
    }
}

// h 函数的第二个参数
function setArrayParamsNode(params) {
    return {
        type: 'ArrayParamsNode',
        params
    }
}

// 设置函数的节点名
function setFunctionNameNode(name) {
    return {
        type: 'Identifier',
        name
    }
}

// 设置文本节点
function setTextNode(value) {
    return {
        type: 'Text',
        context: value
    }
}

// 设置 h 函数的节点
function setHNode(params) {
    return {
        type: 'CallExpression',
        id: setFunctionNameNode('h'),
        nodes: params
    }
}

// 转换文本节点
function transformTextJsNode(node, context) {
    return () => {
        if (node.type !== 'Text') return
        
        node.jsNode = setTextNode(node.content)
    }
}

// 转换元素节点
function transformElementJsNode(node, context) {
    return () => {
        if (node.type !== 'Element') return

        const tag = setTagNode(node.tag)
        const hNode = setHNode([tag])
        if (node.children.length === 1) {
            hNode.nodes.push(node.children[0].jsNode)
        } else {
            hNode.nodes.push(setArrayParamsNode(node.children.map(c => c.jsNode)))
        }

        node.jsNode = hNode
    }
}

// 转换逻辑根节点
function transformRootJsNode(node, context) {
    return () => {
        if (node.type !== 'Root') return

        const realNode = node.children[0].jsNode

        node.jsNode = {
            type: 'FunctionDecl',
            id: {
                type: 'Identifier',
                name: 'render'
            },
            params: [],
            body: [
                {
                    type: 'ReturnStatement',
                    return: realNode
                }
            ]
        }
    }
}

export { transformTextJsNode, transformElementJsNode, transformRootJsNode }