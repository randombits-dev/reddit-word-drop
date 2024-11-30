import DICT from './dict_plural.json';
import { Coord } from '../models.ts';

const validWords = new Set(DICT);

export const isWordInDict = (letters: string[][], boxes: Coord[]) => {
  const word = boxes.map(({ x, y }) => letters[x][y]).join('').toLowerCase();
  return validWords.has(word);
};
