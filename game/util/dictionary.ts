import DICT from './dict.json';
import { Coord } from '../models.ts';

const validWords = new Set(DICT);

export const isWordInDict = (letters: string[][], boxes: Coord[]) => {
  const word = boxes.map(({ x, y }) => letters[x][y]).join('').toUpperCase();
  return validWords.has(word);
};
