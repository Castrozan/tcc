import OpenAI from 'openai';

class ConversationManager {
    constructor(apiKey, mcpClientManager) {
        this.openai = new OpenAI({ apiKey });
        this.mcpClientManager = mcpClientManager;
        this.conversations = new Map();
    }

    getConversation(sessionId) {
        if (!this.conversations.has(sessionId)) {
            this.conversations.set(sessionId, [
                {
                    role: 'system',
                    content: 'You are a helpful assistant with access to various tools. Use them when needed to answer user questions. Be conversational and helpful.'
                }
            ]);
        }
        return this.conversations.get(sessionId);
    }

    addMessage(sessionId, role, content) {
        const conversation = this.getConversation(sessionId);
        conversation.push({ role, content });
    }

    async processUserMessage(sessionId, userMessage) {
        try {
            // Add user message to conversation
            this.addMessage(sessionId, 'user', userMessage);

            let tools = [];
            let openaiTools = [];

            // Try to get available tools for this session, but don't fail if MCP is unavailable
            try {
                tools = await this.mcpClientManager.getTools(sessionId);
                console.log(`[ConversationManager] Available tools for session ${sessionId}:`, tools.map(t => t.name));

                // Convert MCP tools to OpenAI function format
                openaiTools = this.convertMCPToolsToOpenAI(tools);
                console.log(`[ConversationManager] Converted tools for OpenAI:`, JSON.stringify(openaiTools, null, 2));
            } catch (toolError) {
                console.warn(`[ConversationManager] Could not get tools for session ${sessionId}, continuing without MCP tools:`, toolError.message);
                // Check if this is a fallback session (no MCP)
                if (sessionId.startsWith('fallback_')) {
                    console.log(`[ConversationManager] Session ${sessionId} is in fallback mode, no MCP tools available`);
                }
            }

            // Get conversation history
            const conversation = this.getConversation(sessionId);

            // Call OpenAI with conversation and tools (if available)
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: conversation,
                tools: openaiTools.length > 0 ? openaiTools : undefined,
                tool_choice: openaiTools.length > 0 ? 'auto' : undefined
            });

            const assistantMessage = response.choices[0].message;
            console.log(`[ConversationManager] OpenAI response:`, {
                content: assistantMessage.content,
                tool_calls: assistantMessage.tool_calls ? assistantMessage.tool_calls.length : 0
            });

            // Check if the model wants to use tools and tools are available
            if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0 && tools.length > 0) {
                return await this.handleToolCalls(sessionId, assistantMessage, tools);
            }

            // No tool calls or no tools available, just add the assistant message and return
            this.addMessage(sessionId, 'assistant', assistantMessage.content);
            return assistantMessage.content;

        } catch (error) {
            console.error('[ConversationManager] Error processing message:', error);
            throw new Error(`Failed to process message: ${error.message}`);
        }
    }

    async handleToolCalls(sessionId, assistantMessage, mcpTools) {
        try {
            console.log(`[ConversationManager] Handling ${assistantMessage.tool_calls.length} tool calls`);

            // Add the assistant message with tool calls (must include tool_calls property)
            const conversation = this.getConversation(sessionId);
            conversation.push({
                role: 'assistant',
                content: assistantMessage.content || null,
                tool_calls: assistantMessage.tool_calls
            });

            const toolResults = [];

            // Execute each tool call
            for (const toolCall of assistantMessage.tool_calls) {
                const toolName = toolCall.function.name;
                const toolArguments = JSON.parse(toolCall.function.arguments);

                console.log(`[ConversationManager] Executing tool: ${toolName} with args:`, toolArguments);

                try {
                    // Execute the tool via MCP
                    const result = await this.mcpClientManager.callTool(sessionId, toolName, toolArguments);
                    console.log(`[ConversationManager] Tool ${toolName} result:`, result);

                    // Format the tool result for OpenAI
                    const formattedResult = this.formatToolResult(result);
                    toolResults.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        content: formattedResult
                    });

                } catch (toolError) {
                    console.error(`[ConversationManager] Tool ${toolName} failed:`, toolError);
                    toolResults.push({
                        tool_call_id: toolCall.id,
                        role: 'tool',
                        content: `Error executing ${toolName}: ${toolError.message}`
                    });
                }
            }

            // Add tool results to conversation (these must come after the assistant message with tool_calls)
            toolResults.forEach(result => {
                conversation.push({
                    role: result.role,
                    content: result.content,
                    tool_call_id: result.tool_call_id
                });
            });

            // Get final response from OpenAI with tool results
            const finalResponse = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: conversation
            });

            const finalMessage = finalResponse.choices[0].message.content;
            this.addMessage(sessionId, 'assistant', finalMessage);

            return finalMessage;

        } catch (error) {
            console.error('[ConversationManager] Error handling tool calls:', error);
            throw new Error(`Failed to handle tool calls: ${error.message}`);
        }
    }

    convertMCPToolsToOpenAI(mcpTools) {
        return mcpTools.map(tool => ({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.inputSchema
            }
        }));
    }

    formatToolResult(result) {
        if (result.content && Array.isArray(result.content)) {
            return result.content.map(item => {
                if (item.type === 'text') {
                    return item.text;
                }
                return JSON.stringify(item);
            }).join('\n');
        }

        if (typeof result === 'string') {
            return result;
        }

        return JSON.stringify(result, null, 2);
    }

    clearConversation(sessionId) {
        this.conversations.delete(sessionId);
    }

    getConversationHistory(sessionId) {
        return this.getConversation(sessionId);
    }
}

export default ConversationManager; 