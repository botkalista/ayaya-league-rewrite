
import p5 from "p5";


class Drawer {
    public sketch?: p5;
    private p?: p5;
    constructor() { }
    createCanvas(setup: (p: p5) => any) {
        const me = this;
        this.sketch = new p5(sketchFunction);
        function sketchFunction(p: p5) {
            me.p = p;
            p.setup = () => setup(p);
            p.draw = () => { p.noLoop(); }
        }
    }

    onTickStart() {
        this.p?.clear(0, 0, 0, 0);
    }

    drawText(text: number, x: number, y: number, size: number = 16) {
        this.p?.fill(0);
        this.p?.noStroke();
        this.p?.textSize(size);
        this.p?.text(text, x, y);
    }

    drawCircle(x: number, y: number, r: number, color: number = 0x000000, fillColor?: number) {
        if (fillColor) { this.p?.fill(fillColor); } else { this.p?.noFill(); }
        this.p?.stroke(color);
        this.p?.circle(x, y, r);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: number = 0x000000) {
        this.p?.noFill();
        this.p?.stroke(color);
        this.p?.line(x1, y1, x2, y2);
    }

}


const instanceDrawer = new Drawer();
export default instanceDrawer;


