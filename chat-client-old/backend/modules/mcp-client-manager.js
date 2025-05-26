// MCP Client Manager using StreamableHTTPClientTransport (following working code pattern)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

class MCPClientManager {
    constructor() {
        this.sessions = new Map(); // sessionId → { servers: [{ id, url, client, tools }] }
        this.conversationHistories = new Map();
    }

    async createSession(mcpServerUrls = ['http://localhost:3000/mcp']) {
        try {
            const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            // Ensure mcpServerUrls is an array
            const serverUrls = Array.isArray(mcpServerUrls) ? mcpServerUrls : [mcpServerUrls];

            const servers = [];
            const allTools = [];
            let hasSuccessfulConnection = false;

            // Try to connect to each server
            for (let i = 0; i < serverUrls.length; i++) {
                const serverUrl = serverUrls[i];
                const serverId = `server${i + 1}`;

                try {
                    console.log(`[MCPClientManager] Connecting to server ${serverId}: ${serverUrl}`);

                    // Import MCP SDK modules dynamically from correct paths
                    const { Client } = await import('@modelcontextprotocol/sdk/client/index.js');
                    const { StreamableHTTPClientTransport } = await import('@modelcontextprotocol/sdk/client/streamableHttp.js');

                    // Create MCP client transport
                    const transport = new StreamableHTTPClientTransport(new URL(serverUrl));

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

                    // Connect the client to the transport
                    await client.connect(transport);
                    console.log(`[MCPClientManager] Server ${serverId} connected successfully`);

                    // Get available tools
                    const toolsResponse = await client.listTools();

                    // Prefix tools with server ID to avoid conflicts
                    const prefixedTools = toolsResponse.tools.map(tool => ({
                        ...tool,
                        name: `${serverId}__${tool.name}`,
                        originalName: tool.name,
                        serverId: serverId
                    }));

                    servers.push({
                        id: serverId,
                        url: serverUrl,
                        client: client,
                        tools: prefixedTools,
                        status: 'connected'
                    });

                    allTools.push(...prefixedTools);
                    hasSuccessfulConnection = true;

                } catch (error) {
                    console.warn(`[MCPClientManager] Failed to connect to server ${serverId} (${serverUrl}):`, error.message);
                    servers.push({
                        id: serverId,
                        url: serverUrl,
                        client: null,
                        tools: [],
                        status: 'failed',
                        error: error.message
                    });
                }
            }

            // Store the session data
            this.sessions.set(sessionId, { servers });
            this.conversationHistories.set(sessionId, []);

            if (!hasSuccessfulConnection) {
                throw new Error('Failed to connect to any MCP servers');
            }

            return {
                sessionId,
                servers,
                tools: allTools,
                capabilities: servers.find(s => s.client)?.client.getServerCapabilities() || {}
            };

        } catch (error) {
            console.error('[MCPClientManager] Session creation error:', error);
            throw new Error(`Failed to create MCP session: ${error.message}`);
        }
    }

    getClient(sessionId, serverId = null) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        if (serverId) {
            const server = session.servers.find(s => s.id === serverId);
            return server?.client || null;
        }

        // Return first available client if no serverId specified
        const connectedServer = session.servers.find(s => s.client);
        return connectedServer?.client || null;
    }

    getServerFromToolName(sessionId, toolName) {
        const session = this.sessions.get(sessionId);
        if (!session) return null;

        // Extract server ID from prefixed tool name (e.g., "server1__toolName" → "server1")
        const [serverId] = toolName.split('__');
        return session.servers.find(s => s.id === serverId);
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

        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new Error('Invalid session ID');
        }

        // Return all tools from all connected servers
        const allTools = [];
        session.servers.forEach(server => {
            if (server.tools) {
                allTools.push(...server.tools);
            }
        });

        return allTools;
    }

    async callTool(sessionId, toolName, arguments_) {
        // Handle fallback sessions (no MCP connection)
        if (this.isSessionFallback(sessionId)) {
            throw new Error(`Tool "${toolName}" is not available - MCP server connection failed`);
        }

        const server = this.getServerFromToolName(sessionId, toolName);
        if (!server || !server.client) {
            throw new Error(`Server for tool "${toolName}" not found or not connected`);
        }

        try {
            console.log(`[MCPClientManager] Calling tool ${toolName} on ${server.id} with arguments:`, arguments_);

            // Extract original tool name (remove server prefix)
            const originalToolName = toolName.split('__')[1];

            // Use the MCP client's callTool method
            const result = await server.client.callTool({
                name: originalToolName,
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
        const session = this.sessions.get(sessionId);
        if (session) {
            // Close all server connections
            for (const server of session.servers) {
                if (server.client) {
                    try {
                        console.log(`[MCPClientManager] Closing connection to ${server.id}`);
                        await server.client.close();
                    } catch (error) {
                        console.error(`Error closing MCP client for ${server.id}:`, error);
                    }
                }
            }
            this.sessions.delete(sessionId);
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

        const session = this.sessions.get(sessionId);
        if (!session) {
            return null;
        }

        const connectedServers = session.servers.filter(s => s.client);

        return {
            sessionId,
            servers: session.servers.map(s => ({
                id: s.id,
                url: s.url,
                status: s.status,
                toolCount: s.tools.length,
                error: s.error
            })),
            capabilities: connectedServers[0]?.client?.getServerCapabilities() || {},
            connected: connectedServers.length > 0,
            fallbackMode: false
        };
    }
}

export default MCPClientManager; 