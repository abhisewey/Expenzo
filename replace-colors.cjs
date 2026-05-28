const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      results.push(fullPath);
    }
  });
  return results;
};

const files = walk('./src');
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.0[2-8]\s*\)/g, 'var(--hover-bg)');
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1[0-5]?\s*\)/g, 'var(--border-subtle)');
  content = content.replace(/rgba\(\s*17\s*,\s*24\s*,\s*39\s*,\s*0\.[7-9][0-9]?\s*\)/g, 'var(--card-bg)');
  content = content.replace(/#fff(fff)?\b/gi, 'var(--text-main)');
  content = content.replace(/'white'/gi, "'var(--text-main)'");
  content = content.replace(/:\s*white\b/gi, ': var(--text-main)');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    changed++;
  }
});
console.log('Changed files:', changed);
