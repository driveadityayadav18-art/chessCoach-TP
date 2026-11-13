import fs from 'fs';

let raw = fs.readFileSync('designs.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const items = JSON.parse(raw).value;

const names = [
  'raycast', 'teenage', 'rimowa', 'harvey', 'mercury', 'ramp', 'stripe', 'vercel', 'cursor',
  'cognition', 'cal-com', 'chronicle', 'replit', 'folk', 'pitch', 'monotype', 'amie', 'koto',
  'pentagram', 'readwise', 'bento', 'craft', 'notion', 'arc', 'browser', 'sublime', 'warp'
];

const found = items.filter(d => names.some(n => d.slug.includes(n) || d.name.toLowerCase().includes(n)));
console.log(`Found ${found.length} items:`);
found.forEach(d => {
  console.log(`- [${d.slug}] ${d.name} | Mode: ${d.mode} | Fonts: ${d.fonts.join(', ')} | Tags: ${d.tags.join(', ')}`);
});
