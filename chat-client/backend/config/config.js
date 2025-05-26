import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 3004,
        host: '127.0.0.1'
    },
    mcp: {
        defaultServerUrl: process.env.MCP_SERVER_URL || 'http://localhost:3000/mcp'
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY,
        model: 'gpt-4'
    },
    cors: {
        origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'mcp-session-id'],
        credentials: true
    }
};

export default config; 