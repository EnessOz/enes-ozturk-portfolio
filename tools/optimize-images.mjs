// Usage: node tools/optimize-images.mjs <directory containing sharp's package.json>
// sharp is a temporary build tool, not a portfolio dependency.
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const sharp = createRequire(resolve(process.argv[2], 'package.json'))('sharp');
const names = ['music-desktop', 'software-desktop', 'music-mobile', 'software-mobile'];
const hash = buffer => createHash('sha256').update(buffer).digest('hex');
const report = [];
for (const name of names) {
  const source = `assets/images/${name}.png`;
  const original = await readFile(source);
  const metadata = await sharp(original).metadata();
  const row = { name, width: metadata.width, height: metadata.height, colorSpace: metadata.space, hasICC: metadata.hasProfile, originalBytes: original.length, originalSHA256: hash(original), variants: [] };
  for (const quality of [95, 90]) {
    const file = `assets/images/${name}-q${quality}.webp`;
    await sharp(original).keepIccProfile().webp({ quality, effort: 6, smartSubsample: true }).toFile(file);
    const result = await sharp(file).metadata();
    if (result.width !== metadata.width || result.height !== metadata.height) throw new Error(`Resolution changed: ${file}`);
    const bytes = (await stat(file)).size;
    row.variants.push({ quality, file, bytes, savedPercent: Number(((1 - bytes / original.length) * 100).toFixed(2)) });
  }
  if (hash(await readFile(source)) !== row.originalSHA256) throw new Error(`Original modified: ${source}`);
  report.push(row);
}
await writeFile('tools/image-report.json', JSON.stringify(report, null, 2) + '\n');
console.table(report.map(r => ({ image: r.name, resolution: `${r.width}×${r.height}`, PNG: r.originalBytes, Q95: r.variants[0].bytes, 'Q95 saved %': r.variants[0].savedPercent, Q90: r.variants[1].bytes, 'Q90 saved %': r.variants[1].savedPercent })));
