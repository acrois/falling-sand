import { Canvas } from "./canvas";
import { Sand } from "./sand";
import { Particle } from "./particle";
import * as Color from 'color';

let canvas = new Canvas(<HTMLCanvasElement>document.getElementById('sand'));
let sand = new Sand(canvas);

let w: any = window;
w.sand = sand;

let targetFPS = 60;
sand.start(targetFPS);

function initialize() {
    // Register an event listener to call the resizeCanvas() function 
    // each time the window is resized.
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('mousemove', mouseParticle, false);
    window.addEventListener('mousedown', mouseParticle, false);
    window.addEventListener('mouseup', mouseParticle, false);
    window.addEventListener('click', mouseParticle, false);

    resizeCanvas();
}

function resizeCanvas() {
    canvas.resize(Math.min(480, window.innerWidth), Math.min(240, window.innerHeight));
}

function mouseParticle(e: MouseEvent) {
    if (!e.buttons) {
        return false;
    }
    /*
MouseEvent {isTrusted: true, screenX: 608, screenY: 501, clientX: 608, clientY: 430, …}
altKey: false
bubbles: true
button: 0
buttons: 1
cancelBubble: false
cancelable: true
clientX: 608
clientY: 430
composed: true
ctrlKey: false
currentTarget: null
defaultPrevented: false
detail: 0
eventPhase: 0
fromElement: null
isTrusted: true
layerX: 608
layerY: 430
metaKey: false
movementX: -3
movementY: -1
offsetX: 608
offsetY: 430
pageX: 608
pageY: 430
path: (5) [canvas#sand, body, html, document, Window]
relatedTarget: null
returnValue: true
screenX: 608
screenY: 501
shiftKey: false
sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
srcElement: canvas#sand
target: canvas#sand
timeStamp: 1598.0950000230223
toElement: canvas#sand
type: "mousemove"
view: Window {parent: Window, postMessage: ƒ, blur: ƒ, focus: ƒ, close: ƒ, …}
which: 1
x: 608
y: 430
__proto__: MouseEvent
    */

    let brushWidth = 5;
    let brushHeight = 5;

    sand.pause();

    for (let y = e.offsetY; y < e.offsetY + brushWidth; y++) {
        for (let x = e.offsetX; x < e.offsetX + brushWidth; x++) {
            if (e.button == 0) {
                sand.createPosition(x, y, Particle.SAND_COLOR);
            }
            else if (e.button == 2) {
                sand.createPosition(x, y, Particle.SNOW_SPAWN_COLOR);
            }
        }
    }

    sand.start(targetFPS);

    e.stopPropagation();
    e.cancelBubble = true;
    return false;
}

initialize();

