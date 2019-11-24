import * as Color from 'color';

export class Particle {
    // cached rgbnumber
    public rgbNumber: number;
    public color: Color;

    // TODO move to Point class
    public x: number;
    public y: number;
    
    // TODO ew
    public exists: boolean = false;
    public inactiveCycle: number = 0;

    constructor(x: number, y: number, color: Color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.rgbNumber = color.rgbNumber();
    }

    public get isSnow() {
        return this.color == Particle.SNOW_COLOR;
    }

    public get isSand() {
        return this.color == Particle.SNOW_COLOR;
    }

    public clone(x: number, y: number): Particle {
        return new Particle(x, y, this.color);
    }

    public static readonly SAND_COLOR = new Color("#00FFFF");
    public static readonly SNOW_COLOR = new Color("#FF00FF");
    public static readonly SNOW_SPAWN_COLOR = new Color("#FFFFFF");
}
