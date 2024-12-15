import { Coord } from '../models.ts';

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

  // if any columns are empty, remove them
  for (let col = newGrid.length - 1; col > 0; col--) {
    if (!newGrid[col].some(l => !!l)) {
      newGrid.splice(col, 1);
    }
  }

  return [newGrid, []];
};
