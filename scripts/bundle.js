import fs from 'fs';
import path from 'path';

const files = [
  'js/state.js',
  'js/data/mock-data.js',
  'js/router.js',
  'js/ai-provider.js',
  'js/components/toast.js',
  'js/components/modal.js',
  'js/components/source-viewer.js',
  'js/components/file-upload.js',
  'js/components/exception-card.js',
  'js/components/data-table.js',
  'js/components/chat.js',
  'js/views/dashboard.js',
  'js/views/upload.js',
  'js/views/analysis.js',
  'js/views/results.js',
  'js/views/approval.js',
  'js/app.js'
];

let bundleCode = '';

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf-8');
    // Strip export keywords
    content = content.replace(/^export\s+/gm, '');
    // Strip import statements
    content = content.replace(/^import\s+.*?;\s*$/gm, '');
    bundleCode += `\n/* === ${file} === */\n` + content + '\n';
  }
}

fs.writeFileSync('app.bundle.js', bundleCode);
console.log('Bundled successfully into app.bundle.js (size:', bundleCode.length, 'bytes)');
