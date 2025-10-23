// utils/GridTextContent.ts
export interface Cell {
  id: number;
  char: string;
  isFixed?: boolean;
  isWord?: boolean;
  visible?: boolean;
}

interface GridTextContentOptions {
  cols: number;
  rows: number;
  fixedText?: { idx: number; char: string }[];
  word?: string[];
}

export function GridTextContent({
  cols,
  rows,
  fixedText = [],
  word = [],
}: GridTextContentOptions): Cell[] {
  const total = cols * rows;
  const wordCells: { idx: number; char: string }[] = [];

  if (word.length) {
    const horizontal = Math.random() < 0.5;
    if (horizontal) {
      const row = Math.floor(Math.random() * rows);
      const startCol = Math.floor(Math.random() * (cols - word.length + 1));
      for (let i = 0; i < word.length; i++) {
        wordCells.push({ idx: row * cols + (startCol + i), char: word[i] });
      }
    } else {
      const col = Math.floor(Math.random() * cols);
      const startRow = Math.floor(Math.random() * (rows - word.length + 1));
      for (let i = 0; i < word.length; i++) {
        wordCells.push({ idx: (startRow + i) * cols + col, char: word[i] });
      }
    }
  }

  const newCells: Cell[] = [];
  for (let i = 0; i < total; i++) {
    const fixed = fixedText.find((f) => f.idx === i);
    const wordCell = wordCells.find((w) => w.idx === i);
    newCells.push({
      id: i,
      char:
        fixed?.char ??
        wordCell?.char ??
        Math.floor(Math.random() * 10).toString(),
      isFixed: !!fixed,
      isWord: !!wordCell,
      visible: false,
    });
  }

  return newCells;
}
