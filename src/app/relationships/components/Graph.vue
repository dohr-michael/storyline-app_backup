<template>
    <svg :width="viewportWidth" :height="viewportHeight">
        <g ref="graph-content">
            <g>
                <GraphLink v-for="link in linkDatums"
                           v-if="!!link.source && !!link.target"
                           :point1="getPoint(link.source)"
                           :point2="getPoint(link.target)"
                />
            </g>
            <g>
                <GraphNode v-for="node in nodeDatums"
                           :point="getPoint(node)"
                           :node="node"
                           class="graph-node"
                />
            </g>
        </g>
        <!--rect ref="zoom" class="zoom" :width="viewportWidth" :height="viewportHeight"></rect-->
    </svg>
</template>

<script lang="ts">
    import Vue                 from 'vue'
    import { Component, Prop } from 'vue-property-decorator';
    import * as d3             from 'd3';
    import { Node }            from '@/app/core';
    import GraphLink           from './GraphLink.vue';
    import GraphNode           from './GraphNode.vue';
    import { Relation }        from '../models';

    type NodeDatum = d3.SimulationNodeDatum & Node;
    type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & Relation;

    function nodeToId(node: Node): string {
        return node.id + '-' + node.kind;
    }

    @Component<Graph>({
        name: 'Graph',
        components: {
            GraphNode,
            GraphLink,
        }
    })
    export default class Graph extends Vue {
        @Prop({default: 1024})
        viewportWidth!: number;
        @Prop({default: 400})
        viewportHeight!: number;
        @Prop({required: true})
        nodes!: Node[];
        @Prop({required: true})
        edges!: Relation[];

        nodeDatums: NodeDatum[] = [];
        nodeDatumById: { [id: string]: NodeDatum } = {};
        linkDatums: LinkDatum[] = [];

        simulation?: d3.Simulation<NodeDatum, LinkDatum>;
        view?: d3.Selection;
        zoom?: d3.Selection;

        getPoint(node: string | number | NodeDatum): { x: number, y: number } {
            if (typeof node === 'string') {

            } else if (typeof node === 'number') {

            } else {
                return {
                    x: node.x,
                    y: node.y,
                }
            }
            return {
                x: 0,
                y: 0,
            }
        }


        onTick() {
            if (this.simulation) {
                this.nodeDatums = [...this.simulation.nodes()];
            }
        }

        onDrag(target: NodeDatum) {
            //console.log('onDrag', target);
            //console.log(d3.event.subject);
            this.nodeDatums = [...this.simulation.nodes()];
        }

        onZoom() {
            if (this.view) {
                this.view.attr('transform', d3.event.transform);
            }
        }

        // lifecycle.
        mounted() {
            // Data
            this.nodeDatums = this.nodes.map(i => ({...i}));
            this.nodeDatumById = this.nodeDatums.reduce((acc, c) => ({...acc, [nodeToId(c)]: c}), {});
            this.linkDatums = this.edges.map(i => ({
                    ...i,
                    source: nodeToId(i.from),
                    target: nodeToId(i.to),
                })
            );

            // D3
            this.view = d3.select(this.$refs['graph-content'] as Element);
            const zoomSelect = d3.select(this.$refs['zoom'] as Element);
            const nodeSelect = this.view.selectAll('.graph-node');

            const drag = d3.drag().on('drag', this.onDrag);
            const zoom = d3.zoom().on('zoom', this.onZoom);


            this.simulation = d3.forceSimulation(this.nodeDatums)
                .force('link', d3.forceLink<NodeDatum, any>(this.linkDatums).id(nodeToId))
                .force('charge', d3.forceManyBody<NodeDatum>().strength(-2))
                .force('collide', d3.forceCollide<NodeDatum>(20))
                //.force('radial', d3.forceRadial<NodeDatum>(this.viewportHeight / 4))
                .force('center', d3.forceCenter<NodeDatum>(this.viewportWidth / 2, this.viewportHeight / 2))
                .on('tick', this.onTick)
                .on('end', () => {
                    // console.log(this.view.selectAll('.graph-node'));
                    this.view.selectAll('.graph-node').call(drag);
                });

            // Assign behaviors to view.
            // zoomSelect.call(zoom);

        }

        destroyed() {
            console.log('Graph -> destroyed');
            if (this.simulation) {
                this.simulation.stop();
                this.simulation = undefined;
            }
        }

    }
</script>

<style lang="scss" scoped>
    svg {
        border: solid 1px;
    }

    .zoom {
        cursor: move;
        fill: none;
        pointer-events: all;
    }
</style>