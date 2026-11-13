import fs from 'fs';

let raw = fs.readFileSync('designs.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const data = JSON.parse(raw);
const items = Array.isArray(data) ? data : (data.value || data.designs || []);

console.log('Categories count:');
const categories = {};
const tags = {};
items.forEach(item => {
  categories[item.category] = (categories[item.category] || 0) + 1;
  (item.tags || []).forEach(t => tags[t] = (tags[t] || 0) + 1);
});
console.log('Categories:', categories);
console.log('Top tags:', Object.entries(tags).sort((a,b) => b[1]-a[1]).slice(0, 30));

// Let's filter items that might be relevant for chess, editorial, luxury, education, portfolio, craft, dark, serif
const candidates = items.filter(item => {
  const text = `${item.name} ${item.description} ${(item.tags||[]).join(' ')} ${(item.fonts||[]).join(' ')} ${item.category}`.toLowerCase();
  const hasEditorial = text.includes('editorial') || text.includes('serif') || text.includes('craft') || text.includes('academy') || text.includes('chess') || text.includes('minimal') || text.includes('luxury') || text.includes('monochrome') || text.includes('architect') || text.includes('intellectual') || text.includes('studio');
  return hasEditorial;
});
console.log('Candidates count:', candidates.length);
