import fs from 'fs';

const dict = fs.readFileSync('../game/util/dict_plural.json', 'utf8');
const arr = dict.split('*').filter(word => word === word.toLowerCase());

fs.writeFileSync('../game/util/dict_plural.json', JSON.stringify(arr), 'utf8');
