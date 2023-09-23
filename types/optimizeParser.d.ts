import { NodeType } from './public/common';
interface Context {
    currentNode: CurrentNode | null;
    childIndex: number | null;
    parentNode: CurrentNode | null;
    funcs: Array<Function>;
    removeASTNode: Function;
    replaceASTNode: Function;
}
type CurrentContext = Context | null;
type ASTChildren = ParserAstElementNode | ParserAstTextNode;
type CurrentNode = AST | ASTChildren;
interface AST {
    type: NodeType;
    children?: Array<ASTChildren>;
}
interface ParserAstTextNode {
    type: NodeType.Text;
    content: string;
}
interface ParserAstElementNode {
    type: NodeType.Element;
    tag: HTMLElement;
    children?: Array<ASTChildren>;
}
declare function createOptimizeParser(ast: CurrentNode, funcs?: Array<Function>): void;
declare function getCurrentContext(): CurrentContext;
export { createOptimizeParser, getCurrentContext };
