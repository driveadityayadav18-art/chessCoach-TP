import fs from 'fs';

let raw = fs.readFileSync('designs.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const items = JSON.parse(raw).value;

// Let's search for top designs matching various tags and styles:
// Specifically: serif-display, editorial, minimal, monochrome, warm, dark/light, architecture, craft, education, portfolio, studio
const curated = items.filter(d => {
  const tags = d.tags || [];
  const fonts = (d.fonts || []).map(f => f.toLowerCase());
  const desc = (d.description || '').toLowerCase();
  const name = (d.name || '').toLowerCase();
  
  // Check if it has serif display or editorial
  const isEditorial = tags.includes('editorial') || tags.includes('serif-display');
  const isCraftOrArch = desc.includes('craft') || desc.includes('architecture') || desc.includes('tactile') || desc.includes('monochrome') || desc.includes('typography') || desc.includes('museum') || desc.includes('intellectual') || desc.includes('discipline') || desc.includes('gallery') || desc.includes('precision');
  
  return (isEditorial && (tags.includes('minimal') || tags.includes('monochrome') || tags.includes('warm') || tags.includes('technical')));
});

console.log('Curated count:', curated.length);

// Let's sort by words, rank, or specific features
curated.sort((a, b) => (b.words || 0) - (a.words || 0));

console.log('\nTop curated by depth (words count):');
curated.slice(0, 25).forEach(d => {
  console.log(`- [${d.slug}] ${d.name} (${d.category}) | Mode: ${d.mode} | Fonts: ${d.fonts.join(', ')} | Tags: ${d.tags.join(', ')} | Words: ${d.words}`);
  console.log(`  Desc: ${d.description.slice(0, 140)}...`);
});
