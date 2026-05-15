// Small build-time helper to write runtime config for the static frontend.
const fs = require('fs');
const path = require('path');

const apiBase = process.env.API_BASE || process.env.NEXT_PUBLIC_API_BASE || '';
const content = `window.__API_BASE__ = ${JSON.stringify(apiBase)};`;

fs.writeFileSync(path.join(__dirname, 'config.js'), content, 'utf8');
console.log('Wrote web/config.js with API_BASE =', apiBase || '<empty>');
