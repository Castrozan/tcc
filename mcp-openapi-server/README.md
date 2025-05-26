# OpenAPI MCP Server

[![smithery badge](https://smithery.ai/badge/@ivo-toby/mcp-openapi-server)](https://smithery.ai/server/@ivo-toby/mcp-openapi-server)

A Model Context Protocol (MCP) server that exposes OpenAPI endpoints as MCP resources. This server allows Large Language Models to discover and interact with REST APIs defined by OpenAPI specifications through the MCP protocol.

## Overview

This MCP server supports two transport methods:

1. **Stdio Transport** (default): For direct integration with AI systems like Claude Desktop that manage MCP connections through standard input/output.
2. **Streamable HTTP Transport**: For connecting to the server over HTTP, allowing web clients and other HTTP-capable systems to use the MCP protocol.

## Quick Start for Users

### Option 1: Using with Claude Desktop (Stdio Transport)

No need to clone this repository. Simply configure Claude Desktop to use this MCP server:

1. Locate or create your Claude Desktop configuration file:

   - On macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the following configuration:

```json
{
  "mcpServers": {
    "openapi": {
      "command": "npx",
      "args": ["-y", "@ivotoby/openapi-mcp-server"],
      "env": {
        "API_BASE_URL": "https://api.example.com",
        "OPENAPI_SPEC_PATH": "https://api.example.com/openapi.json",
        "API_HEADERS": "Authorization:Bearer token123,X-API-Key:your-api-key"
      }
    }
  }
}
```

3. Replace the environment variables with your actual API configuration:
   - `API_BASE_URL`: The base URL of your API
   - `OPENAPI_SPEC_PATH`: URL or path to your OpenAPI specification
   - `API_HEADERS`: Comma-separated key:value pairs for API authentication headers

### Option 2: Using with HTTP Clients (HTTP Transport)

To use the server with HTTP clients:

1. No installation required! Use npx to run the package directly:

```bash
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --openapi-spec https://api.example.com/openapi.json \
  --headers "Authorization:Bearer token123" \
  --transport http \
  --port 3000
```

2. Interact with the server using HTTP requests:

```bash
# Initialize a session (first request)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":0,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"curl-client","version":"1.0.0"}}}'

# The response includes a Mcp-Session-Id header that you must use for subsequent requests
# and the InitializeResult directly in the POST response body.

# Send a request to list tools
# This also receives its response directly on this POST request.
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Mcp-Session-Id: your-session-id" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Open a streaming connection for other server responses (e.g., tool execution results)
# This uses Server-Sent Events (SSE).
curl -N http://localhost:3000/mcp -H "Mcp-Session-Id: your-session-id"

# Example: Execute a tool (response will arrive on the GET stream)
# curl -X POST http://localhost:3000/mcp \
#  -H "Content-Type: application/json" \
#  -H "Mcp-Session-Id: your-session-id" \
#  -d '{"jsonrpc":"2.0","id":2,"method":"tools/execute","params":{"name":"yourToolName", "arguments": {}}}'

# Terminate the session when done
curl -X DELETE http://localhost:3000/mcp -H "Mcp-Session-Id: your-session-id"
```

## Transport Types

### Stdio Transport (Default)

The stdio transport is designed for direct integration with AI systems like Claude Desktop that manage MCP connections through standard input/output. This is the simplest setup and requires no network configuration.

**When to use**: When integrating with Claude Desktop or other systems that support stdio-based MCP communication.

### Streamable HTTP Transport

The HTTP transport allows the MCP server to be accessed over HTTP, enabling web applications and other HTTP-capable clients to interact with the MCP protocol. It supports session management, streaming responses, and standard HTTP methods.

**Key features**:

- Session management with Mcp-Session-Id header
- HTTP responses for `initialize` and `tools/list` requests are sent synchronously on the POST.
- Other server-to-client messages (e.g., `tools/execute` results, notifications) are streamed over a GET connection using Server-Sent Events (SSE).
- Support for POST/GET/DELETE methods

**When to use**: When you need to expose the MCP server to web clients or systems that communicate over HTTP rather than stdio.

## Configuration Options

The server can be configured through environment variables or command line arguments:

### Environment Variables

- `API_BASE_URL` - Base URL for the API endpoints
- `OPENAPI_SPEC_PATH` - Path or URL to OpenAPI specification
- `OPENAPI_SPEC_FROM_STDIN` - Set to "true" to read OpenAPI spec from standard input
- `OPENAPI_SPEC_INLINE` - Provide OpenAPI spec content directly as a string
- `API_HEADERS` - Comma-separated key:value pairs for API headers
- `SERVER_NAME` - Name for the MCP server (default: "mcp-openapi-server")
- `SERVER_VERSION` - Version of the server (default: "1.0.0")
- `TRANSPORT_TYPE` - Transport type to use: "stdio" or "http" (default: "stdio")
- `HTTP_PORT` - Port for HTTP transport (default: 3000)
- `HTTP_HOST` - Host for HTTP transport (default: "127.0.0.1")
- `ENDPOINT_PATH` - Endpoint path for HTTP transport (default: "/mcp")
- `TOOLS_MODE` - Tools loading mode: "all" (load all endpoint-based tools) or "dynamic" (load only meta-tools) (default: "all")
- `DISABLE_ABBREVIATION` - Disable name optimization (this could throw errors when name is > 64 chars)

### Command Line Arguments

```bash
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --openapi-spec https://api.example.com/openapi.json \
  --headers "Authorization:Bearer token123,X-API-Key:your-api-key" \
  --name "my-mcp-server" \
  --server-version "1.0.0" \
  --transport http \
  --port 3000 \
  --host 127.0.0.1 \
  --path /mcp \
  --disable-abbreviation true
```

## OpenAPI Specification Loading

The MCP server supports multiple methods for loading OpenAPI specifications, providing flexibility for different deployment scenarios:

### 1. URL Loading (Default)

Load the OpenAPI spec from a remote URL:

```bash
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --openapi-spec https://api.example.com/openapi.json
```

### 2. Local File Loading

Load the OpenAPI spec from a local file:

```bash
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --openapi-spec ./path/to/openapi.yaml
```

### 3. Standard Input Loading

Read the OpenAPI spec from standard input (useful for piping or containerized environments):

```bash
# Pipe from file
cat openapi.json | npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --spec-from-stdin

# Pipe from curl
curl -s https://api.example.com/openapi.json | npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --spec-from-stdin

# Using environment variable
export OPENAPI_SPEC_FROM_STDIN=true
echo '{"openapi": "3.0.0", ...}' | npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com
```

### 4. Inline Specification

Provide the OpenAPI spec content directly as a command line argument:

```bash
npx @ivotoby/openapi-mcp-server \
  --api-base-url https://api.example.com \
  --spec-inline '{"openapi": "3.0.0", "info": {"title": "My API", "version": "1.0.0"}, "paths": {}}'

# Using environment variable
export OPENAPI_SPEC_INLINE='{"openapi": "3.0.0", ...}'
npx @ivotoby/openapi-mcp-server --api-base-url https://api.example.com
```

### Supported Formats

All loading methods support both JSON and YAML formats. The server automatically detects the format and parses accordingly.

### Docker and Container Usage

For containerized deployments, you can mount OpenAPI specs or use stdin:

```bash
# Mount local file
docker run -v /path/to/spec:/app/spec.json your-mcp-server \
  --api-base-url https://api.example.com \
  --openapi-spec /app/spec.json

# Use stdin with docker
cat openapi.json | docker run -i your-mcp-server \
  --api-base-url https://api.example.com \
  --spec-from-stdin
```

### Error Handling

The server provides detailed error messages for spec loading failures:

- **URL loading**: HTTP status codes and network errors
- **File loading**: File system errors (not found, permissions, etc.)
- **Stdin loading**: Empty input or read errors
- **Inline loading**: Missing content errors
- **Parsing errors**: Detailed JSON/YAML syntax error messages

### Validation

Only one specification source can be used at a time. The server will validate that exactly one of the following is provided:

- `--openapi-spec` (URL or file path)
- `--spec-from-stdin`
- `--spec-inline`

If multiple sources are specified, the server will exit with an error message.

### OpenAPI Schema Processing

#### Reference Resolution

This MCP server implements robust OpenAPI reference (`$ref`) resolution to ensure accurate representation of API schemas:

- **Parameter References**: Fully resolves `$ref` pointers to parameter components in the OpenAPI spec
- **Schema References**: Handles nested schema references within parameters and request bodies
- **Recursive References**: Prevents infinite loops by detecting and handling circular references
- **Nested Properties**: Preserves complex nested object and array structures with all their attributes

### Input Schema Composition

The server intelligently merges parameters and request bodies into a unified input schema for each tool:

- **Parameters + Request Body Merging**: Combines path, query, and body parameters into a single schema
- **Collision Handling**: Resolves naming conflicts by prefixing body properties that conflict with parameter names
- **Type Preservation**: Maintains the original type information for all schema elements
- **Metadata Retention**: Preserves descriptions, formats, defaults, enums, and other schema attributes

### Complex Schema Support

The MCP server handles various OpenAPI schema complexities:

- **Primitive Type Bodies**: Wraps non-object request bodies in a "body" property
- **Object Bodies**: Flattens object properties into the tool's input schema
- **Array Bodies**: Properly handles array schemas with their nested item definitions
- **Required Properties**: Tracks and preserves which parameters and properties are required

## Tool Loading & Filtering Options

Based on the Stainless article "What We Learned Converting Complex OpenAPI Specs to MCP Servers" (https://www.stainless.com/blog/what-we-learned-converting-complex-openapi-specs-to-mcp-servers), the following flags were added to control which API endpoints (tools) are loaded:

- `--tools <all|dynamic>`: Choose to load all tools (default) or only dynamic meta-tools (`list-api-endpoints`, `get-api-endpoint-schema`, `invoke-api-endpoint`).
- `--tool <toolId>`: Import only specified tool IDs or names. Can be used multiple times.
- `--tag <tag>`: Import only tools with the specified OpenAPI tag. Can be used multiple times.
- `--resource <resource>`: Import only tools under the specified resource path prefixes. Can be used multiple times.
- `--operation <method>`: Import only tools for the specified HTTP methods (get, post, etc). Can be used multiple times.

**Examples:**

```bash
# Load only dynamic meta-tools
npx @ivotoby/openapi-mcp-server --api-base-url https://api.example.com --openapi-spec https://api.example.com/openapi.json --tools dynamic

# Load only the GET /users endpoint tool
npx @ivotoby/openapi-mcp-server --api-base-url https://api.example.com --openapi-spec https://api.example.com/openapi.json --tool GET-users

# Load tools tagged with "user" under the "/users" resource
npx @ivotoby/openapi-mcp-server --api-base-url https://api.example.com --openapi-spec https://api.example.com/openapi.json --tag user --resource users

# Load only POST operations
npx @ivotoby/openapi-mcp-server --api-base-url https://api.example.com --openapi-spec https://api.example.com/openapi.json --operation post
```

## Security Considerations

- The HTTP transport validates Origin headers to prevent DNS rebinding attacks
- By default, HTTP transport only binds to localhost (127.0.0.1)
- If exposing to other hosts, consider implementing additional authentication

## Debugging

To see debug logs:

1. When using stdio transport with Claude Desktop:

   - Logs appear in the Claude Desktop logs

2. When using HTTP transport:
   ```bash
   npx @ivotoby/openapi-mcp-server --transport http &2>debug.log
   ```

## For Developers

### Development Tools

- `npm run build` - Builds the TypeScript source
- `npm run clean` - Removes build artifacts
- `npm run typecheck` - Runs TypeScript type checking
- `npm run lint` - Runs ESLint
- `npm run dev` - Watches source files and rebuilds on changes
- `npm run inspect-watch` - Runs the inspector with auto-reload on changes

### Development Workflow

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development environment: `npm run inspect-watch`
4. Make changes to the TypeScript files in `src/`
5. The server will automatically rebuild and restart

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting: `npm run typecheck && npm run lint`
5. Submit a pull request

## FAQ

**Q: What is a "tool"?**
A: A tool corresponds to a single API endpoint derived from your OpenAPI specification, exposed as an MCP resource.

**Q: How do I filter which tools are loaded?**
A: Use the `--tool`, `--tag`, `--resource`, and `--operation` flags, or set `TOOLS_MODE=dynamic` for meta-tools only.

**Q: When should I use dynamic mode?**
A: Dynamic mode provides meta-tools (`list-api-endpoints`, `get-api-endpoint-schema`, `invoke-api-endpoint`) to inspect and interact with endpoints without preloading all operations, which is useful for large or changing APIs.

**Q: How do I specify custom headers for API requests?**
A: Use the `--headers` flag or `API_HEADERS` environment variable with `key:value` pairs separated by commas.

**Q: Which transport methods are supported?**
A: The server supports stdio transport (default) for integration with AI systems and HTTP transport (with streaming via SSE) for web clients.

**Q: How does the server handle complex OpenAPI schemas with references?**
A: The server fully resolves `$ref` references in parameters and schemas, preserving nested structures, default values, and other attributes. See the "OpenAPI Schema Processing" section for details on reference resolution and schema composition.

**Q: What happens when parameter names conflict with request body properties?**
A: The server detects naming conflicts and automatically prefixes body property names with `body_` to avoid collisions, ensuring all properties are accessible.

**Q: Where can I find development and contribution guidelines?**
A: See the "For Developers" section above for commands (`npm run build`, `npm run dev`, etc) and pull request workflow.

## License

MIT
