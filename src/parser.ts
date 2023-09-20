import { NodeType } from './public/common'

type SourceCode = string

enum StatusValue {
    origin = 1,
    startTag,
    tagName,
    text,
    endTag,
    endTagName
}

interface Status {
    origin: number,
    startTag: number,
    tagName: number,
    text: number,
    endTag: number,
    endTagName: number
}

const status: Status = {
    origin: StatusValue.origin, // 起始状态
    startTag: StatusValue.startTag, // 开始标签状态
    tagName: StatusValue.tagName, // 标签名称状态
    text: StatusValue.text, // 文本状态
    endTag: StatusValue.endTag, // 开始结束标签状态
    endTagName: StatusValue.endTagName // 结束结束标签状态
}

enum TokenType {
    StartTag,
    EndTag,
    Text
}

type TagToken = {
    type: TokenType.StartTag | TokenType.EndTag,
    tag: HTMLElement | string,
}

type TextToken = {
    type: TokenType.Text,
    content: string
}

type Token = TagToken | TextToken

// 词法分析——将源代码转为一组特定的词法记号
function getTokens(code: SourceCode) {
    const tokens: Array<Token> = []
    let content: Array<string> = []
    let currentStatus: StatusValue = status.origin

    function isLetter(letter: string): Boolean {
        const c = letter.charCodeAt(0)
        return (c >= 65 && c <= 90) || (c >= 97 && c <= 122) || /^[\u4E00-\u9FA5]+$/.test(letter) || /\s/.test(letter) || /\w/.test(letter) || letter === '.'
    }

    for (let i = 0; i < code.length; i++) {
        // debugger
        const letter = code[i];
        if (letter === '<') {
            if (currentStatus === status.text) {
                tokens.push({ type: TokenType.Text, content: content.join('') })
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
                tokens.push({ type: TokenType.StartTag, tag: content.join('') })
                content.length = 0
                currentStatus = status.origin
                continue;
            } else if (currentStatus === status.endTagName) {
                tokens.push({ type: TokenType.EndTag, tag: content.join('') })
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
function parser(code: SourceCode) {
    type AST = {
        type: NodeType.Root,
        children: Array<ASTChildren>
    }

    type ElementNode = {
        type: NodeType.Element,
        tag: HTMLElement | string,
        children: Array<ASTChildren>
    }

    type TextNode = {
        type: NodeType.Text,
        content: string
    }

    type ASTChildren = ElementNode | TextNode

    const tokens: Array<Token> = getTokens(code)
    const ast: AST = {
        type: NodeType.Root,
        children: []
    }
    const reallyNode: Array<ASTChildren> = []
    const bucket: Array<ASTChildren> = []

    for (let i = 0; i < tokens.length; i++) {
        const token: Token = tokens[i];
        const type: TokenType = token.type
        if (type === TokenType.StartTag && 'tag' in token) {
            const eleNode: ElementNode = {
                type: NodeType.Element,
                tag: token.tag,
                children: []
            }
            const currentNode = bucket[bucket.length - 1] as ElementNode
            if (currentNode && 'children' in currentNode) {
                currentNode.children.push(eleNode)
            } else {
                reallyNode.push(eleNode)
            }
            bucket.push(eleNode)
        } else if (type === TokenType.EndTag) {
            bucket.pop()
        } else if (type === TokenType.Text && 'content' in token) {
            const textNode: TextNode = {
                type: NodeType.Text,
                content: token.content
            }
            const currentNode = bucket[bucket.length - 1] as ElementNode
            if (currentNode && 'children' in currentNode) {
                currentNode.children.push(textNode)
            } else {
                reallyNode.push(textNode)
            }
        }
    }

    ast.children = reallyNode

    return ast
}

// 创建解析器
function createParser(sourceCode: SourceCode) {
    return parser(sourceCode)
}

export { createParser }