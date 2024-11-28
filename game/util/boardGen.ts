const tilecount = 16;

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
  , 'Q': 0.00095
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

const vowels = ['A', 'E', 'I', 'O', 'U'];

export const generateBoard = () => {
  for (const [key, weight] of Object.entries(weights)) {
    weights[key] = Math.cbrt(weight);
    if (!vowels.includes(key)) {
      weights[key] = weights[key] / 2;
    }
  }

  const rows = [];
  for (let i = 0; i < 8; i++) {
    const letters = [];
    for (let j = 0; j < 8; j++) {
      const random = Math.random();
      let letter = '';
      for (let k = 0; k < accumulatedWeights.length; k++) {
        if (random < accumulatedWeights[k]) {
          letter = Object.keys(weights)[k];
          break;
        }
      }
      letters.push(letter);
    }
    rows.push(letters);
  }

  return rows;
  // const distribution = makeDistribution(weights);
  // console.log(distribution);
  // const letter = randomElement(distribution);
  // weights[letter] = weights[letter] * 0.6;
  // if (vowels.includes(letter)) {
  //   for (const [key, weight] of Object.entries(weights)) {
  //     if (vowels.includes(key)) {
  //       weights[key] = weight * 0.8;
  //     }
  //   }
  // }
};

// TODO: Handle Qu

function makeDistribution(weights: { [key: string]: number }) {
  const distribution = [];
  for (const [key, weight] of Object.entries(weights)) {
    const resolution = 10;
    const frequency = Math.floor(weight * resolution);
    for (let i = 0; i < frequency; i++) {
      distribution.push(key);
    }
  }
  return distribution;
}
