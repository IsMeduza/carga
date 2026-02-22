const fs = require('fs');
let html = fs.readFileSync('inici.html', 'utf8');
html = html.replace(/<button\s+class="w-full py-4/g, '<button class="btn-shine relative z-10 w-full py-4');
fs.writeFileSync('inici.html', html, 'utf8');
console.log('done');
