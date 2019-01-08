<template>
    <g>
        <line v-if="!biDirectional"
              :x1="p1.x"
              :y1="p1.y"
              :x2="p2.x"
              :y2="p2.y"
              class="link">
        </line>
        <path v-if="biDirectional"
              :d="linePath()"
              class="link">
        </path>
        <path d="M-10,-5L0,0L-10,5"
              class="arrow"
              :transform="arrowTransform()">
        </path>
    </g>
</template>

<script lang="ts">
    import Vue                        from 'vue'
    import { Component, Prop, Watch } from 'vue-property-decorator';
    import * as mathjs                from 'mathjs';
    import { Relation }               from '@/app/relationships';
    import { math }                   from '@/tools';

    @Component<GraphLink>({
        name: 'GraphLink',
        components: {}
    })
    export default class GraphLink extends Vue {
        @Prop({required: true})
        point1!: math.Point;
        @Prop({required: true})
        point2!: math.Point;
        @Prop({required: true})
        edges!: Relation[];
        @Prop({required: true})
        nodeRadius!: number;
        @Prop({required: true})
        biDirectional!: boolean;

        p1: math.Point = {x: 0, y: 0};
        p2: math.Point = {x: 0, y: 0};

        @Watch('point1.x')
        @Watch('point1.y')
        @Watch('point2.x')
        @Watch('point2.y')
        @Watch('nodeRadius')
        updatePositions() {
            const c1: math.Circle = {
                center: this.point1,
                radius: this.nodeRadius,
            };
            const c2: math.Circle = {
                center: this.point2,
                radius: this.nodeRadius,
            };
            this.p1 = math.intercetionFromCenterToPoint(c1, this.point2);
            this.p2 = math.intercetionFromCenterToPoint(c2, this.point1);
        }

        linePath() {
            const dx = this.p2.x - this.p1.x,
                dy = this.p2.y - this.p1.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return 'M' + this.p1.x + ',' + this.p1.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + this.p2.x + ',' + this.p2.y;
        }

        arrowTransform() {
            const alpha = math.getAlpha(this.p1, this.p2) + (this.biDirectional ? Math.PI / 10 : 0);
            const matrix = mathjs.multiply(
                math.Transformation.translation(this.p2.x, this.p2.y),
                math.Transformation.rotation(alpha),
            );
            return `matrix(${math.Transformation.stringify(matrix as mathjs.Matrix)})`;
        }
    }
</script>

<style lang="scss" scoped>
    .link {
        stroke: blue;
        stroke-width: 1px;
        fill: none;
    }

    .arrow {
        fill: blue;
    }
</style>