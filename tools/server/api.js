import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WIKI_DIR = path.resolve(__dirname, '../../wiki');

const app = express();
app.use(cors());

app.get('/api/wiki', (req, res) => {
    try {
        if (!fs.existsSync(WIKI_DIR)) {
            return res.json([]);
        }
        const files = fs.readdirSync(WIKI_DIR).filter(f => f.endsWith('.md'));
        res.json(files);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/wiki/:name', (req, res) => {
    try {
        const filePath = path.join(WIKI_DIR, req.params.name);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        res.send(content);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/graph', (req, res) => {
    try {
        const nodes = [];
        const links = [];
        const nodeSet = new Set();
        
        if (!fs.existsSync(WIKI_DIR)) {
            return res.json({ nodes, links });
        }
        
        const files = fs.readdirSync(WIKI_DIR).filter(f => f.endsWith('.md'));
        
        files.forEach(file => {
            const content = fs.readFileSync(path.join(WIKI_DIR, file), 'utf-8');
            const parsed = matter(content);
            const nodeId = file.replace('.md', '');
            
            if (!nodeSet.has(nodeId)) {
                nodes.push({ id: nodeId, name: parsed.data.title || nodeId, group: 1 });
                nodeSet.add(nodeId);
            }
            
            const linkRegex = /\[\[(.*?)\]\]/g;
            let match;
            while ((match = linkRegex.exec(content)) !== null) {
                const targetId = match[1];
                if (!nodeSet.has(targetId)) {
                    nodes.push({ id: targetId, name: targetId, group: 2 });
                    nodeSet.add(targetId);
                }
                links.push({ source: nodeId, target: targetId });
            }
        });
        
        res.json({ nodes, links });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Wiki API Server running on http://localhost:${PORT}`);
});
