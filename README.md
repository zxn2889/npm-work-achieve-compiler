# Achieve-renderer

Implement a simple Vue compiler.

# Installing
```js
npm i -D @zxn2889/achieve-compiler
```

or (recommend)

```js
pnpm add -D @zxn2889/achieve-compiler
```

# Example

```js
import { createParser } from './parser.js'
import { createOptimizeParser, getCurrentContext } from './optimizeParser.js'
import dump from './dump.js'

const source = `<div><p>我是段落No.1</p><p>我是段落No.2</p></div>`
const ast = createParser(source)
createOptimizeParser(ast, [replaceASTText, replaceASTElement, delASTElement])

dump(ast)

// 替换模板 AST 中文本节点内容
function replaceASTText(node) {
    if (node.type === 'Text') {
        getCurrentContext().replaceASTNode({
            type: 'Text',
            content: '你已经很厉害了，但还要继续加油！'
        })
    }
}

// 替换模板 AST 中节点元素类型
function replaceASTElement(node) {
    if (node.type === 'Element' && node.tag === 'p') {
        node.tag = 'div'
        getCurrentContext().replaceASTNode(node)
    }
}

function delASTElement(node) {
    if (node.type === 'Text') {
        getCurrentContext().removeASTNode()
    }
}
```