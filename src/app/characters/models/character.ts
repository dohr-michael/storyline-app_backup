import { Node } from '@/app/core';

export interface Character extends Node {
    name: string;
}

export namespace Character {
    export function isInstanceOf(obj: any): boolean {
        return obj && obj.kind && obj.kind === 'Characters';
    }
}