import { Node } from '@/app/core';

export interface Place extends Node {
    name: string;
}

export namespace Place {
    export function isInstanceOf(obj: any): boolean {
        return obj && obj.kind && obj.kind === 'Places';
    }
}