import { Module }    from 'vuex';
import { Character } from '@/app/characters/models';
import { api }       from '@/app/characters/api'

export interface State {
    items: Character[];
}

const defaultInitialState: State = {
    items: [],
};

export const name: string = 'characters';

export const store: Module<State, any> = {
    state: defaultInitialState,
    getters: {
        items(state): Character[] {
            return state.items;
        }
    },
    mutations: {
        searched(state, items: Character[]) {
            state.items = items;
        }
    },
    actions: {
        search({commit}, query?: string) {
            api.findMany(query || null).subscribe(next => {
                commit('searched', next.items);
            });
        }
    },
};

