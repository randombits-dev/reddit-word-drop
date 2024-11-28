export const calcBoxesToHighlight = (start: [number, number], end: [number, number]) => {
  const boxes: [number, number][] = [];
  if (end[0] === start[0]) {
    const inc = end[1] > start[1] ? 1 : -1;
    for (let i = start[1]; i !== end[1]; i += inc) {
      boxes.push([start[0], i]);
    }
    boxes.push(end);
  } else if (end[1] === start[1]) {
    const inc = end[0] > start[0] ? 1 : -1;
    for (let i = start[0]; i !== end[0]; i += inc) {
      boxes.push([i, start[1]]);
    }
    boxes.push(end);
  } else if (Math.abs(end[0] - start[0]) === Math.abs(end[1] - start[1])) {
    const xInc = end[0] > start[0] ? 1 : -1;
    const yInc = end[1] > start[1] ? 1 : -1;
    for (let i = 0; i < Math.abs(end[0] - start[0]); i++) {
      boxes.push([start[0] + i * xInc, start[1] + i * yInc]);
    }
    boxes.push(end);
  }
  return boxes;
};

export const isBoxAdjacentAndNotFilled = (selectedBoxes: [number, number][], i: number, j: number) => {
  if (selectedBoxes.length === 0) return true;
  const lastBox = selectedBoxes[selectedBoxes.length - 1];
  return Math.abs(lastBox[0] - i) <= 1 && Math.abs(lastBox[1] - j) <= 1;
};

export const adjustSelection = (selectedBoxes: [number, number][], i: number, j: number): [number, number][] => {
  if (selectedBoxes.length === 0) return [[i, j]];
  const lastBox = selectedBoxes[selectedBoxes.length - 1];
  if (selectedBoxes.length > 1 && i === selectedBoxes[selectedBoxes.length - 2][0] && j === selectedBoxes[selectedBoxes.length - 2][1]) {
    return selectedBoxes.slice(0, -1);
  }
  if (selectedBoxes.some(([x, y]) => x === i && y === j)) {
    return selectedBoxes;
  }
  if (Math.abs(lastBox[0] - i) <= 1 && Math.abs(lastBox[1] - j) <= 1) {
    return [...selectedBoxes, [i, j]];
  }
  return selectedBoxes;
};

export const dropBoxes = (grid: string[][], selectedBoxes: [number, number][]) => {
  // makes selected boxes disappear and boxes above them drop down
  const newGrid = grid.map((row) => row.slice());
  selectedBoxes.forEach(([x, y]) => {
    newGrid[x][y] = '';
  });
  for (let i = 0; i < newGrid.length; i++) {
    for (let j = 0; j < newGrid[i].length; j++) {
      if (newGrid[i][j] === '') {
        for (let k = i; k > 0; k--) {
          newGrid[k][j] = newGrid[k - 1][j];
        }
        newGrid[0][j] = '';
      }
    }
  }
  return newGrid;
};
