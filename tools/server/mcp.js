import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const WIKI_DIR = path.resolve(__dirname, '../../wiki');

const server = new Server({
    name: "llm-wiki-mcp",
    version: "1.0.0"
}, {
    capabilities: {
        tools: {}
    }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_knowledge_graph",
                description: "Reads the wiki directory and returns a node-link graph representing the document relationships based on [[wikilinks]].",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: []
                }
            }
        ]
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "get_knowledge_graph") {
        try {
            const nodes = [];
            const links = [];
            const nodeSet = new Set();
            
            if (fs.existsSync(WIKI_DIR)) {
                const files = fs.readdirSync(WIKI_DIR).filter(f => f.endsWith('.md'));
                files.forEach(file => {
                    const content = fs.readFileSync(path.join(WIKI_DIR, file), 'utf-8');
                    const parsed = matter(content);
                    const nodeId = file.replace('.md', '');
                    
                    if (!nodeSet.has(nodeId)) {
                        nodes.push({ id: nodeId, name: parsed.data.title || nodeId });
                        nodeSet.add(nodeId);
                    }
                    
                    const linkRegex = /\[\[(.*?)\]\]/g;
                    let match;
                    while ((match = linkRegex.exec(content)) !== null) {
                        const targetId = match[1];
                        if (!nodeSet.has(targetId)) {
                            nodes.push({ id: targetId, name: targetId, isOrphan: true });
                            nodeSet.add(targetId);
                        }
                        links.push({ source: nodeId, target: targetId });
                    }
                });
            }
            return {
                content: [{ type: "text", text: JSON.stringify({ nodes, links }, null, 2) }]
            };
        } catch (e) {
            return {
                content: [{ type: "text", text: `Error generating graph: ${e.message}` }],
                isError: true
            };
        }
    }
    throw new Error("Tool not found");
});

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("LLM Wiki MCP Server running on stdio");
}

run().catch(console.error);
