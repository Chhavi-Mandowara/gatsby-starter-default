export default async function handler(req, res) {
  const { speed = 'medium' } = req.query

  // Set headers for Server-Sent Events / streaming
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Transfer-Encoding', 'chunked')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const delays = {
    fast: 50,
    medium: 150,
    slow: 300
  }

  const delay = delays[speed] || delays.medium

  const sampleText = `This is a streaming test for Gatsby deployed on Launch! 

The text you're reading is being streamed word by word from the server to demonstrate Transfer-Encoding: chunked functionality.

This is particularly useful for:
- Real-time data updates
- Large response handling  
- Progressive content loading
- Better user experience with immediate feedback

Speed setting: ${speed.toUpperCase()}
Delay between chunks: ${delay}ms

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

🎉 Streaming test completed successfully! 

If you can see this text appearing progressively, then chunked transfer encoding is working properly on your deployment platform.`

  const words = sampleText.split(' ')

  try {
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const chunk = i === 0 ? word : ` ${word}`
      
      res.write(chunk)
      
      // Don't delay after the last word
      if (i < words.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    
    res.end()
  } catch (error) {
    console.error('Streaming error:', error)
    res.status(500).end('Streaming error occurred')
  }
}