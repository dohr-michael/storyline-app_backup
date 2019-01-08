import { Relation } from '../models';


export default function (
    ctx: CanvasRenderingContext2D,
    p1: { x: number, y: number },
    p2: { x: number, y: number },
    relation: Relation
) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}