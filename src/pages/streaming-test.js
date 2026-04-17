import * as React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"

const StreamingTestPage = () => {
  const [streamingText, setStreamingText] = React.useState("")
  const [isStreaming, setIsStreaming] = React.useState(false)

  const startStream = async (speed) => {
    setStreamingText("")
    setIsStreaming(true)

    try {
      const response = await fetch(`/api/stream?speed=${speed}`)
      
      if (!response.body) {
        throw new Error('ReadableStream not supported')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }

        const chunk = decoder.decode(value)
        setStreamingText(prev => prev + chunk)
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setStreamingText('Error: Streaming failed. This feature requires server-side streaming support.')
    } finally {
      setIsStreaming(false)
    }
  }

  const buttonStyle = {
    backgroundColor: '#663399',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    margin: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  }

  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  }

  const outputStyle = {
    backgroundColor: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '6px',
    padding: '20px',
    marginTop: '20px',
    minHeight: '200px',
    fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  }

  return (
    <Layout>
      <div style={containerStyle}>
        <h1>Transfer-Encoding: Chunked Streaming Test</h1>
        <p>This replicates the streaming test functionality. Click a button below.</p>
        <p>
          <strong>If streaming works:</strong> text should appear word-by-word incrementally.
        </p>
        <p>
          <strong>If buffered (Launch issue):</strong> the full response appears all at once.
        </p>

        <div style={{ marginBottom: '20px' }}>
          <button
            style={buttonStyle}
            onClick={() => startStream('fast')}
            disabled={isStreaming}
            onMouseOver={(e) => e.target.style.backgroundColor = '#552288'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#663399'}
          >
            Stream (Fast)
          </button>
          <button
            style={buttonStyle}
            onClick={() => startStream('medium')}
            disabled={isStreaming}
            onMouseOver={(e) => e.target.style.backgroundColor = '#552288'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#663399'}
          >
            Stream (Medium)
          </button>
          <button
            style={buttonStyle}
            onClick={() => startStream('slow')}
            disabled={isStreaming}
            onMouseOver={(e) => e.target.style.backgroundColor = '#552288'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#663399'}
          >
            Stream (Slow)
          </button>
        </div>

        {isStreaming && <p><em>Streaming in progress...</em></p>}

        <div style={outputStyle}>
          {streamingText || "Click a button above to start streaming..."}
        </div>

        <p style={{ marginTop: '30px' }}>
          <Link to="/" style={{ color: '#663399', textDecoration: 'none', fontWeight: 'bold' }}>
            ← Back to Home
          </Link>
        </p>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Streaming Test" />

export default StreamingTestPage