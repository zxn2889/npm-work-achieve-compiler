import { NodeType } from './public/common';
import { HAstNode, FunctionName } from './public/interface/hNode';
/**
 * 注意：
 * 1. 入参都是模板 AST 节点
 * 2. jsNode 都为 JS AST 节点
 */
interface ParserAstTextNode {
    type: NodeType.Text;
    content: string;
    jsNode?: JsAstTextNode;
}
interface ParserAstElementNode {
    type: NodeType.Element;
    tag: HTMLElement;
    children?: Array<ParserAstElementNode>;
    jsNode?: HAstNode;
}
interface ParserAstRootNode {
    type: NodeType.Root;
    children: ParserAstElementNode | ParserAstTextNode;
    jsNode?: {
        type: NodeType.FunctionDecl;
        id: {
            type: NodeType.Identifier;
            name: FunctionName.Render;
        };
        params: [];
        body: [
            {
                type: NodeType.ReturnStatement;
                return: HAstNode;
            }
        ];
    };
}
interface JsAstTextNode {
    type: NodeType.Text;
    context: string;
}
declare function transformTextJsNode(node: ParserAstTextNode): Function;
declare function transformElementJsNode(node: ParserAstElementNode): Function;
declare function transformRootJsNode(node: ParserAstRootNode): Function;
export { transformTextJsNode, transformElementJsNode, transformRootJsNode };
