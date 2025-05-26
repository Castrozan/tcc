# Manual Verification Guide

## Quick Verification Commands

### 1. Build the Container

```bash
docker build -t mcp-openapi-test .
```

### 2. Test Container Startup

```bash
# Run for a few seconds to see initialization
timeout 5s docker run --rm mcp-openapi-test
```

**Expected Output:**

```
Registered tool: GET-users (get-usrs)
Registered tool: POST-users (crt-usr)
Registered tool: GET-users-id (get-usr-by-id)
OpenAPI MCP Server running on stdio
```

### 3. Verify Environment Variables

```bash
# Check that environment variables are set correctly
docker run --rm mcp-openapi-test printenv | grep -E "(API_BASE_URL|OPENAPI_SPEC_FROM_STDIN|TRANSPORT_TYPE)"
```

**Expected Output:**

```
API_BASE_URL=https://api.example.com
OPENAPI_SPEC_FROM_STDIN=true
TRANSPORT_TYPE=stdio
```

### 4. Verify Startup Script

```bash
# Check that the startup script exists and is executable
docker run --rm mcp-openapi-test ls -la /app/start-server.sh
```

**Expected Output:**

```
-rwxr-xr-x    1 root     root           XXX /app/start-server.sh
```

### 5. Verify Example Spec is Embedded

```bash
# Check that the example spec file is present
docker run --rm mcp-openapi-test head -5 /app/example-spec.json
```

**Expected Output:**

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Example API",
    "version": "1.0.0",
```

## What This Proves

✅ **No External Dependencies**: The container doesn't try to fetch from `api.example.com`
✅ **Local Spec Embedding**: The OpenAPI spec is packaged within the container
✅ **Stdin Support**: Uses the `--spec-from-stdin` functionality correctly
✅ **Tool Registration**: All API endpoints are registered as MCP tools
✅ **Stdio Transport**: Server runs in stdio mode for MCP communication

## Troubleshooting

If you see errors:

1. **Build fails**: Check that `example-spec.json` exists in the project root
2. **No tools registered**: Verify the OpenAPI spec is valid JSON
3. **Server doesn't start**: Check the startup script permissions and syntax
4. **Environment variables missing**: Verify the ENV statements in Dockerfile

## Integration with MCP Clients

To use this container with an MCP client:

```bash
# Run the container interactively
docker run --rm -i mcp-openapi-test
```

The server will:

- Read the embedded OpenAPI spec via stdin
- Register tools for each API endpoint
- Communicate via stdio protocol
- Be ready to receive MCP requests
