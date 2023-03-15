
import p5 from "p5";


class Drawer {
    public sketch?: p5;
    private p?: p5;

    private buffer: (() => void)[] = [];

    constructor() { }
    createCanvas(setup: (p: p5) => any) {
        const me = this;
        this.sketch = new p5(sketchFunction);
        function sketchFunction(p: p5) {
            me.p = p;
            p.setup = () => setup(p);
            p.draw = () => { me.p?.noLoop(); }
        }
    }

    onDrawThings() {
        this.p?.clear(0, 0, 0, 0);
        for (const e of this.buffer) { e(); }
        this.buffer.length = 0;
    }

    drawText(text: number, x: number, y: number, size: number = 16) {
        this.buffer.push(() => {
            this.p?.fill(0);
            this.p?.noStroke();
            this.p?.textSize(size);
            this.p?.text(text, x, y);
        });
    }

    drawCircle(x: number, y: number, r: number, weight: number, color: number, fillColor?: number) {
        this.buffer.push(() => {
            if (fillColor) { this.p?.fill(fillColor); } else { this.p?.noFill(); }
            this.p?.strokeWeight(weight);
            this.p?.stroke(color);
            this.p?.circle(x, y, r);
        });
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, weight: number, color: number) {
        this.buffer.push(() => {
            this.p?.noFill();
            this.p?.strokeWeight(weight);
            this.p?.stroke(color);
            this.p?.line(x1, y1, x2, y2);
        });
    }

    drawCircle3d(points: [{ x: number, y: number }, { x: number, y: number }][], color: number, weight: number) {
        this.buffer.push(() => {
            this.p?.noFill();
            this.p?.stroke(color);
            this.p?.strokeWeight(weight);
            for (let i = 0; i < points.length; i++) {
                this.p?.line(points[i][0].x, points[i][0].y, points[i][1].x, points[i][1].y);
            }
        });
    }

}


const instanceDrawer = new Drawer();
export default instanceDrawer;


