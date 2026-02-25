const fs = require('fs');
const s = fs.readFileSync('../App.jsx','utf8');
const counts = {
  lbrace: (s.match(/{/g) || []).length,
  rbrace: (s.match(/}/g) || []).length,
  lparen: (s.match(/\(/g) || []).length,
  rparen: (s.match(/\)/g) || []).length,
  lt: (s.match(/</g) || []).length,
  gt: (s.match(/>/g) || []).length,
  backtick: (s.match(/`/g) || []).length,
  singleQuote: (s.match(/'/g) || []).length,
  doubleQuote: (s.match(/\"/g) || []).length
};
console.log(counts);
