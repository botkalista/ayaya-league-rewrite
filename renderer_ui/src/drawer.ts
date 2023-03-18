
import p5 from "p5";


class Drawer {
    public sketch?: p5;
    private p?: p5;

    constructor() { }
    createCanvas(setup: (p: p5) => any, draw: (p: p5) => any) {
        this.sketch = new p5(sketchFunction);
        this.p = this.sketch;
        function sketchFunction(p: p5) {
            p.setup = () => setup(p);
            p.draw = () => draw(p);
        }
    }


    clear() {
        this.p?.clear(0, 0, 0, 0);
    }

    drawText(text: string, x: number, y: number, size: number = 16) {
        this.p?.fill(0);
        this.p?.noStroke();
        this.p?.textSize(size);
        this.p?.text(text, x, y);
    }

    drawCircle(x: number, y: number, r: number, color: number, weight: number, fillColor?: number) {
        if (fillColor) { this.p?.fill(fillColor); } else { this.p?.noFill(); }
        this.p?.strokeWeight(weight);
        this.p?.stroke(color);
        this.p?.circle(x, y, r);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: number, weight: number) {
        this.p?.noFill();
        this.p?.strokeWeight(weight);
        this.p?.stroke(color);
        this.p?.line(x1, y1, x2, y2);
    }

    drawCircle3d(points: [{ x: number, y: number }, { x: number, y: number }][], color: number, weight: number) {
        this.p?.noFill();
        this.p?.stroke(color);
        this.p?.strokeWeight(weight);
        for (let i = 0; i < points.length; i++) {
            this.p?.line(points[i][0].x, points[i][0].y, points[i][1].x, points[i][1].y);
        }
    }

}


const instanceDrawer = new Drawer();
export default instanceDrawer;


