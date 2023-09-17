// 词法分析——将源代码转为一组特定的词法记号
function getTokens(code) {
    const status= {
        origin: 1, // 起始状态
        startTag: 2, // 开始标签状态
        tagName: 3, // 标签名称状态
        text: 4, // 文本状态
        endTag: 5, // 开始结束标签状态
        endTagName: 6 // 结束结束标签状态
    }

    const tokens = []
    let content = []
    let currentStatus = status.origin

    function isLetter(letter) {
        const c = letter.charCodeAt()
        return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || /^[\u4E00-\u9FA5]+$/.test(letter) || /\s/.test(letter) || /\w/.test(letter) || letter === '.'
    }

    for (let i = 0; i < code.length; i++) {
        // debugger
        const letter = code[i];
        if (letter === '<') {
            if (currentStatus === status.text) {
                tokens.push({ type: 'text', content: content.join('') })
                content.length = 0
            }
            currentStatus = status.startTag
            continue;
        } else if (isLetter(letter)) {
            content.push(letter)
            if (currentStatus === status.startTag) {
                currentStatus = status.tagName
                continue;
            } else if (currentStatus === status.origin) {
                currentStatus = status.text
                continue;
            } else if (currentStatus === status.endTag) {
                currentStatus = status.endTagName
                continue;
            }
        } else if (letter === '>') {
            if (currentStatus === status.tagName) {
                tokens.push({ type: 'startTag', tag: content.join('') })
                content.length = 0
                currentStatus = status.origin
                continue;
            } else if (currentStatus === status.endTagName) {
                tokens.push({ type: 'endTag', tag: content.join('') })
                content.length = 0
                currentStatus = status.origin
                continue;
            }
        } else if (letter === '/') {
            currentStatus = status.endTag
            continue;
        }
    }

    return tokens
}

// 解析器——将一组词法记号转为模板 AST 树
function parser(code) {
    const tokens = getTokens(code)
    const ast = {
        type: 'Root',
        children: null
    }
    const reallyNode = []
    const bucket = []

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const type = token.type
        if (type === 'startTag') {
            const eleNode = {
                type: 'Element',
                tag: token.tag,
                children: []
            }
            const currentNode = bucket[bucket.length - 1]
            if (currentNode) {
                currentNode.children.push(eleNode)
            } else {
                reallyNode.push(eleNode)
            }
            bucket.push(eleNode)
        } else if (type === 'endTag') {
            bucket.pop()
        } else if (type === 'text') {
            const textNode = {
                type: 'Text',
                content: token.content
            }
            const currentNode = bucket[bucket.length - 1]
            if (currentNode) {
                currentNode.children.push(textNode)
            } else {
                reallyNode.push(eleNode)
            }
        }
    }

    ast.children = reallyNode

    return ast
}

// 创建解析器
function createParser(sourceCode) {
    return parser(sourceCode)
}

export { createParser }