import { Observable, of }  from 'rxjs';
import { delay }           from 'rxjs/operators';
import { Node }            from '@/app/core';
import { Character }       from '@/app/characters';
import { Place }           from '@/app/places';
import { Organization }    from '@/app/organizations';
import { Graph, Relation } from '../models';

let id = 0;

function n<T extends Node = Node>(name: string, kind: string): T {
    const i = '' + (++id);
    return Object.assign({
        id: i,
        kind,
        nodeId: kind + '/' + i,
    } as T, {name});
}

function c(name: string): Character {
    return n<Character>(name, 'Characters');
}

function p(name: string): Place {
    return n<Place>(name, 'Places');
}

function o(name: string): Organization {
    return n<Organization>(name, 'Organizations');
}

function r(from: Node, to: Node, labels: string[] = []): Relation {
    return {from, to, labels};
}

const luke = c('Luke Skywalker');
const darth = c('Darth Vader');
const yoda = c('Yoda');
const obi = c('Obiwan Kenobi');
const tatooin = p('Tatooin');
const death = p('Death Start');
const jedi = o('Jedi');
const sith = o('Sith');

let nodes = [
    luke,
    darth,
    yoda,
    obi,
    tatooin,
    death,
    jedi,
    sith,
];
let edges = [
    r(darth, luke, ['is_father_of']),
    r(yoda, luke, ['is_master_of']),
    r(obi, luke, ['is_master_of']),
    r(obi, darth, ['was_master_of']),
    r(darth, obi, ['is_rival_of']),
    r(darth, tatooin, ['was_born_on']),
    r(darth, luke, ['was_born_on']),
    r(luke, death, ['has_destroy']),
    r(darth, death, ['is_captain_of']),
    r(darth, jedi, ['was']),
    r(darth, sith, ['is']),
    r(yoda, jedi, ['is']),
    r(obi, jedi, ['is']),
    r(luke, jedi, ['is']),
];


export const api = {
    findGraph(): Observable<Graph> {
        return of({nodes, edges}).pipe(delay(1000));
    },
    addNode(node: { name: string, kind: string }): Observable<Node> {
        return of(n(node.name, node.kind));
    },
    addRelation(relation: Relation): Observable<void> {
        return of();
    },
    removeRelation(relation: Relation): Observable<void> {
        return of();
    }
};
