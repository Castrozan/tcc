import express from 'express';
import config from './backend/config/config.js';
import MCPClientManager from './backend/modules/mcp-client-manager.js';
import ConversationManager from './backend/modules/conversation-manager.js';

class ChatServer {
    constructor() {
        this.app = express();
        this.mcpClientManager = new MCPClientManager();

        // Initialize conversation manager with OpenAI API key
        if (!config.openai.apiKey) {
            console.error('OPENAI_API_KEY environment variable is required');
            process.exit(1);
        }
        this.conversationManager = new ConversationManager(config.openai.apiKey, this.mcpClientManager);

        this.setupMiddleware();
        this.setupRoutes();
    }

    setupMiddleware() {
        // CORS configuration
        this.app.use((req, res, next) => {
            const origin = req.headers.origin;

            // Use the origin function from config to check if origin is allowed
            if (typeof config.cors.origin === 'function') {
                config.cors.origin(origin, (err, allowed) => {
                    if (!err && allowed) {
                        res.header('Access-Control-Allow-Origin', origin);
                    }
                });
            } else if (Array.isArray(config.cors.origin) && config.cors.origin.includes(origin)) {
                // Fallback for array-based configuration
                res.header('Access-Control-Allow-Origin', origin);
            }

            res.header('Access-Control-Allow-Methods', config.cors.methods.join(', '));
            res.header('Access-Control-Allow-Headers', config.cors.allowedHeaders.join(', '));
            res.header('Access-Control-Allow-Credentials', config.cors.credentials.toString());

            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });

        this.app.use(express.json());

        // Request logging
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
    }

    setupRoutes() {
        // MCP session initialization
        this.app.post('/mcp/initialize', async (req, res) => {
            try {
                console.log('[Server] Initializing MCP session...');
                const { mcpServerUrl, mcpServerUrls } = req.body;

                // Support both single URL (backward compatibility) and multiple URLs
                let serverUrls;
                if (mcpServerUrls && Array.isArray(mcpServerUrls)) {
                    serverUrls = mcpServerUrls;
                } else if (mcpServerUrl) {
                    serverUrls = [mcpServerUrl];
                } else {
                    serverUrls = [config.mcp.defaultServerUrl];
                }

                try {
                    const sessionData = await this.mcpClientManager.createSession(serverUrls);
                    console.log('[Server] MCP session created:', {
                        sessionId: sessionData.sessionId,
                        serverCount: sessionData.servers.length,
                        connectedServers: sessionData.servers.filter(s => s.status === 'connected').length,
                        totalTools: sessionData.tools.length
                    });

                    res.json({
                        success: true,
                        sessionId: sessionData.sessionId,
                        servers: sessionData.servers,
                        tools: sessionData.tools,
                        capabilities: sessionData.capabilities,
                        serverUrls: serverUrls
                    });
                } catch (mcpError) {
                    console.warn('[Server] MCP connection failed, continuing without MCP:', mcpError.message);

                    // Generate a fallback session ID for non-MCP operations
                    const fallbackSessionId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                    res.json({
                        success: false,
                        sessionId: fallbackSessionId,
                        servers: [],
                        tools: [],
                        capabilities: {},
                        serverUrls: serverUrls,
                        error: `MCP servers unavailable: ${mcpError.message}`,
                        fallbackMode: true
                    });
                }
            } catch (error) {
                console.error('[Server] MCP initialization failed:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Chat endpoint for LLM-powered conversations
        this.app.post('/chat', async (req, res) => {
            try {
                const { message, sessionId } = req.body;

                if (!sessionId) {
                    return res.status(400).json({ error: 'sessionId is required' });
                }

                if (!message) {
                    return res.status(400).json({ error: 'message is required' });
                }

                console.log(`[Server] Processing chat message for session ${sessionId}:`, message);

                // Process the message through the conversation manager
                const response = await this.conversationManager.processUserMessage(sessionId, message);

                console.log(`[Server] Chat response for session ${sessionId}:`, response);

                res.json({ response });

            } catch (error) {
                console.error('[Server] Chat processing failed:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Get session info
        this.app.get('/mcp/session/:sessionId', (req, res) => {
            try {
                const { sessionId } = req.params;
                const sessionInfo = this.mcpClientManager.getSessionInfo(sessionId);

                if (!sessionInfo) {
                    return res.status(404).json({ error: 'Session not found' });
                }

                res.json(sessionInfo);
            } catch (error) {
                console.error('[Server] Failed to get session info:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Get conversation history
        this.app.get('/chat/history/:sessionId', (req, res) => {
            try {
                const { sessionId } = req.params;
                const history = this.conversationManager.getConversationHistory(sessionId);
                res.json({ history });
            } catch (error) {
                console.error('[Server] Failed to get conversation history:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Clear conversation history
        this.app.delete('/chat/history/:sessionId', (req, res) => {
            try {
                const { sessionId } = req.params;
                this.conversationManager.clearConversation(sessionId);
                res.json({ message: 'Conversation cleared' });
            } catch (error) {
                console.error('[Server] Failed to clear conversation:', error);
                res.status(500).json({ error: error.message });
            }
        });

        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            });
        });
    }

    start() {
        this.app.listen(config.server.port, config.server.host, () => {
            console.log(`[Server] Chat server running on http://${config.server.host}:${config.server.port}`);
            console.log(`[Server] Health check: http://${config.server.host}:${config.server.port}/health`);
            console.log(`[Server] MCP server URL: ${config.mcp.defaultServerUrl}`);
        });
    }
}

// Start the server
const server = new ChatServer();
server.start(); 