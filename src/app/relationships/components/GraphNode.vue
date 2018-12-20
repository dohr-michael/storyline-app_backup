<template>
    <g :transform="`translate(${point.x} ${point.y})`">
        <circle r="10" cx="0" cy="0" :fill="color" stroke="black"></circle>
    </g>
</template>

<script lang="ts">
    import Vue                 from 'vue'
    import { Component, Prop } from 'vue-property-decorator';
    import { Node }            from '@/app/core';

    @Component<GraphNode>({
        name: 'GraphNode',
        components: {}
    })
    export default class GraphNode extends Vue {
        @Prop({required: true})
        point!: { x: number, y: number };
        @Prop({required: true})
        node!: Node;

        get color(): string {
            switch (this.node.kind) {
                case 'Characters':
                    return 'blue';
                case 'Places':
                    return 'red';
                case 'Organizations':
                    return 'yellow';
                default:
                    return 'pink';
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>