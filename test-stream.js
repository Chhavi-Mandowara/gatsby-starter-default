// Simple test for the streaming API functionality
const http = require('http');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  if (url.pathname === '/api/stream') {
    const speed = url.searchParams.get('speed') || 'medium';
    
    const delays = {
      fast: 50,
      medium: 150,
      slow: 300
    };

    const delay = delays[speed] || delays.medium;

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      res.end();
      return;
    }

    const sampleText = `This is a streaming test for Gatsby deployed on Launch! 

The text you're reading is being streamed word by word from the server to demonstrate Transfer-Encoding: chunked functionality.

Speed setting: ${speed.toUpperCase()}
Delay between chunks: ${delay}ms

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

🎉 Streaming test completed successfully!`;

    const words = sampleText.split(' ');

    let wordIndex = 0;

    const sendWord = () => {
      if (wordIndex < words.length) {
        const word = words[wordIndex];
        const chunk = wordIndex === 0 ? word : ` ${word}`;
        res.write(chunk);
        wordIndex++;
        
        if (wordIndex < words.length) {
          setTimeout(sendWord, delay);
        } else {
          res.end();
        }
      }
    };

    sendWord();
    
  } else if (url.pathname === '/') {
    // Serve a simple test page
    res.setHeader('Content-Type', 'text/html');
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Streaming Test</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        button { padding: 10px 20px; margin: 5px; background: #663399; color: white; border: none; border-radius: 5px; cursor: pointer; }
        button:hover { background: #552288; }
        #output { background: #f5f5f5; border: 1px solid #ddd; padding: 20px; margin-top: 20px; min-height: 200px; white-space: pre-wrap; font-family: monospace; }
    </style>
</head>
<body>
    <h1>Streaming Test</h1>
    <p>Click a button to test streaming:</p>
    <button onclick="startStream('fast')">Stream (Fast)</button>
    <button onclick="startStream('medium')">Stream (Medium)</button>
    <button onclick="startStream('slow')">Stream (Slow)</button>
    
    <div id="output">Click a button above to start streaming...</div>

    <script>
        async function startStream(speed) {
            const output = document.getElementById('output');
            output.textContent = '';
            
            try {
                const response = await fetch('/api/stream?speed=' + speed);
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    output.textContent += chunk;
                }
            } catch (error) {
                output.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>
    `);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Test the streaming at: http://localhost:3000/');
});