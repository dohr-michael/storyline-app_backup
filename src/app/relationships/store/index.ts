import { Module }          from 'vuex';
import { Node }            from '@/app/core';
import { Relation, Graph } from '../models';
import { api }             from '../api';

export interface State {
    loaded: boolean;
    nodes: Node[];
    edges: Relation[];
}

const defaultInitialState: State = {
    loaded: false,
    nodes: [],
    edges: [],
};

export const name: string = 'relationships';

export const store: Module<State, any> = {
    state: defaultInitialState,
    mutations: {
        nodeCreated(state, payload: Node) {
            state.nodes = [...state.nodes, payload];
        },
        loaded(state, payload: Graph) {
            state.edges = payload.edges;
            state.nodes = payload.nodes;
            state.loaded = true;
        }
    },
    actions: {
        load({commit}) {
            api.findGraph().subscribe(graph => {
                commit('loaded', graph);
            })
        },
        createNode({commit}, payload: { name: string, kind: string }) {
            api.addNode(payload).subscribe(node => {
                commit('nodeCreated', node);
            })
        },
    }
};
