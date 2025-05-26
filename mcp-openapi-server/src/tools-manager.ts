import { Tool } from "@modelcontextprotocol/sdk/types.js"
import { OpenAPISpecLoader } from "./openapi-loader"
import { OpenAPIMCPServerConfig } from "./config"
import { OpenAPIV3 } from "openapi-types"

/**
 * Manages the tools available in the MCP server
 */
export class ToolsManager {
  private tools: Map<string, Tool> = new Map()
  private specLoader: OpenAPISpecLoader

  constructor(private config: OpenAPIMCPServerConfig) {
    // Ensure toolsMode has a default value of 'all'
    this.config.toolsMode = this.config.toolsMode || "all"
    this.specLoader = new OpenAPISpecLoader({
      disableAbbreviation: this.config.disableAbbreviation,
    })
  }

  /**
   * Create dynamic discovery meta-tools
   */
  private createDynamicTools(): Map<string, Tool> {
    const dynamicTools = new Map<string, Tool>()

    // LIST-API-ENDPOINTS
    dynamicTools.set("LIST-API-ENDPOINTS", {
      name: "list-api-endpoints",
      description: "List all available API endpoints",
      inputSchema: { type: "object", properties: {} },
    })

    // GET-API-ENDPOINT-SCHEMA
    dynamicTools.set("GET-API-ENDPOINT-SCHEMA", {
      name: "get-api-endpoint-schema",
      description: "Get the JSON schema for a specified API endpoint",
      inputSchema: {
        type: "object",
        properties: {
          endpoint: { type: "string", description: "Endpoint path (e.g. /users/{id})" },
        },
        required: ["endpoint"],
      },
    })

    // INVOKE-API-ENDPOINT
    dynamicTools.set("INVOKE-API-ENDPOINT", {
      name: "invoke-api-endpoint",
      description: "Invoke an API endpoint with provided parameters",
      inputSchema: {
        type: "object",
        properties: {
          endpoint: { type: "string", description: "Endpoint path to invoke" },
          params: {
            type: "object",
            description: "Parameters for the API call",
            properties: {},
          },
        },
        required: ["endpoint"],
      },
    })

    return dynamicTools
  }

  /**
   * Initialize tools from the OpenAPI specification
   */
  async initialize(): Promise<void> {
    const spec = await this.specLoader.loadOpenAPISpec(
      this.config.openApiSpec,
      this.config.specInputMethod,
      this.config.inlineSpecContent,
    )
    // Determine tools loading mode
    if (this.config.toolsMode === "dynamic") {
      // Use dynamic discovery meta-tools
      this.tools = this.createDynamicTools()
      return
    }
    // Load and filter standard tools
    const rawTools = this.specLoader.parseOpenAPISpec(spec)
    const filtered = new Map<string, Tool>()

    // Precompute lowercase filter arrays for better performance
    const includeToolsLower = this.config.includeTools?.map((t) => t.toLowerCase()) || []
    const includeOperationsLower =
      this.config.includeOperations?.map((op) => op.toLowerCase()) || []
    const includeResourcesLower = this.config.includeResources || []
    const includeTagsLower = this.config.includeTags?.map((tag) => tag.toLowerCase()) || []

    // Convert resource paths to lowercase for case-insensitive matching
    const resourcePathsLower = includeResourcesLower.map((res) => ({
      exact: `/${res}`.toLowerCase(),
      prefix: `/${res}/`.toLowerCase(),
    }))

    for (const [toolId, tool] of rawTools.entries()) {
      // includeTools filter
      if (includeToolsLower.length > 0) {
        const toolIdLower = toolId.toLowerCase()
        const toolNameLower = tool.name.toLowerCase()
        if (
          !includeToolsLower.includes(toolIdLower) &&
          !includeToolsLower.includes(toolNameLower)
        ) {
          continue
        }
      }

      // includeOperations filter
      if (includeOperationsLower.length > 0) {
        const { method } = this.parseToolId(toolId)
        if (!includeOperationsLower.includes(method.toLowerCase())) {
          continue
        }
      }

      // includeResources filter
      if (resourcePathsLower.length > 0) {
        const { path } = this.parseToolId(toolId)
        const pathLower = path.toLowerCase()
        // Match exact resource prefix (after leading slash) - case insensitive
        const match = resourcePathsLower.some(
          (res) => pathLower === res.exact || pathLower.startsWith(res.prefix),
        )
        if (!match) continue
      }

      // includeTags filter
      if (includeTagsLower.length > 0) {
        // Attempt to read tags from original spec paths
        const { method, path } = this.parseToolId(toolId)
        const methodLower = method.toLowerCase() as OpenAPIV3.HttpMethods
        const pathItem = spec.paths[path] as OpenAPIV3.PathItemObject | undefined

        if (!pathItem) continue

        // Get the operation for the method (get, post, etc.)
        const opObj = pathItem[methodLower]
        const tags: string[] = Array.isArray(opObj?.tags) ? (opObj.tags as string[]) : []
        if (!tags.some((tag) => includeTagsLower.includes(tag.toLowerCase()))) continue
      }
      filtered.set(toolId, tool)
    }
    this.tools = filtered

    // Log the registered tools
    for (const [toolId, tool] of this.tools.entries()) {
      console.error(`Registered tool: ${toolId} (${tool.name})`)
    }
  }

  /**
   * Get all available tools
   */
  getAllTools(): Tool[] {
    return Array.from(this.tools.values())
  }

  /**
   * Get all available tools with their IDs
   * Returns array of [toolId, tool] pairs
   */
  getToolsWithIds(): [string, Tool][] {
    return Array.from(this.tools.entries())
  }

  /**
   * Find a tool by ID or name
   */
  findTool(idOrName: string): { toolId: string; tool: Tool } | undefined {
    const lowerIdOrName = idOrName.toLowerCase()

    // Try to find by ID first (case-insensitive)
    for (const [toolId, tool] of this.tools.entries()) {
      if (toolId.toLowerCase() === lowerIdOrName) {
        return { toolId, tool }
      }
    }

    // Then try to find by name (case-insensitive)
    for (const [toolId, tool] of this.tools.entries()) {
      if (tool.name.toLowerCase() === lowerIdOrName) {
        return { toolId, tool }
      }
    }

    return undefined
  }

  /**
   * Get the path and method from a tool ID
   */
  parseToolId(toolId: string): { method: string; path: string } {
    const [method, ...pathParts] = toolId.split("-")
    const path = "/" + pathParts.join("/").replace(/-/g, "/")
    return { method, path }
  }
}
