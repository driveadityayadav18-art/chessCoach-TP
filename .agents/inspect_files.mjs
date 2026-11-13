import fs from 'fs';

const files = [
  'resend',
  'harvey-ai',
  'claude',
  'telepathicinstruments',
  'warp-dev',
  'bugatti'
];

files.forEach(slug => {
  const content = fs.readFileSync(`.agents/${slug}.DESIGN.md`, 'utf8');
  console.log(`\n======================================================`);
  console.log(`SLUG: ${slug}`);
  console.log(content.slice(0, 1000));
});
