import { Node } from '@/app/core';

export interface Organization extends Node {
    name: string;
}

export namespace Organization {
    export function isInstanceOf(obj: any): boolean {
        return obj && obj.kind && obj.kind === 'Organizations';
    }
}
