// 创建 render 函数
function transformRender(ast) {
    if (ast.type !== 'FunctionDecl') return
    
    let render = ''

    // 设置函数关键字
    if (ast.type === 'FunctionDecl') {
        render += 'function'
    }

    // 设置函数名称
    if (ast.id.type === 'Identifier') {
        render += ` ${ast.id.name}`
    }

    // 设置函数参数，如果有多个则 , 拼接
    if (ast.params.length) {
        render += `(${ast.params.join()})`
    } else {
        render += '()'
    }

    // 设置函数体
    if (ast.body.length) {
        if (ast.body.length === 1) {
            if (ast.body[0].type === 'ReturnStatement') {
                render += `{ return ${transformH(ast.body[0].return)} }`
            }
        }
    } else {
        render += '{ return null }'
    }

    // 返回拼接结果
    return render
}

// 创建要被调用的 h 函数
function transformH(ast) {
    if (ast.type !== 'CallExpression') return

    let h = ''

    // 设置要调用的 h 函数名
    if (ast.id.type === 'Identifier') {
        h += ast.id.name
    }

    // 如果存在 nodes，说明有节点
    if (ast.nodes.length) {

        // 如果节点数量只有一个，则必为函数名
        if (ast.nodes.length === 1) {
            h += `(${ast.nodes[0].name})`
        }
        // 如果有多个则循环遍历
        else {
            for (let i = 0; i < ast.nodes.length; i++) {
                const node = ast.nodes[i];

                // 设置 h 函数的第一个参数-元素名
                if (node.type === 'TagNode') {
                    h += `('${node.name}'`
                }
                // 设置 h 函数的第二个参数
                // 如果是数组则说明包含 h 函数，循环遍历
                else if (node.type === 'ArrayParamsNode') {
                    h += ', ['

                    // 如果数组有值，则递归调用 transformH 函数
                    if (node.params.length) {
                        for (let j = 0; j < node.params.length; j++) {
                            const jNode = node.params[j];
                            if (jNode.type === 'CallExpression') {
                                h += `${transformH(jNode)}${j !== node.params.length - 1 ? ', ' : ''}`
                            }
                        }
                    }
                    h += ']'
                }
                // 如果为文本节点，则直接作为第二个参数
                else if (node.type === 'Text') {
                    h += `, ${node.context}`
                }
            }

            // 循环结束加 ) 收尾
            h += ')'
        }
    }

    // 返回拼接结果
    return h
}

// 对转换器结果进行判断，并着手拼接目标代码
function transformJsNode(ast) {
    if (!('jsNode' in ast)) {
        console.warn('当前代码未经转换器转换');
        return
    }

    return transformRender(ast.jsNode)
}

// 创建目标代码生成器
function createGenerator(ast) {
    return transformJsNode(ast)
}

export { createGenerator }