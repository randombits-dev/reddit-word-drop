const weights: { [key: string]: number } = {
  'A': 0.08167
  , 'B': 0.01492
  , 'C': 0.02782
  , 'D': 0.04253
  , 'E': 0.12702
  , 'F': 0.02228
  , 'G': 0.02015
  , 'H': 0.06094
  , 'I': 0.06966
  , 'J': 0.00153
  , 'K': 0.00772
  , 'L': 0.04025
  , 'M': 0.02406
  , 'N': 0.06749
  , 'O': 0.07507
  , 'P': 0.01929
  , 'Qu': 0.00095
  , 'R': 0.05987
  , 'S': 0.06327
  , 'T': 0.09056
  , 'U': 0.02758
  , 'V': 0.00978
  , 'W': 0.02360
  , 'X': 0.00150
  , 'Y': 0.01974
  , 'Z': 0.00075,
};

const accumulatedWeights = Object.values(weights).reduce((acc, weight) => {
  acc.push(acc[acc.length - 1] + weight);
  return acc;
}, [0]);
accumulatedWeights.shift();

// const vowels = ['A', 'E', 'I', 'O', 'U'];

const getRandomLetter = () => {
  const random = Math.random();
  for (let k = 0; k < accumulatedWeights.length; k++) {
    if (random < accumulatedWeights[k]) {
      return Object.keys(weights)[k];
    }
  }
};

const getRandomPositionNextTo = (x: number, y: number, size: number, letters: string[][]) => {
  const random = Math.random();
  const options = [];
  const addOption = (x: number, y: number) => {
    if (letters[y][x] === '') {
      options.push({ x, y });
    }
  };

  if (x > 0) addOption(x - 1, y);
  if (x < size - 1) addOption(x + 1, y);
  if (y > 0) addOption(x, y - 1);
  if (y < size - 1) addOption(x, y + 1);
  return options[Math.floor(random * options.length)];
};

export const generateCatBoard = (size: number, words: string[]) => {
  const letters: string[][] = generateEmptyBoard(size);
  words.forEach((word, wordIndex) => {
    let lastPos = { x: -1, y: -1 };
    word.split('').forEach((letter, letterIndex) => {
      if (letterIndex === 0) {
        const startCol = Math.floor(Math.random() * size);
        const startRow = size - 1;
        letters[startRow][startCol] = letter;
        lastPos = { x: startCol, y: startRow };
      } else {
        const newPos = getRandomPositionNextTo(lastPos.x, lastPos.y, size, letters);
        letters[newPos.y][newPos.x] = letter;
        lastPos = newPos;
      }
    });
  });
  return letters;
};

export const generateEmptyBoard = (size: number) => {
  const rows = [];
  for (let i = 0; i < size; i++) {
    const letters = [];
    for (let j = 0; j < size; j++) {
      letters.push('');
    }
    rows.push(letters);
  }
  return rows;
};

export const generateBoard = (size: number) => {
  const rows = [];
  for (let i = 0; i < size; i++) {
    const letters = [];
    for (let j = 0; j < size; j++) {
      letters.push(getRandomLetter() || 'Z');
    }
    rows.push(letters);
  }

  return rows;
};
