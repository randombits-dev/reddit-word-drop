import DICT from './dict_plural.json';

const validWords = new Set(DICT);

export const isWordInDict = (letters: string[][], boxes: [number, number][]) => {
  const word = boxes.map(([x, y]) => letters[x][y]).join('').toLowerCase();
  return validWords.has(word);
};
