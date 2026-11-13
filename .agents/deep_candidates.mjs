import fs from 'fs';

let raw = fs.readFileSync('designs.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const items = JSON.parse(raw).value;

// Let's search for entries with:
// 1. editorial + serif-display
// 2. words >= 2500 (deep specifications)
// 3. check descriptions and names
const deepEditorial = items.filter(d => {
  const tags = d.tags || [];
  return (tags.includes('editorial') || tags.includes('serif-display')) && (d.words >= 2500);
});

console.log(`Deep editorial designs (words >= 2500): ${deepEditorial.length}`);
deepEditorial.forEach(d => {
  console.log(`- [${d.slug}] ${d.name} (${d.category}) | ${d.mode} | Fonts: ${d.fonts.join(', ')} | Words: ${d.words}`);
});
