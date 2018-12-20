<template>
    <div>
        <ul>
            <li v-for="item in items">
                {{item.name}}
            </li>
        </ul>
        <button @click="search()">Search</button>
    </div>
</template>

<script lang="ts">
    import Vue                         from 'vue'
    import { Component }               from 'vue-property-decorator';
    import { createNamespacedHelpers } from 'vuex';
    import { name }                    from '@/app/characters/store';

    const {mapState, mapActions} = createNamespacedHelpers(name);

    @Component<CharacterList>({
        name: 'CharacterList',
        components: {},
        computed: mapState({
            items: 'items',
        }),
        methods: mapActions({
            search: 'search',
        }),
    })
    export default class CharacterList extends Vue {}
</script>

<style lang="scss" scoped>

</style>