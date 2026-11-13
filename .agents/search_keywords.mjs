import fs from 'fs';

let raw = fs.readFileSync('designs.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const items = JSON.parse(raw).value;

const keywords = [
  'leica', 'aesop', 'polestar', 'teenage', 'linear', 'resend', 'bugatti', 'porsche', 'monotype',
  'chronicle', 'the-atlantic', 'new-yorker', 'economist', 'harvard', 'oxford', 'chess', 'grandmaster',
  'atelier', 'studio', 'craft', 'architect', 'museum', 'gallery', 'editorial-new', 'garamond',
  'instrument', 'cormorant', 'fraunces', 'caslon', 'bodoni', 'baskerville', 'lyon', 'canela',
  'austere', 'tactile', 'pedagogy', 'academy', 'masterclass', 'sectional', 'loewe', 'hermes'
];

console.log('Searching by brand/aesthetic keywords...');
const found = items.filter(d => {
  const all = `${d.slug} ${d.name} ${d.description} ${(d.fonts||[]).join(' ')} ${(d.tags||[]).join(' ')}`.toLowerCase();
  return keywords.some(k => all.includes(k));
});

console.log(`Found ${found.length} matches:`);
found.forEach(d => {
  console.log(`- [${d.slug}] ${d.name} (${d.category}) | Mode: ${d.mode} | Fonts: ${d.fonts.join(', ')} | Tags: ${d.tags.join(', ')} | Words: ${d.words}`);
  console.log(`  ${d.description.slice(0, 120)}...`);
});
