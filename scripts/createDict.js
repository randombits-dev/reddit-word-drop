import fs from 'fs';

const dict = JSON.parse(fs.readFileSync('words_dictionary.json', 'utf8'));

const filtered = Object.keys(dict).filter(word => word.length > 1);

fs.writeFileSync('dict.json', JSON.stringify(filtered), 'utf8');
