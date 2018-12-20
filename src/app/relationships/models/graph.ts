import { Relation } from './relation';
import { Node }     from '@/app/core';

export interface Graph {
    nodes: Node[];
    edges: Relation[];
}