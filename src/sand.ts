import { Canvas } from "./canvas";
import { Particle } from "./particle";
import * as Color from "color";

export class Sand {
    public canvas: Canvas;
    public timer: number;

    public particles: Particle[] = [];
    public events: [];

    constructor(canvas: Canvas) {
        this.canvas = canvas;
    }

    public createPosition(x: number, y: number, color: Color): Particle {
        return this.create(new Particle(x, y, color));
    }

    public create(particle: Particle): Particle {
        if (this.exists(particle.x, particle.y)) {
            return null;
        }

        //console.log('Creating', particle);
        this.particles.push(particle);
        return particle;
    }

    public exists(x: number, y: number) {
        return this.get(x, y) != null;
    }

    public clone(x: number, y: number, r: number, d: number) {
        let particle = this.get(x, y);
        this.canvas.clone(particle.x, particle.y, r, d);
        this.create(particle.clone(x + r, y + d));
    }

    public get(x: number, y: number): Particle {
        for (let particle of this.particles) {
            if (particle.x == x && particle.y == y) {
                return particle;
            }
        }

        return null;
    }

    public walk(callback: (particle: Particle) => void) {
        this.particles.forEach(callback);
    }

    public start(targetFPS: number) {
        this.timer = setInterval(() => { this.draw() }, 1000 / targetFPS);
    }

    public pause() {
        clearInterval(this.timer);
    }

    public draw() {
        //this.canvas.clear();

        this.particles.forEach((particle, index, array) => {
            if (particle.inactiveCycle == 15) {
                return;
            }

            let dX = 0;
            let dY = 0;
            let op = null;
            let cloneColor: Color = null;

            // apply particle transformations
            if (particle.exists) {
                switch (particle.color) {
                    case Particle.SNOW_SPAWN_COLOR:
                        op = 'clone';
                        cloneColor = Particle.SNOW_COLOR;
                        dY++;
                        break;
                    case Particle.SAND_COLOR:
                    case Particle.SNOW_COLOR:
                        op = 'swap';
                        dY++;
                        break;
                }
            }
            else {
                op = 'setColor';
            }
            
            let nX = particle.x + dX;
            let nY = particle.y + dY;

            // overflow check
            if (nY > this.canvas.height) {
                return;
            }

            if (nX > this.canvas.width || nX < 0) {
                this.particles.splice(index, 1);
            }

            // check if particle exists at destination, if it does, do not apply
            if (op != 'setColor' && this.exists(nX, nY)) {
                dX = 0;
                dY = 0;
                nX = particle.x;
                nY = particle.y;
                op = null;
            }

            //console.log(op, nX, nY, this.exists(nX, nY), dX, dY, particle.exists && dX + dY != 0);

            if (op != 'setColor' && dX + dY != 0) {
                switch (op) {
                    case 'swap':
                        particle.x = nX;
                        particle.y = nY;
                        this.canvas.swap(particle.x, particle.y, dX, -dY);
                        break;
                    case 'clone':
                        this.createPosition(nX, nY, cloneColor);
                        //this.clone(particle.x, particle.y, dX, -dY);
                        break;
                }
                particle.inactiveCycle = 0;
            }
            else {
                this.canvas.setColor(particle.x, particle.y, particle.rgbNumber);
                particle.exists = true;
                particle.inactiveCycle++;
            }
        });

        this.canvas.draw();
    }
}