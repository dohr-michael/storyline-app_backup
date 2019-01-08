import * as mathjs from 'mathjs';

export namespace Transformation {
    export function translation(x: number, y: number): mathjs.Matrix {
        return mathjs.matrix([[1, 0, x], [0, 1, y], [0, 0, 1]]);
    }

    export function scale(x: number, y: number): mathjs.Matrix {
        return mathjs.matrix([[x, 0, 0], [0, y, 0], [0, 0, 1]]);
    }

    export function rotation(alpha: number): mathjs.Matrix {
        const cos = mathjs.cos(alpha);
        const sin = mathjs.sin(alpha);
        return mathjs.matrix([[cos, -sin, 0], [sin, cos, 0], [0, 0, 1]])
    }

    export function stringify(m: mathjs.Matrix) {
        return `${m.get([0, 0])} ${m.get([1, 0])} ${m.get([0, 1])} ${m.get([1, 1])} ${m.get([0, 2])} ${m.get([1, 2])}`;
    }
}

export interface Point {
    x: number;
    y: number;
}

/**
 * Line equation: y = ax + b
 */
export interface Line {
    a: number;
    b: number;
}

/**
 * Circle equation: R2 = (x-x0)2 + (y-y0)2
 */
export interface Circle {
    center: Point;
    radius: number;
}

export function toLine(p1: Point, p2: Point): Line {
    const a = p1.x === p2.x ? 0 : (p2.y - p1.y) / (p2.x - p1.x);
    const b = p1.y - a * p1.x;
    return {a, b};
}

export function getAlpha(pts1: Point, pts2: Point): number {
    const dx = pts2.x - pts1.x;
    const dy = pts2.y - pts1.y;
    let alpha = 0;
    if (dx > 0 && dy >= 0) {
        alpha = Math.atan(dy / dx);
    } else if (dx > 0 && dy < 0) {
        alpha = Math.atan(dy / dx) + 2 * Math.PI;
    } else if (dx < 0) {
        alpha = Math.atan(dy / dx) + Math.PI;
    } else if (dx === 0 && dy > 0) {
        alpha = Math.PI / 2;
    } else if (dx === 0 && dy < 0) {
        alpha = 3 * Math.PI / 2;
    }
    return alpha;
}

export function intercetionFromCenterToPoint(circle: Circle, pts: Point): Point {
    const alpha = getAlpha(circle.center, pts);
    return {
        x: circle.center.x + circle.radius * Math.cos(alpha),
        y: circle.center.y + circle.radius * Math.sin(alpha),
    }
}
