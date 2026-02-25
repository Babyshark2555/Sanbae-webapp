const fs = require('fs');
const s = fs.readFileSync('./App.jsx','utf8');
const lines = s.split(/\r?\n/);
let brace=0, paren=0;
for(let i=0;i<lines.length;i++){
  const l = lines[i];
  for(const ch of l){
    if(ch==='{') brace++;
    else if(ch==='}') brace--;
    if(ch==='(') paren++;
    else if(ch===')') paren--;
  }
  if(brace<0){
    console.log('Unmatched closing brace at line', i+1);
    console.log(lines[i-3]||'', lines[i-2]||'', lines[i-1]||'', lines[i]);
    break;
  }
  if(paren<0){
    console.log('Unmatched closing paren at line', i+1);
    console.log(lines[i-3]||'', lines[i-2]||'', lines[i-1]||'', lines[i]);
    break;
  }
}
console.log('Final counts', {brace, paren, lines: lines.length});
