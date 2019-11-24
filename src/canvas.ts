
export class Canvas {
    // never changing
    public element: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;

    // once discovered, never changing
    public isLittleEndian: boolean;

    // changes every frame
    public imageData: ImageData = null;
    public buf: ArrayBuffer = null;
    public buf8: Uint8ClampedArray = null;
    public data: Uint32Array = null;

    public timer: number = null;

    constructor(element: HTMLCanvasElement) {
        this.element = element;
        this.context = element.getContext('2d');

        // initialize buffers and such
        this.resize(this.width, this.height);

        // little endian test for buffer data
        this.isLittleEndian = !this.isBigEndian();

        // force redraw
        this.draw();
    }

    public get height(): number {
        return this.element.height;
    }

    public get width(): number {
        return this.element.width;
    }

    public walk(callback: (x: number, y: number) => number) {
        for (let y = 0; y < this.height; ++y) {
            for (let x = 0; x < this.width; ++x) {
                this.setColor(x, y, callback(x, y));
            }
        }
    }

    public draw() {
        this.imageData.data.set(this.buf8);
        this.context.putImageData(this.imageData, 0, 0);
    }

    public clear(color: number = 0) {
        this.walk((x, y) => {
            return color;
        });
    }

    public clone(x: number, y: number, r: number, d: number) {
        // key for our destination
        let destKey = (y + d) * this.width + (x + r);
        let srcKey = y * this.width + x;

        // do swap
        this.data[destKey] = this.data[srcKey];
    }

    public swap(x: number, y: number, r: number, d: number) {
        // bounds checking
        if (r > 1 || r < -1) {
            throw 'Out of bounds rightward movement';
        }

        if (d < -1 || d > 1) {
            throw 'Out of bounds downward movement';
        }

        // key for our destination
        let destKey = (y + d) * this.width + (x + r);
        let srcKey = y * this.width + x;

        // do swap
        let dest = this.data[destKey];
        this.data[destKey] = this.data[srcKey];
        this.data[srcKey] = dest;
    };

    public setColor(x: number, y: number, color: number) {
        //console.log('setting ', x, y, color);
    
        if (this.isLittleEndian) {
            this.data[y * this.width + x] =
                (255   << 24) |    // alpha
                (color << 16) |    // blue
                (color <<  8) |    // green
                color;            // red
        }
        else {
            this.data[y * this.width + x] =
                (color << 24) |    // red
                (color << 16) |    // green
                (color <<  8) |    // blue
                255;              // alpha
        }
    }

    public resize(width: number, height: number) {
        if (this.imageData != null
                && this.width == width
                && this.height == height) {
            // no change
            return;
        }

        this.element.width = width;
        this.element.height = height;
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.buf = new ArrayBuffer(this.imageData.data.length);
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.data = new Uint32Array(this.buf);
        this.clear();
    }
    
    private isBigEndian() {
        // Determine whether Uint32 is little- or big-endian.
        this.data[1] = 0x0a0b0c0d;
        let buf: any = this.buf;

        if (buf[4] === 0x0a
                && buf[5] === 0x0b
                && buf[6] === 0x0c
                && buf[7] === 0x0d) {
            return true;
        }
        
        return false;
    }
}