import { Node } from '@/app/core';

export interface Relation {
    from: Node;
    to: Node;
    labels: string[];
}