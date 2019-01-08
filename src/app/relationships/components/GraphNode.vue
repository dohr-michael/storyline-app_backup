<template>
    <g :transform="`translate(${point.x} ${point.y})`">
        <circle cx="0"
                cy="0"
                :r="nodeRadius"
                :class="`${node.kind} node`">
        </circle>
        <foreignObject :transform="`translate(${-nodeRadius} ${-nodeRadius})`">
            <div :class="`${node.kind} label`" :style="{width: `${nodeRadius*2}px`, height: `${nodeRadius*2}px`}">
                <span class="text">{{node.name}}</span>
            </div>
        </foreignObject>
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
        @Prop({required: true})
        nodeRadius!: number;
    }
</script>

<style lang="scss" scoped>
    .node {
        fill: pink;
        stroke: deeppink;

        &.Characters {
            fill: blue;
            stroke: darkblue;
        }

        &.Places {
            fill: red;
            stroke: darkred;
        }

        &.Organizations {
            fill: orange;
            stroke: darkorange;
        }
    }

    .label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: darkblue;
        &.Characters {
            color: white;
        }

        &.Places {
            color: white;
        }

        &.Organizations {
            color: white;
        }

        .text {
            overflow: hidden;
            // width: 100%;
            font-size: .8em;
            text-align: center;
            text-overflow: ellipsis;
        }
    }
</style>