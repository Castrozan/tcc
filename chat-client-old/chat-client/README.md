# 🚀 MCP Chat Client

A modern chat interface that integrates with MCP (Model Context Protocol) servers with real-time communication and comprehensive e2e testing.

## ✨ Features

- 💬 **Interactive Chat Interface** - Clean, modern UI with user/bot message distinction
- 🔗 **MCP Protocol Integration** - Real-time communication with MCP servers via JSON-RPC 2.0
- 🌐 **CORS Proxy** - Built-in proxy server to handle cross-origin requests
- 🔄 **Live Reload** - Automatic browser refresh during development
- 🧪 **E2E Testing** - Comprehensive Playwright test suite
- ⚡ **Hot Reload** - Automatic proxy server restart on code changes

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- MCP Server running on `http://127.0.0.1:3000/mcp`

### Development

Start the development environment (chat client + proxy server):

```bash
npm run dev
```

This command will:
- 🖥️ Start the chat interface at `http://127.0.0.1:5500` with live reload
- 🔗 Start the MCP proxy server at `http://127.0.0.1:3004` with auto-restart
- 🌐 Automatically open the chat in your browser

### Available Scripts

```bash
npm run dev          # Start development environment
npm run proxy        # Start only the proxy server
npm run chat         # Start only the chat client with live reload
npm test             # Run e2e tests
npm start            # Alias for npm run dev
```

## 🏗️ Architecture

```
Chat Client (5500) → Proxy Server (3004) → MCP Server (3000)
     ↓                      ↓                    ↓
 Live Reload          CORS Headers         JSON-RPC 2.0
 Auto Refresh         Request Forward      Tool Execution
```

### Components

- **Chat Client** (`chat.html`) - Frontend interface with MCP integration
- **Proxy Server** (`proxy-server.js`) - CORS-enabled proxy for MCP communication  
- **E2E Tests** (`tests/`) - Playwright test suite for UI validation

## 🔧 Configuration

### MCP Server URL
The proxy forwards requests to `http://127.0.0.1:3000/mcp` by default. 
To change this, edit `proxy-server.js`:

```javascript
const response = await axios({
  // Change this URL to your MCP server
  url: 'http://your-mcp-server:port/mcp',
  // ...
});
```

### CORS Settings  
CORS is configured to allow requests from `http://127.0.0.1:5500`.
To change this, edit the CORS headers in `proxy-server.js`:

```javascript
res.header('Access-Control-Allow-Origin', 'http://your-frontend-url');
```

## 🧪 Testing

Run the comprehensive e2e test suite:

```bash
npm test
```

Tests cover:
- ✅ Interface loading and element visibility
- ✅ Message sending and receiving workflow
- ✅ Empty message handling  
- ✅ Loading state management
- ✅ Auto-scroll behavior
- ✅ Message history preservation

## 📁 Project Structure

```
chat-client/
├── chat.html              # Main chat interface
├── proxy-server.js        # MCP proxy server
├── package.json           # Dependencies and scripts
├── nodemon.json           # Proxy auto-restart config
├── playwright.config.js   # E2E test configuration
├── tests/
│   └── chat.spec.js       # E2E test suite
└── README.md              # This file
```

## 🔄 Development Workflow

1. **Start Development**: `npm run dev`
2. **Make Changes**: Edit `chat.html` or `proxy-server.js` 
3. **See Changes**: Browser auto-refreshes, proxy auto-restarts
4. **Test Changes**: `npm test` to run e2e tests
5. **Deploy**: Ready for production use

## 🚀 Production Deployment

For production, you'll need to:
1. Configure proper MCP server URLs
2. Set up proper CORS policies
3. Use a production-grade proxy (nginx, etc.)
4. Enable HTTPS for secure communication

---

**Happy coding!** 🎉 