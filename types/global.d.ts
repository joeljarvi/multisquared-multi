interface P5Canvas {
  parent: (el: HTMLElement) => void;
  remove: () => void;
}

interface P5 {
  CENTER: number;
  LEFT: number;
  RIGHT: number;
  TOP: number;
  BOTTOM: number;
  createCanvas: (w: number, h: number) => P5Canvas;
  textAlign: (h: number, v: number) => void;
  textFont: (font: string) => void;
  textSize: (size: number) => void;
  fill: (r: number, g?: number, b?: number, a?: number) => void;
  noStroke: () => void;
  stroke: (r: number, g?: number, b?: number, a?: number) => void;
  rect: (x: number, y: number, w: number, h: number) => void;
  text: (txt: string, x: number, y: number) => void;
  background: (r: number, g?: number, b?: number, a?: number) => void;
  width: number;
  height: number;
  floor: (val: number) => number;
  random: (min: number, max: number) => number;
  millis: () => number;
  windowResized?: () => void;
  setup?: () => void;
  draw?: () => void;
}

declare global {
  interface Window {
    p5: new (sketch: (p: P5) => void) => P5Canvas;
  }
}

export {};
