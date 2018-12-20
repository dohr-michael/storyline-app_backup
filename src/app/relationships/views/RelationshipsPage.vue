<template>
    <div>
        <GraphComponent v-if="loaded"
                        :nodes="nodes"
                        :edges="edges"
        />
    </div>
</template>

<script lang="ts">
    import Vue                         from 'vue'
    import { Component }               from 'vue-property-decorator';
    import { createNamespacedHelpers } from 'vuex';
    import { Node }                    from '@/app/core';
    import GraphComponent              from '../components/Graph.vue';
    import { Relation }                from '../models';
    import { name }                    from '../store';

    const {mapState, mapActions} = createNamespacedHelpers(name);

    @Component<RelationshipsPage>({
        name: 'RelationshipsPage',
        components: {
            GraphComponent
        },
        computed: {
            ...mapState({
                nodes: 'nodes',
                edges: 'edges',
                loaded: 'loaded',
            }),
        },
    })
    export default class RelationshipsPage extends Vue {
        loaded!: boolean;
        nodes!: Node[];
        edges!: Relation[];

        mounted() {
            this.$store.dispatch(`${name}/load`);
        }
    }
</script>

<style lang="scss" scoped>

</style>