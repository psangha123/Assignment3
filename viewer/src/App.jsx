import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './index.css';

const API_BASE = 'http://localhost:3001/api';

function App() {
  const [view, setView] = useState('list'); // list, wiki, graph
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  const fetchFiles = () => {
    fetch(`${API_BASE}/wiki`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(console.error);
  };

  const fetchGraph = () => {
    fetch(`${API_BASE}/graph`)
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchFiles();
    fetchGraph();
    // Refresh every 5 seconds to get new updates
    const interval = setInterval(() => {
      fetchFiles();
      fetchGraph();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const openFile = async (filename) => {
    try {
      const res = await fetch(`${API_BASE}/wiki/${filename}`);
      const text = await res.text();
      // Remove YAML Frontmatter
      const noFrontmatter = text.replace(/^---[\s\S]*?---\n*/, '');
      // Render [[wikilinks]] nicely
      const processedText = noFrontmatter.replace(/\[\[(.*?)\]\]/g, '[$1](#)');
      setContent(processedText);
      setView('wiki');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-title">LLM Wiki</div>
        <a href="#" className={`nav-link ${view === 'list' || view === 'wiki' ? 'active' : ''}`} onClick={() => setView('list')}>📄 Documents</a>
        <a href="#" className={`nav-link ${view === 'graph' ? 'active' : ''}`} onClick={() => setView('graph')}>🕸️ Knowledge Graph</a>
        
        <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column'}}>
          {files.map(f => (
            <div key={f} className="file-list-item" onClick={() => openFile(f)}>
              {f.replace('.md', '')}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {view === 'list' && (
           <div className="wiki-card">
              <h1 style={{fontSize: '2.5rem', marginBottom: '10px'}}>Welcome to LLM Wiki</h1>
              <p style={{color: 'var(--text-secondary)', fontSize: '1.1rem'}}>
                A unified agentic knowledge base. Select a document from the sidebar to view it, or explore the dynamic Knowledge Graph.
              </p>
           </div>
        )}
        
        {view === 'wiki' && (
          <div className="wiki-card">
            <div 
               className="markdown-body" 
               dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(content)) }} 
            />
          </div>
        )}

        {view === 'graph' && (
          <div className="graph-container">
            <ForceGraph2D
              graphData={graphData}
              nodeLabel="name"
              nodeColor={node => node.group === 1 ? '#38bdf8' : '#fb7185'}
              nodeRelSize={8}
              linkColor={() => 'rgba(255,255,255,0.15)'}
              linkWidth={1.5}
              backgroundColor="#0a0f1d"
              onNodeClick={node => {
                if (node.group === 1) openFile(node.id + '.md');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
