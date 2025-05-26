// MCP Client Manager using StreamableHTTPClientTransport (following working code pattern)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class MCPClientManager {
    constructor() {
        this.clients = new Map();
        this.conversationHistories = new Map();
    }

    async createSession(mcpServerUrl = 'http://localhost:3000/mcp') {
        try {
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Import MCP SDK modules dynamically from correct paths
            const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
            const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');

            console.log(`[MCPClientManager] Creating MCP client transport for URL: ${mcpServerUrl}`);

            // Create MCP client transport without sessionId first (as in working code)
            const transport = new StreamableHTTPClientTransport(
                new URL(mcpServerUrl)
            );

            // Create MCP client
            const client = new Client(
                {
                    name: "chat-client",
                    version: "1.0.0"
                },
                {
                    capabilities: {}
                }
            );

            console.log(`[MCPClientManager] Connecting client to transport...`);

            // Connect the client to the transport
            await client.connect(transport);

            console.log(`[MCPClientManager] Client connected successfully`);

            // Store the client for this session (using our generated session ID)
            this.clients.set(sessionId, client);

            // Initialize conversation history for this session
            this.conversationHistories.set(sessionId, []);

            // Get available tools
            console.log(`[MCPClientManager] Listing available tools...`);
            const toolsResponse = await client.listTools();
            console.log(`[MCPClientManager] Tools response:`, toolsResponse);

            return {
                sessionId,
                client,
                capabilities: client.getServerCapabilities(),
                tools: toolsResponse.tools
            };

        } catch (error) {
            console.error('[MCPClientManager] Session creation error:', error);
            throw new Error(`Failed to create MCP session: ${error.message}`);
        }
    }

    getClient(sessionId) {
        return this.clients.get(sessionId);
    }

    isSessionFallback(sessionId) {
        return sessionId && sessionId.startsWith('fallback_');
    }

    async getTools(sessionId) {
        // Handle fallback sessions (no MCP connection)
        if (this.isSessionFallback(sessionId)) {
            console.log(`[MCPClientManager] Session ${sessionId} is in fallback mode, no tools available`);
            return [];
        }

        const client = this.getClient(sessionId);
        if (!client) {
            throw new Error('Invalid session ID');
        }

        try {
            console.log(`[MCPClientManager] Getting tools for session ${sessionId}`);
            const toolsResponse = await client.listTools();
            return toolsResponse.tools;
        } catch (error) {
            console.error('[MCPClientManager] Failed to get tools:', error);
            throw new Error(`Failed to get tools: ${error.message}`);
        }
    }

    async callTool(sessionId, toolName, arguments_) {
        // Handle fallback sessions (no MCP connection)
        if (this.isSessionFallback(sessionId)) {
            throw new Error(`Tool "${toolName}" is not available - MCP server connection failed`);
        }

        const client = this.getClient(sessionId);
        if (!client) {
            throw new Error('Invalid session ID');
        }

        try {
            console.log(`[MCPClientManager] Calling tool ${toolName} with arguments:`, arguments_);

            // Use the MCP client's callTool method (following working code pattern)
            const result = await client.callTool({
                name: toolName,
                arguments: arguments_
            });

            console.log(`[MCPClientManager] Tool ${toolName} result:`, result);
            return result;
        } catch (error) {
            console.error(`[MCPClientManager] Tool execution error for ${toolName}:`, error);
            throw new Error(`Tool execution failed: ${error.message}`);
        }
    }

    async closeSession(sessionId) {
        const client = this.getClient(sessionId);
        if (client) {
            try {
                console.log(`[MCPClientManager] Closing session ${sessionId}`);
                await client.close();
            } catch (error) {
                console.error('Error closing MCP client:', error);
            }
            this.clients.delete(sessionId);
        }

        // Also clean up conversation history
        this.conversationHistories.delete(sessionId);
    }

    getSessionInfo(sessionId) {
        // Handle fallback sessions (no MCP connection)
        if (this.isSessionFallback(sessionId)) {
            return {
                sessionId,
                capabilities: {},
                connected: false,
                fallbackMode: true,
                error: 'MCP server connection failed'
            };
        }

        const client = this.getClient(sessionId);
        if (!client) {
            return null;
        }

        return {
            sessionId,
            capabilities: client.getServerCapabilities(),
            connected: true,
            fallbackMode: false
        };
    }
}

export default MCPClientManager; 