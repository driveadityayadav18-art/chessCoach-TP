import fs from 'fs';

let raw = fs.readFileSync('designs.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const items = JSON.parse(raw).value;

const checkSlugs = [
  'resend',
  'claude',
  'telepathicinstruments',
  'ouraring',
  'bugatti',
  'linear-app',
  'zed-dev',
  'nga-gov',
  'polsia',
  'christies',
  'tambo-co',
  'diabrowser',
  'familytype-co',
  'writewithspiral',
  'ollama'
];

const selected = items.filter(d => checkSlugs.includes(d.slug));
selected.forEach(d => {
  console.log(`\n======================================================`);
  console.log(`SLUG: ${d.slug} | NAME: ${d.name} | MODE: ${d.mode}`);
  console.log(`FONTS: ${d.fonts.join(', ')}`);
  console.log(`PALETTE: ${d.palette.join(', ')}`);
  console.log(`TAGS: ${d.tags.join(', ')}`);
  console.log(`WORDS: ${d.words}`);
  console.log(`DESCRIPTION: ${d.description}`);
});
