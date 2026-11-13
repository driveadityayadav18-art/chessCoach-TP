import https from 'https';

https.get('https://opendesignmd.com/_astro/Gallery.astro_astro_type_script_index_0_lang.lo84m94K.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Script length:', data.length);
    // Find api endpoints, fetch calls, markdown, .md
    const matches = [...data.matchAll(/(https?:\/\/[^\s"'\)]+|\/[a-zA-Z0-9_\-\/]+\.[a-zA-Z0-9]+)/g)].map(m => m[1]);
    console.log('URLs/paths in script:', Array.from(new Set(matches)).slice(0, 30));

    // Look for occurrences of markdown or design
    const mdMatches = [...data.matchAll(/.{0,50}(?:markdown|\.md|designs\/|api\/).{0,50}/g)].map(m => m[0]);
    console.log('MD / api context:', mdMatches.slice(0, 10));
  });
});
