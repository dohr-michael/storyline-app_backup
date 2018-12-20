<template>
    <line :x1="point1.x" :y1="point1.y" :x2="point2.x" :y2="point2.y" stroke="blue" stroke-width="2px"></line>
</template>

<script lang="ts">
    import Vue                 from 'vue'
    import { Component, Prop } from 'vue-property-decorator';

    @Component<GraphLink>({
        name: 'GraphLink',
        components: {}
    })
    export default class GraphLink extends Vue {
        @Prop({required: true})
        point1: { x: number, y: number };
        @Prop({required: true})
        point2: { x: number, y: number };

    }
</script>

<style lang="scss" scoped>

</style>