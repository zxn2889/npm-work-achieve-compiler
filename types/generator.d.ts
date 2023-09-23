import { NodeType } from "./public/common";
import { HAstNode, FunctionNameNode } from './public/interface/hNode';
interface FunctionBodyNode {
    type: NodeType.ReturnStatement;
    return: HAstNode;
}
interface RenderAstNode {
    type: NodeType;
    id: FunctionNameNode;
    params: Array<[]>;
    body: Array<FunctionBodyNode>;
}
interface AstNode {
    type: NodeType.Root;
    children: any;
    jsNode: RenderAstNode;
}
declare function createGenerator(ast: AstNode): string | undefined;
export { createGenerator };
