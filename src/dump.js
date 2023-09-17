// 打印模板 AST 树
export default function dump(node, indent = 0) {
    const type = node.type
    const desc = type === 'Root'
        ? ''
        : type === 'Element'
            ? node.tag
            : node.content

    console.log(`${'-'.repeat(indent)}${type}:${desc}`)

    if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
            dump(node.children[i], indent + 2)
        }
    }
}