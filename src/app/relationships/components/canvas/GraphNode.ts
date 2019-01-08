import { Node } from '@/app/core';


const _2PI = Math.PI * 2;

function color(node: Node): string {
    switch (node.kind) {
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

export default function (ctx: CanvasRenderingContext2D, point: { x: number, y: number }, node: Node) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 10, 0, _2PI);
    ctx.fillStyle = color(node);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();
}

