import Vue               from 'vue';
import Router            from 'vue-router';
import RelationshipsPage from '@/app/relationships/views/RelationshipsPage.vue';

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'relationships',
            component: RelationshipsPage
        },
        {
            path: '/characters',
            name: 'characters',
            component: () => import(/* webpackChunkName: "characters" */'@/app/characters/views/CharacterList.vue'),
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
