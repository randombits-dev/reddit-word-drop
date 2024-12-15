import fs from 'fs';

const dict = fs.readFileSync('dict.txt', 'utf8').split('\r\n');

const filtered = dict.filter(word => word.length > 1);

fs.writeFileSync('dict.json', JSON.stringify(filtered), 'utf8');
