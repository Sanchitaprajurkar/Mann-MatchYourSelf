const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      // Do not recurse
      if (!file.includes('node_modules') && !file.includes('dist')) {
        results = results.concat(walk(file));
      }
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Replace imports of api/axios with utils/api
  // We need to capture the exact relative prefix
  const importRegex = /import\s+(api|axios)\s+from\s+['"](.*?)api\/axios['"];?/g;
  content = content.replace(importRegex, (match, p1, p2) => {
    changed = true;
    return `import API from "${p2}utils/api";`;
  });

  // 2. Replace api.METHOD("/endpoint") with API.METHOD("/api/endpoint")
  const methodRegex = /\b(api|axios)\.(get|post|put|delete|patch)\(\s*(['"`])\/(?!api\/)(.+?)\3/g;
  content = content.replace(methodRegex, (match, prefix, method, quote, endpoint) => {
    changed = true;
    return `API.${method}(${quote}/api/${endpoint}${quote}`;
  });

  // 3. Replace any remaining variable references to `api` with `API`
  // But ONLY for the axios instance methods.
  content = content.replace(/\b(api|axios)\.(get|post|put|delete|patch|interceptors|defaults)\b/g, (match, p1, p2) => {
    changed = true;
    return `API.${p2}`;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
