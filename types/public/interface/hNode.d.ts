import { NodeType } from '../common';
declare enum FunctionName {
    Render = "render",
    H = "h"
}
interface FunctionNameNode {
    type: NodeType.Identifier;
    name: FunctionName;
}
interface HNodesNode {
    type: NodeType;
    name?: HTMLElement;
    params?: Array<HAstNode>;
    context?: string;
}
interface HAstNode {
    type: NodeType.CallExpression;
    id: FunctionNameNode;
    nodes: Array<HNodesNode>;
}
export { HAstNode, FunctionNameNode, FunctionName };
