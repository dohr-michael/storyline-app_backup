import Vue                from 'vue'
import Vuex               from 'vuex'
import * as relationships from '@/app/relationships/store';
import * as characters    from '@/app/characters/store';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        [characters.name]: {
            namespaced: true,
            ...characters.store,
        },
        [relationships.name]: {
            namespaced: true,
            ...relationships.store,
        }
    }
})
