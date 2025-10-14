"use client";

import { FC, useEffect, useRef } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

interface P5Canvas {
  parent: (el: HTMLElement) => void;
  remove: () => void;
}
interface P5 {
  CENTER: number;
  createCanvas: (w: number, h: number) => P5Canvas;
  textAlign: (h: number, v: number) => void;
  textFont: (font: string) => void;
  textSize: (size: number) => void;
  fill: (r: number, g?: number, b?: number, a?: number) => void;
  noStroke: () => void;
  rect: (x: number, y: number, w: number, h: number) => void;
  text: (txt: string, x: number, y: number) => void;
  background: (r: number, g?: number, b?: number, a?: number) => void;
  width: number;
  height: number;
  floor: (val: number) => number;
  random: (min: number, max: number) => number;
  millis: () => number;
  resizeCanvas: (w: number, h: number) => void;
  mouseX: number;
  mouseY: number;
  mousePressed: () => void;
  mouseDragged: () => void;
  setup?: () => void;
  draw?: () => void;
  windowResized?: () => void;
}

declare global {
  interface Window {
    p5: new (sketch: (p: P5) => void) => P5Canvas;
  }
}

interface MathGridProps {
  interval?: number;
}

const P5MathGrid: FC<MathGridProps> = ({ interval = 50 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!containerRef.current || width === 0 || height === 0) return;

    let p5Instance: P5Canvas | null = null;

    let sequenceNumbers: string[] = [];
    let sequenceWord: string[] = [];
    let toggledCells: boolean[] = [];
    let fixedCells: number[] = [];
    let cols = 0,
      rows = 0,
      cellW = 0,
      cellH = 0;

    let lastTime = 0;
    let animateIndex = 0;
    const paddingRatio = 0;

    let dragToggled: boolean[] = []; // track cells toggled during drag

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js";
    script.async = true;

    script.onload = () => {
      const sketch = (p: P5) => {
        const updateGrid = () => {
          const paddingX = width * paddingRatio;
          const paddingY = height * paddingRatio;
          const usableWidth = width - paddingX * 2;
          const usableHeight = height - paddingY * 2;

          const isMobile = width < 768;
          rows = p.floor(
            usableHeight /
              (isMobile ? usableHeight * 0.05 : usableHeight * 0.08)
          );
          cols = p.floor(usableWidth / (usableWidth * 0.05));

          cellW = usableWidth / cols;
          cellH = usableHeight / rows;

          p.textSize(Math.min(cellW, cellH) * 0.5);
          p.textAlign(p.CENTER, p.CENTER);
        };

        p.setup = () => {
          const canvas = p.createCanvas(width, height);
          canvas.parent(containerRef.current!);
          p.textFont("sans-serif");
          updateGrid();

          const totalCells = cols * rows;

          // First 4 fixed cells: "1 + 1 ="
          fixedCells = [0, 1, 2, 3];
          const fixedValues = ["1", "+", "1", "="];

          sequenceNumbers = Array(totalCells)
            .fill(0)
            .map((_, i) =>
              fixedCells.includes(i)
                ? fixedValues[fixedCells.indexOf(i)]
                : p.floor(p.random(0, 10)).toString()
            );

          // Sequence word: MULTI2 repeated
          const word = "MULTI2";
          sequenceWord = Array(totalCells)
            .fill(0)
            .map((_, i) => word[i % word.length]);

          toggledCells = Array(totalCells).fill(false);
          dragToggled = Array(totalCells).fill(false);
        };

        const toggleCell = (i: number) => {
          if (fixedCells.includes(i)) return;
          if (!dragToggled[i]) {
            toggledCells[i] = !toggledCells[i];
            dragToggled[i] = true;
          }
        };

        const handlePointer = () => {
          const paddingX = width * paddingRatio;
          const paddingY = height * paddingRatio;

          for (let i = 0; i < sequenceNumbers.length; i++) {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const x = paddingX + c * cellW;
            const y = paddingY + r * cellH;

            if (
              p.mouseX >= x &&
              p.mouseX < x + cellW &&
              p.mouseY >= y &&
              p.mouseY < y + cellH
            ) {
              toggleCell(i);
            }
          }
        };

        p.mousePressed = () => {
          dragToggled.fill(false); // reset for new drag
          handlePointer();
        };

        p.mouseDragged = () => {
          handlePointer();
        };

        p.draw = () => {
          p.background(0, 50);

          const paddingX = width * paddingRatio;
          const paddingY = height * paddingRatio;

          // Animate load
          if (
            p.millis() - lastTime > interval &&
            animateIndex < sequenceNumbers.length
          ) {
            animateIndex++;
            lastTime = p.millis();
          }

          for (let i = 0; i < animateIndex; i++) {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const x = paddingX + c * cellW;
            const y = paddingY + r * cellH;

            const isFixed = fixedCells.includes(i);
            const isToggled = toggledCells[i];

            const char = isToggled ? sequenceWord[i] : sequenceNumbers[i];

            let bgColor: [number, number, number];
            let textColor: [number, number, number];

            if (isFixed) {
              bgColor = [255, 255, 255];
              textColor = [0, 0, 0];
            } else {
              if (isToggled) {
                bgColor = [255, 255, 255];
                textColor = [0, 0, 0];
              } else {
                bgColor = [0, 0, 0];
                textColor = [255, 255, 255];
              }
            }

            // Hover inversion
            if (
              p.mouseX >= x &&
              p.mouseX < x + cellW &&
              p.mouseY >= y &&
              p.mouseY < y + cellH
            ) {
              bgColor = bgColor.map((v) => 255 - v) as [number, number, number];
              textColor = textColor.map((v) => 255 - v) as [
                number,
                number,
                number
              ];
            }

            p.fill(...bgColor);
            p.noStroke();
            p.rect(x, y, cellW, cellH);

            p.fill(...textColor);
            p.text(char, x + cellW / 2, y + cellH / 2);
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(width, height);
          updateGrid();
        };
      };

      p5Instance = new window.p5(sketch);
    };

    document.body.appendChild(script);

    return () => {
      if (p5Instance) p5Instance.remove();
      document.body.removeChild(script);
    };
  }, [width, height, interval]);

  return <div ref={containerRef} className="absolute inset-0 z-0"></div>;
};

export default P5MathGrid;
