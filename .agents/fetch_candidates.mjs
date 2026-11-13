import fs from 'fs';

const candidates = [
  'resend',
  'harvey-ai',
  'claude',
  'telepathicinstruments',
  'warp-dev',
  'research-perplexity-ai',
  'bugatti',
  'ouraring'
];

async function fetchOne(slug) {
  try {
    const url = `https://opendesignmd.com/designs/${slug}/DESIGN.md`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`Failed ${slug}: ${res.status}`);
      return null;
    }
    const text = await res.text();
    fs.writeFileSync(`.agents/${slug}.DESIGN.md`, text, 'utf8');
    console.log(`Saved ${slug}: ${text.length} chars, lines: ${text.split('\n').length}`);
  } catch (err) {
    console.error(`Error ${slug}:`, err.message);
  }
}

async function run() {
  for (const c of candidates) {
    await fetchOne(c);
  }
}

run();
