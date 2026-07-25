#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

function usage() {
  console.error('Usage: node compare-built-styles.mjs <baseline-build-dir> <candidate-build-dir>');
  process.exitCode = 2;
}

async function walkCss(root, directory = root) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkCss(root, absolutePath)));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      const content = await readFile(absolutePath);
      files.push({
        path: relative(root, absolutePath),
        bytes: content.length,
        sha256: createHash('sha256').update(content).digest('hex'),
      });
    }
  }

  return files;
}

function contentMultiset(files) {
  const values = new Map();
  for (const file of files) {
    const key = `${file.sha256}:${file.bytes}`;
    values.set(key, (values.get(key) ?? 0) + 1);
  }
  return values;
}

function equalMultisets(left, right) {
  if (left.size !== right.size) return false;
  for (const [key, count] of left) {
    if (right.get(key) !== count) return false;
  }
  return true;
}

async function main() {
  const [baselineDirectory, candidateDirectory] = process.argv.slice(2);
  if (!baselineDirectory || !candidateDirectory) {
    usage();
    return;
  }

  const [baselineFiles, candidateFiles] = await Promise.all([
    walkCss(resolve(baselineDirectory)),
    walkCss(resolve(candidateDirectory)),
  ]);

  console.log(`Baseline CSS files: ${baselineFiles.length}`);
  console.log(`Candidate CSS files: ${candidateFiles.length}`);

  if (baselineFiles.length === 0 || candidateFiles.length === 0) {
    console.error('INCONCLUSIVE: both builds must contain CSS files');
    process.exitCode = 2;
    return;
  }

  const baselineContent = contentMultiset(baselineFiles);
  const candidateContent = contentMultiset(candidateFiles);
  if (!equalMultisets(baselineContent, candidateContent)) {
    console.error('FAIL: compiled CSS content differs');
    console.error('Baseline:');
    for (const file of baselineFiles) {
      console.error(`- ${file.path} ${file.bytes} bytes ${file.sha256}`);
    }
    console.error('Candidate:');
    for (const file of candidateFiles) {
      console.error(`- ${file.path} ${file.bytes} bytes ${file.sha256}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('PASS: compiled CSS content is byte-identical');
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 2;
});
