import https from 'https';

https.get('https://opendesignmd.com', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const scripts = [...data.matchAll(/src="([^"]+\.js)"/g)].map(m => m[1]);
    console.log('Scripts:', scripts);
    // Also look for links or buttons
    const links = [...data.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
    console.log('Sample links:', links.slice(0, 20));
  });
});
