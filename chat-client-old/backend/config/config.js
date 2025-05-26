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
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // Allow any localhost or 127.0.0.1 origin for development
            if (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/)) {
                return callback(null, true);
            }

            // For production, you might want to be more restrictive
            callback(new Error('Not allowed by CORS'));
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'mcp-session-id'],
        credentials: true
    }
};

export default config; 