<template>
    <canvas ref="canvas" :width="viewportWidth" :height="viewportHeight"></canvas>
</template>

<script lang="ts">
    import Vue                 from 'vue'
    import { Component, Prop } from 'vue-property-decorator';
    import * as d3             from 'd3';
    import { Node }            from '@/app/core';
    import GraphNode           from './GraphNode';
    import GraphLink           from './GraphLink';
    import { Relation }        from '../models';

    type NodeDatum = d3.SimulationNodeDatum & Node;
    type LinkDatum = d3.SimulationLinkDatum<NodeDatum> & Relation;

    function nodeToId(node: Node): string {
        return node.id + '-' + node.kind;
    }

    function toPoint(node: string | number | NodeDatum): { x: number, y: number } {
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

    @Component<Graph>({
        name: 'Graph',
        components: {}
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
        linkDatums: LinkDatum[] = [];

        canvasContext!: CanvasRenderingContext2D;
        simulation!: d3.Simulation<NodeDatum, LinkDatum>;

        clean() {
            this.canvasContext.clearRect(0, 0, this.viewportWidth, this.viewportHeight);
        }

        draw() {
            this.clean();
            this.linkDatums.forEach(link => {
                GraphLink(this.canvasContext, toPoint(link.source), toPoint(link.target), link);
            });
            this.nodeDatums.forEach(node => {
                GraphNode(this.canvasContext, {x: node.x, y: node.y}, node)
            });
        }

        onDrag() {
            //console.log('onDrag', target);
            //console.log(d3.event.subject);
        }

        onZoom() {
            if (this.canvasContext) {
                const transform = d3.event.transform;
                this.canvasContext.save();
                this.canvasContext.clearRect(0, 0, this.viewportWidth, this.viewportHeight);
                this.canvasContext.translate(transform.x, transform.y);
                this.canvasContext.scale(transform.k, transform.k);
                this.draw();
                this.canvasContext.restore();
            }
        }

        dragSubject(): NodeDatum {
            return this.simulation.find(d3.event.x, d3.event.y, 10);
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

        // lifecycle.
        mounted() {
            const canvas = this.$refs.canvas as HTMLCanvasElement;
            this.canvasContext = canvas.getContext('2d');
            this.canvasContext.imageSmoothingEnabled = true;
            this.canvasContext.imageSmoothingQuality = 'high';

            // Data
            this.nodeDatums = this.nodes.map(n => ({...n} as NodeDatum));
            this.linkDatums = this.edges.map(n => ({
                ...n,
                source: nodeToId(n.from),
                target: nodeToId(n.to)
            } as LinkDatum));

            // D3

            const canvasSelect = d3.select(canvas);
            const drag = d3.drag()
                .container(canvas)
                .subject(this.dragSubject)
                .on('start', this.dragStarted)
                .on('drag', this.dragged)
                .on('end', this.dragEnded);
            const zoom = d3.zoom().on('zoom', this.onZoom);


            this.simulation = d3.forceSimulation(this.nodeDatums)
                .force('link', d3.forceLink<NodeDatum, any>(this.linkDatums).id(nodeToId))
                .force('charge', d3.forceManyBody<NodeDatum>().strength(-2))
                .force('collide', d3.forceCollide<NodeDatum>(20))
                //.force('radial', d3.forceRadial<NodeDatum>(this.viewportHeight / 4))
                .force('center', d3.forceCenter<NodeDatum>(this.viewportWidth / 2, this.viewportHeight / 2))
                .on('tick', this.draw);

            // Assign behaviors to view.
            canvasSelect.call(drag);
            // canvasSelect.call(zoom);

        }

        destroyed() {
            console.log('Graph -> destroyed');
            this.clean();
            if (this.simulation) {
                this.simulation.stop();
            }
        }

    }
</script>

<style lang="scss" scoped>
    svg, canvas {
        border: solid 1px;
    }

    .zoom {
        cursor: move;
        fill: none;
        pointer-events: all;
    }
</style>