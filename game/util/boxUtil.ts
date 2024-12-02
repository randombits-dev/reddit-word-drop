import { Coord } from '../models.ts';

// export const calcBoxesToHighlight = (start: [number, number], end: [number, number]) => {
//   const boxes: [number, number][] = [];
//   if (end[0] === start[0]) {
//     const inc = end[1] > start[1] ? 1 : -1;
//     for (let i = start[1]; i !== end[1]; i += inc) {
//       boxes.push([start[0], i]);
//     }
//     boxes.push(end);
//   } else if (end[1] === start[1]) {
//     const inc = end[0] > start[0] ? 1 : -1;
//     for (let i = start[0]; i !== end[0]; i += inc) {
//       boxes.push([i, start[1]]);
//     }
//     boxes.push(end);
//   } else if (Math.abs(end[0] - start[0]) === Math.abs(end[1] - start[1])) {
//     const xInc = end[0] > start[0] ? 1 : -1;
//     const yInc = end[1] > start[1] ? 1 : -1;
//     for (let i = 0; i < Math.abs(end[0] - start[0]); i++) {
//       boxes.push([start[0] + i * xInc, start[1] + i * yInc]);
//     }
//     boxes.push(end);
//   }
//   return boxes;
// };

// export const isBoxAdjacentAndNotFilled = (selectedBoxes: [number, number][], i: number, j: number) => {
//   if (selectedBoxes.length === 0) return true;
//   const lastBox = selectedBoxes[selectedBoxes.length - 1];
//   return Math.abs(lastBox[0] - i) <= 1 && Math.abs(lastBox[1] - j) <= 1;
// };

export const adjustSelection = (selectedBoxes: Coord[], point: Coord): Coord[] => {
  if (selectedBoxes.length === 0) return [point];
  const lastBox = selectedBoxes[selectedBoxes.length - 1];
  if (selectedBoxes.length > 1 && point.x === selectedBoxes[selectedBoxes.length - 2].x && point.y === selectedBoxes[selectedBoxes.length - 2].y) {
    return selectedBoxes.slice(0, -1);
  }
  if (selectedBoxes.some(({ x, y }) => x === point.x && y === point.y)) {
    return selectedBoxes;
  }
  if (Math.abs(lastBox.x - point.x) <= 1 && Math.abs(lastBox.y - point.y) <= 1) {
    return [...selectedBoxes, point];
  }
  return selectedBoxes;
};

export const dropBoxes = (grid: string[][], selectedBoxes: Coord[]): [string[][], Coord[]] => {
  // makes selected boxes disappear and boxes above them drop down
  const newGrid = grid.map((col) => col.slice());
  selectedBoxes.forEach(({ x, y }) => {
    newGrid[x][y] = '';
  });
  for (let col = 0; col < newGrid.length; col++) {
    for (let row = 0; row < newGrid[col].length; row++) {
      if (newGrid[col][row] === '') {
        for (let k = row; k > 0; k--) {
          newGrid[col][k] = newGrid[col][k - 1];
        }
        newGrid[col][0] = '';
      }
    }
  }
  return [newGrid, []];
};
