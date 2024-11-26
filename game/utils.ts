import { WebviewToBlockMessage } from './shared';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sendToDevvit(event: WebviewToBlockMessage) {
  window.parent?.postMessage(event, '*');
}

export const calcDir = (last: [number, number], next: [number, number]) => {
  if (last[0] === -1 || (last[0] === next[0] && last[1] === next[1])) return 0;
  if (last[0] === next[0]) {
    if (last[1] < next[1]) return 7;
    return 3;
  }
  if (last[1] === next[1]) {
    if (last[0] < next[0]) return 5;
    return 1;
  }
  if (last[0] < next[0]) {
    if (last[1] < next[1]) return 6;
    return 8;
  }
  if (last[1] < next[1]) return 4;
  return 2;
};

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

export const checkWord = (letters: string[][], boxes: [number, number][], words: string[]) => {
  const word = boxes.map(([x, y]) => letters[x][y]).join('');
  return words.includes(word);
};
