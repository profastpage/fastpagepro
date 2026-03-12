
import axios from 'axios';

const testUrls = [
  'https://www.google.com',           // Simple, dynamic, but very optimized
  'https://www.wikipedia.org',        // Static, clean HTML
  'https://tailwindcss.com',          // Modern, CSS-heavy
  'https://nextjs.org',               // Modern React/Next.js
];

async function runTests() {
  console.log('🚀 Starting Performance Tests for Web Cloner...\n');

  for (const url of testUrls) {
    const startTime = Date.now();
    console.log(`Testing: ${url}`);
    
    try {
      const response = await axios.get(`http://localhost:3000/api/clone?url=${encodeURIComponent(url)}`, {
        timeout: 20000 // 20s timeout
      });
      
      const duration = Date.now() - startTime;
      const sizeKB = Math.round(Buffer.byteLength(response.data, 'utf8') / 1024);
      
      console.log(`✅ Success!`);
      console.log(`   Time: ${duration}ms`);
      console.log(`   Size: ${sizeKB} KB`);
      console.log(`   Content-Type: ${response.headers['content-type']}`);
      
      // Basic validation of sanitized content
      const hasBaseTag = response.data.includes('<base href=');
      const hasFixScript = response.data.includes('fixAllElements');
      const hasViewport = response.data.includes('viewport');
      
      console.log(`   Sanitization: ${hasBaseTag ? 'OK (Base Tag)' : 'FAIL (Missing Base Tag)'}, ${hasFixScript ? 'OK (Fix Script)' : 'FAIL (Missing Fix Script)'}, ${hasViewport ? 'OK (Viewport)' : 'FAIL (Missing Viewport)'}`);
      
    } catch (error: any) {
      console.log(`❌ Failed: ${url}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Error: ${JSON.stringify(error.response.data)}`);
      } else {
        console.log(`   Error: ${error.message}`);
      }
    }
    console.log('-----------------------------------\n');
  }
}

// Check if dev server is running before testing
async function checkServer() {
  try {
    await axios.get('http://localhost:3000');
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const isServerRunning = await checkServer();
  if (!isServerRunning) {
    console.error('❌ Error: Local dev server is not running on http://localhost:3000');
    console.log('Please start it with "npm run dev" first.');
    process.exit(1);
  }
  
  await runTests();
})();
