import { NodeType } from './public/common';
interface Node {
    type: NodeType;
    tag?: string;
    children?: Array<Node>;
    content?: string;
}
export default function dump(node: Node, indent?: number): void;
export {};
