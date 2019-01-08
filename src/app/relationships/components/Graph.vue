<template>
    <svg ref="svg" :width="viewportWidth" :height="viewportHeight">
        <rect ref="zoom" class="zoom" x="0" y="0" :width="viewportWidth" :height="viewportHeight"></rect>
        <g ref="graph-content">
            <g>
                <GraphLink v-for="link in linkDatums"
                           v-if="!!link.source && !!link.target"
                           :point1="getPoint(link.source)"
                           :point2="getPoint(link.target)"
                           :nodeRadius="nodeRadius"
                           :edges="link.relations"
                           :biDirectional="link.biDirectional"
                />
            </g>
            <g>
                <GraphNode v-for="node in nodeDatums"
                           :point="getPoint(node)"
                           :node="node"
                           :nodeRadius="nodeRadius"
                />
            </g>
        </g>
    </svg>
</template>

<script lang="ts">
    import Vue                        from 'vue'
    import { Component, Prop, Watch } from 'vue-property-decorator';
    import * as d3                    from 'd3';
    import { Node }                   from '@/app/core';
    import GraphLink                  from './GraphLink.vue';
    import GraphNode                  from './GraphNode.vue';
    import { Relation }               from '../models';

    type NodeDatum = d3.SimulationNodeDatum & Node;
    type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & {
        relations: Relation[],
        biDirectional: boolean,
    };

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
        @Prop({default: 40})
        nodeRadius!: number;

        nodeDatums: NodeDatum[] = [];
        linkDatums: LinkDatum[] = [];

        simulation?: d3.Simulation<NodeDatum, LinkDatum>;

        contentSelection?: d3.Selection;


        getPoint(node: string | number | NodeDatum): { x: number, y: number } {
            if (typeof node === 'object') {
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

        onZoom() {
            console.log(d3.event.transform);
            if (this.contentSelection) {
                this.contentSelection.attr('transform', d3.event.transform);
            }
        }

        dragSubject(): NodeDatum {
            return this.simulation.find(d3.event.x, d3.event.y, this.nodeRadius);
        }

        dragStarted() {
            if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        }

        dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }

        dragEnded() {
            if (!d3.event.active) this.simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }

        updateData(nodes: Node[], edges: Relation[]) {
            this.nodeDatums = nodes.map(n => ({...n}));
            const {items: linkDatums} = edges.reduce((acc, c) => {
                const ref = c.from.nodeId + '_' + c.to.nodeId;
                const invRef = c.to.nodeId + '_' + c.from.nodeId;
                if (!acc.ref[ref]) {
                    const dat = {
                        source: c.from.nodeId,
                        target: c.to.nodeId,
                        relations: [c],
                        biDirectional: false,
                    };
                    acc.ref[ref] = dat;
                    acc.items.push(dat);
                } else {
                    acc.ref[ref].relations.push(c);
                }
                if (acc.ref[invRef]) {
                    acc.ref[ref].biDirectional = true;
                    acc.ref[invRef].biDirectional = true;
                }
                return acc;
            }, {ref: {}, items: []} as { ref: { [key: string]: LinkDatum }, items: LinkDatum[] });
            this.linkDatums = linkDatums;

            if (this.simulation) {
                this.simulation.stop();
            }

            this.simulation = d3
                .forceSimulation(this.nodeDatums)
                .force('link', d3.forceLink<NodeDatum, any>(this.linkDatums)
                    .id(n => n.nodeId)
                    .distance(this.nodeRadius * 5)
                    .strength(1)
                )
                .force('charge', d3.forceManyBody<NodeDatum>().strength(-1))
                .force('collide', d3.forceCollide<NodeDatum>(this.nodeRadius + 10))
                //.force('x', d3.forceX<NodeDatum>(this.viewportWidth / 2).strength(1))
                //.force('y', d3.forceY<NodeDatum>(this.viewportHeight / 2).strength(1))
                //.force('gravity', d3.forceY<NodeDatum>().strength(-1).y(this.viewportHeight))
                .force('center', d3.forceCenter<NodeDatum>(this.viewportWidth / 2, this.viewportHeight / 2))
                .on('tick', this.onTick);
        }

        // lifecycle.
        @Watch('nodes')
        nodesChange(items: Node[]) {
            this.updateData(items, this.edges);
        }

        @Watch('edges')
        edgesChange(items: Relation[]) {
            this.updateData(this.nodes, items);
        }

        mounted() {
            this.contentSelection = d3.select(this.$refs['graph-content'] as Element);
            const zoom = d3.zoom()
                .scaleExtent([.1, 4])
                .on('zoom', this.onZoom);

            const drag = d3.drag()
                .container(this.$refs['graph-content'] as HTMLElement)
                .subject(this.dragSubject)
                .on('start', this.dragStarted)
                .on('drag', this.dragged)
                .on('end', this.dragEnded);

            this.updateData(this.nodes, this.edges);

            // Assign behaviors to view.
            this.contentSelection.call(drag);
            d3.select(this.$refs['zoom'] as Element).call(zoom)
            // this.view.call(zoom);
        }

        destroyed() {
            console.log('Graph -> destroyed');
            if (this.simulation) {
                this.simulation.stop();
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