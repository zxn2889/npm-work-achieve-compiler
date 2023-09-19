enum Type {
    Root,
    Element,
    Text
}

interface Node {
    type: Type,
    tag?: string,
    children?: Array<Node>,
    content?: string
}

// 打印模板 AST 树
export default function dump(node: Node, indent: number = 0): void {
    const type = node.type
    const desc = type === Type.Root
        ? ''
        : type === Type.Element
            ? node.tag
            : node.content

    console.log(`${'-'.repeat(indent)}${type}:${desc}`)

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            dump(node.children[i], indent + 2)
        }
    }
}