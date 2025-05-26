import axios, { AxiosInstance, AxiosError } from "axios"
import { Tool } from "@modelcontextprotocol/sdk/types.js"

/**
 * Client for making API calls to the backend service
 */
export class ApiClient {
  private axiosInstance: AxiosInstance
  private toolsMap: Map<string, Tool> = new Map()

  /**
   * Create a new API client
   *
   * @param baseUrl - Base URL for the API
   * @param headers - Optional headers to include with every request
   */
  constructor(
    baseUrl: string,
    private headers: Record<string, string> = {},
  ) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
    })
  }

  /**
   * Set the available tools for the client
   *
   * @param tools - Map of tool ID to tool definition
   */
  setTools(tools: Map<string, Tool>): void {
    this.toolsMap = tools
  }

  /**
   * Get a tool definition by ID
   *
   * @param toolId - The tool ID
   * @returns The tool definition if found
   */
  private getToolDefinition(toolId: string): Tool | undefined {
    return this.toolsMap.get(toolId)
  }

  /**
   * Execute an API call based on the tool ID and parameters
   *
   * @param toolId - The tool ID in format METHOD-path-parts
   * @param params - Parameters for the API call
   * @returns The API response data
   */
  async executeApiCall(toolId: string, params: Record<string, any>): Promise<any> {
    try {
      // Parse method and path from the tool ID
      const { method, path } = this.parseToolId(toolId)

      // Get the tool definition, if available
      const toolDef = this.getToolDefinition(toolId)

      // Interpolate path parameters into the URL and remove them from params
      const paramsCopy: Record<string, any> = { ...params }
      let resolvedPath = path

      // Helper function to escape regex special characters
      const escapeRegExp = (str: string): string => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
      }

      // Handle path parameters
      if (toolDef?.inputSchema?.properties) {
        // Check each parameter to see if it's a path parameter
        for (const [key, value] of Object.entries(paramsCopy)) {
          const paramDef = toolDef.inputSchema.properties[key]
          // Get the parameter location from the extended schema
          const paramDef_any = paramDef as any
          const paramLocation = paramDef_any?.["x-parameter-location"]

          // If it's a path parameter, interpolate it into the URL and remove from params
          if (paramLocation === "path") {
            // Escape key before using it in regex patterns
            const escapedKey = escapeRegExp(key)
            // Try standard OpenAPI and Express-style parameters first
            const paramRegex = new RegExp(`\\{${escapedKey}\\}|:${escapedKey}(?:\\/|$)`, "g")

            // If specific parameter style was found, use it
            if (paramRegex.test(resolvedPath)) {
              resolvedPath = resolvedPath.replace(
                paramRegex,
                (match) => encodeURIComponent(value) + (match.endsWith("/") ? "/" : ""),
              )
            } else {
              // Fall back to the original simple replacement for backward compatibility
              resolvedPath = resolvedPath.replace(`/${key}`, `/${encodeURIComponent(value)}`)
            }
            delete paramsCopy[key]
          }
        }
      } else {
        // Fallback behavior if tool definition is not available
        for (const key of Object.keys(paramsCopy)) {
          const value = paramsCopy[key]
          // Escape key before using it in regex patterns
          const escapedKey = escapeRegExp(key)
          // First try standard OpenAPI and Express-style parameters
          const paramRegex = new RegExp(`\\{${escapedKey}\\}|:${escapedKey}(?:\\/|$)`, "g")

          // If found, replace using regex
          if (paramRegex.test(resolvedPath)) {
            resolvedPath = resolvedPath.replace(
              paramRegex,
              (match) => encodeURIComponent(value) + (match.endsWith("/") ? "/" : ""),
            )
            delete paramsCopy[key]
          }
          // Fall back to original simple replacement for backward compatibility
          else if (resolvedPath.includes(`/${key}`)) {
            resolvedPath = resolvedPath.replace(`/${key}`, `/${encodeURIComponent(value)}`)
            delete paramsCopy[key]
          }
        }
      }

      // Prepare request configuration
      const config: any = {
        method: method.toLowerCase(),
        url: resolvedPath,
        headers: this.headers,
      }

      // Handle parameters based on HTTP method
      if (["get", "delete", "head", "options"].includes(method.toLowerCase())) {
        // For GET-like methods, parameters go in the query string
        config.params = this.processQueryParams(paramsCopy)
      } else {
        // For POST-like methods, parameters go in the request body
        config.data = paramsCopy
      }

      // Execute the request
      const response = await this.axiosInstance(config)
      return response.data
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        throw new Error(
          `API request failed: ${axiosError.message}${
            axiosError.response
              ? ` (${axiosError.response.status}: ${
                  typeof axiosError.response.data === "object"
                    ? JSON.stringify(axiosError.response.data)
                    : axiosError.response.data
                })`
              : ""
          }`,
        )
      }
      throw error
    }
  }

  /**
   * Parse a tool ID into HTTP method and path
   *
   * @param toolId - Tool ID in format METHOD-path-parts
   * @returns Object containing method and path
   */
  private parseToolId(toolId: string): { method: string; path: string } {
    const [method, ...pathParts] = toolId.split("-")
    const path = "/" + pathParts.join("/").replace(/-/g, "/")
    return { method, path }
  }

  /**
   * Process query parameters for GET requests
   * Converts arrays to comma-separated strings
   *
   * @param params - The original parameters
   * @returns Processed parameters
   */
  private processQueryParams(
    params: Record<string, any>,
  ): Record<string, string | number | boolean> {
    const result: Record<string, string | number | boolean> = {}

    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        result[key] = value.join(",")
      } else {
        result[key] = value
      }
    }

    return result
  }
}
