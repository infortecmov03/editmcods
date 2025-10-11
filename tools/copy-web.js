#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function shouldExclude(name) {
  const exclude = new Set(['node_modules', 'tools', '.git', 'www']);
  return exclude.has(name);
}

async function copyRecursive(src, dest) {
  const stat = await fs.promises.stat(src);
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    for (const entry of entries) {
      if (shouldExclude(entry)) continue;
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      await copyRecursive(srcPath, destPath);
    }
  } else if (stat.isFile()) {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);
  }
}

async function main() {
  try {
    const workspace = path.resolve(__dirname, '..');
    const src = workspace;
    const dest = path.join(workspace, 'www');

    console.log('Preparing web assets in:', dest);

    // Remove dest if exists
    if (fs.existsSync(dest)) {
      await fs.promises.rm(dest, { recursive: true, force: true });
    }

    await copyRecursive(src, dest);
    console.log('Web assets copied. Ensure manifest.json and service worker are present and correct.');
  } catch (err) {
    console.error('Error copying web assets:', err);
    process.exitCode = 1;
  }
}

main();
