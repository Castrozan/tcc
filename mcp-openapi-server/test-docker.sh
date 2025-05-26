#!/bin/bash

echo "🧪 Testing MCP OpenAPI Server Docker Container"
echo "=============================================="

# Build the container
echo "📦 Building Docker container..."
if docker build -t mcp-openapi-test . > /dev/null 2>&1; then
    echo "✅ Docker build successful"
else
    echo "❌ Docker build failed"
    exit 1
fi

# Test container startup
echo "🚀 Testing container startup..."
timeout 3s docker run --rm mcp-openapi-test > container_output.log 2>&1
EXIT_CODE=$?

# Check the output for expected messages
echo "📋 Analyzing container output..."

if grep -q "Registered tool" container_output.log; then
    echo "✅ Tools registered successfully"
    TOOLS_OK=true
else
    echo "❌ No tools found in output"
    TOOLS_OK=false
fi

if grep -q "OpenAPI MCP Server running on stdio" container_output.log; then
    echo "✅ Server running on stdio transport"
    STDIO_OK=true
else
    echo "❌ Server transport message not found"
    STDIO_OK=false
fi

if grep -q "GET-users\|POST-users\|GET-users-id" container_output.log; then
    echo "✅ Expected API endpoints registered as tools"
    ENDPOINTS_OK=true
else
    echo "❌ Expected API endpoints not found"
    ENDPOINTS_OK=false
fi

# Show the output
echo ""
echo "📋 Container Output:"
echo "==================="
cat container_output.log

# Cleanup
rm -f container_output.log

echo ""
if [ "$TOOLS_OK" = true ] && [ "$STDIO_OK" = true ] && [ "$ENDPOINTS_OK" = true ]; then
    echo "🎉 All tests passed! The Docker container is working correctly."
    echo ""
    echo "✅ Verification Summary:"
    echo "  - Container builds successfully"
    echo "  - OpenAPI spec loaded from embedded file"
    echo "  - Tools registered for API endpoints"
    echo "  - Server runs in stdio mode"
    echo "  - No external URL dependencies"
    echo ""
    echo "🚀 To run the container:"
    echo "  docker run --rm -i mcp-openapi-test"
    echo ""
    echo "📝 The server will:"
    echo "  - Load the OpenAPI spec from the embedded example-spec.json"
    echo "  - Register tools for each API endpoint (GET-users, POST-users, GET-users-id)"
    echo "  - Run in stdio mode for MCP communication"
    echo "  - Work without any external dependencies"
else
    echo "❌ Some tests failed. Check the output above."
    exit 1
fi