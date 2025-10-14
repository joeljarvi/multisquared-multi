import type { P5CanvasInstance, SketchProps } from "@p5-wrapper/react";

export type MathGridProps = SketchProps & {
  interval?: number; // ms between new digits
};

export default function mathGridSketch(p5: P5CanvasInstance<MathGridProps>) {
  let displayText: string[] = ["1", "+", "1", "=", "2"];
  let lastTime = 0;
  const paddingRatio = 0.05;

  let cols = 0;
  let rows = 0;
  let cellW = 0;
  let cellH = 0;
  let interval = p5.props?.interval ?? 100;

  const word = "multi²";
  const wordCount = 8; // how many times the word appears

  function updateGrid() {
    const paddingX = p5.width * paddingRatio;
    const paddingY = p5.height * paddingRatio;
    const usableWidth = p5.width - paddingX * 2;
    const usableHeight = p5.height - paddingY * 2;

    const isMobile = p5.width < 768;
    rows = Math.floor(
      usableHeight / (isMobile ? usableHeight * 0.05 : usableHeight * 0.08)
    );
    cols = Math.floor(usableWidth / (usableWidth * 0.05));

    cellW = usableWidth / cols;
    cellH = usableHeight / rows;

    p5.textSize(Math.min(cellW, cellH) * 0.8);
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.textFont("monospace");
    p5.fill(0, 255, 70); // Matrix green
    updateGrid();
  };

  p5.updateWithProps = (props: MathGridProps) => {
    if (props.interval !== undefined) interval = props.interval;
  };

  p5.draw = () => {
    p5.background(0, 50); // semi-transparent fade

    // Draw the existing displayText array
    for (let i = 0; i < displayText.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const x = paddingRatio * p5.width + c * cellW;
      const y = paddingRatio * p5.height + r * cellH;
      p5.text(displayText[i], x, y);
    }

    // Add new characters over time
    if (p5.millis() - lastTime > interval) {
      const randNum = Math.floor(p5.random(0, 10)).toString();

      // Occasionally insert "multi²" characters randomly
      if (Math.random() < 0.05 && displayText.length < cols * rows) {
        const wordChar = word.charAt(Math.floor(p5.random(0, word.length)));
        displayText.push(wordChar);
      } else {
        displayText.push(randNum);
      }

      // Add additional instances of "multi²" at random positions if not yet full
      const currentWordCount =
        displayText.join("").match(new RegExp(word, "g"))?.length ?? 0;
      if (currentWordCount < wordCount && Math.random() < 0.02) {
        for (let j = 0; j < word.length; j++) {
          displayText.push(word[j]);
        }
      }

      // Reset if too long
      if (displayText.length > cols * rows) {
        displayText = ["1", "+", "1", "=", "2"];
      }

      lastTime = p5.millis();
    }
  };

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    updateGrid();
  };
}
