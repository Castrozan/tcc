import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import axios from "axios"
import { ApiClient } from "../src/api-client"

// Mock axios
vi.mock("axios")

describe("ApiClient", () => {
  let apiClient: ApiClient
  let mockAxiosInstance: any

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup mock axios instance
    mockAxiosInstance = vi.fn().mockResolvedValue({ data: { result: "success" } })
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any)

    // Create ApiClient instance
    apiClient = new ApiClient("https://api.example.com", { "X-API-Key": "test-key" })
  })

  describe("constructor", () => {
    it("should create axios instance with correct base URL", () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "https://api.example.com/",
      })
    })

    it("should append trailing slash to base URL if missing", () => {
      new ApiClient("https://api.example.com")
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "https://api.example.com/",
      })
    })
  })

  describe("executeApiCall", () => {
    it("should make GET request with correct parameters", async () => {
      await apiClient.executeApiCall("GET-users-list", { page: 1, limit: 10 })

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/users/list",
        headers: { "X-API-Key": "test-key" },
        params: { page: 1, limit: 10 },
      })
    })

    it("should make POST request with correct body", async () => {
      await apiClient.executeApiCall("POST-users-create", {
        name: "John",
        email: "john@example.com",
      })

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "post",
        url: "/users/create",
        headers: { "X-API-Key": "test-key" },
        data: { name: "John", email: "john@example.com" },
      })
    })

    it("should convert array parameters to comma-separated strings for GET requests", async () => {
      await apiClient.executeApiCall("GET-users-search", { tags: ["admin", "active"] })

      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/users/search",
        headers: { "X-API-Key": "test-key" },
        params: { tags: "admin,active" },
      })
    })

    it("should return response data on successful request", async () => {
      const result = await apiClient.executeApiCall("GET-users-list", {})
      expect(result).toEqual({ result: "success" })
    })

    it("should handle axios errors properly", async () => {
      const axiosError = new Error("Request failed") as any
      axiosError.response = {
        status: 404,
        data: { error: "Not found" },
      }

      mockAxiosInstance.mockRejectedValueOnce(axiosError)
      vi.mocked(axios.isAxiosError).mockReturnValueOnce(true)

      await expect(apiClient.executeApiCall("GET-users-list", {})).rejects.toThrow(
        'API request failed: Request failed (404: {"error":"Not found"})',
      )
    })

    it("should handle non-axios errors", async () => {
      const error = new Error("Network error")
      mockAxiosInstance.mockRejectedValueOnce(error)
      vi.mocked(axios.isAxiosError).mockReturnValueOnce(false)

      await expect(apiClient.executeApiCall("GET-users-list", {})).rejects.toThrow("Network error")
    })

    it("should replace path parameters in URL correctly and remove them from query parameters", async () => {
      await apiClient.executeApiCall("GET-pet-petId", { petId: 1, filter: "all" })
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/pet/1",
        headers: { "X-API-Key": "test-key" },
        params: { filter: "all" },
      })
    })

    it("should handle multiple path parameters correctly", async () => {
      await apiClient.executeApiCall("GET-store-order-orderId-item-itemId", {
        orderId: 123,
        itemId: 456,
        format: "json",
      })
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/store/order/123/item/456",
        headers: { "X-API-Key": "test-key" },
        params: { format: "json" },
      })
    })

    it("should respect parameter location from OpenAPI spec when available", async () => {
      // Create a mock tool definition with proper OpenAPI parameter locations
      const mockTool = {
        name: "get-user-by-id",
        description: "Get user by ID",
        inputSchema: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "User ID",
              "x-parameter-location": "path",
            },
            fields: {
              type: "string",
              description: "Fields to return",
              "x-parameter-location": "query",
            },
          },
        },
      }

      // Set up the tool in the client
      const toolsMap = new Map()
      toolsMap.set("GET-user-userId", mockTool)
      apiClient.setTools(toolsMap)

      // Execute the call with both path and query params
      await apiClient.executeApiCall("GET-user-userId", {
        userId: "user123",
        fields: "name,email",
      })

      // Verify the correct URL was constructed and params sent
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/user/user123",
        headers: { "X-API-Key": "test-key" },
        params: { fields: "name,email" },
      })
    })

    it("should handle query parameters that match path segments but are not path parameters", async () => {
      // Create a mock tool that has a segment name that could be confused with a query param
      const mockTool = {
        name: "search-results",
        description: "Search results",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
              "x-parameter-location": "query",
            },
            results: {
              type: "string",
              description: "Result format",
              "x-parameter-location": "query",
            },
          },
        },
      }

      // Set up the tool in the client
      const toolsMap = new Map()
      toolsMap.set("GET-search-results", mockTool)
      apiClient.setTools(toolsMap)

      // Execute with a param that matches a path segment but is not a path param
      await apiClient.executeApiCall("GET-search-results", {
        query: "test",
        results: "json",
      })

      // Verify both params were sent as query params, not substituted into path
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/search/results",
        headers: { "X-API-Key": "test-key" },
        params: { query: "test", results: "json" },
      })
    })

    it("should handle OpenAPI-style path parameters with curly braces", async () => {
      // Create a mock tool with OpenAPI-style parameter in path
      const mockTool = {
        name: "get-user-by-id",
        description: "Get user by ID",
        inputSchema: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "User ID",
              "x-parameter-location": "path",
            },
          },
        },
      }

      // Set up the tool in the client and mock parseToolId to return path with {userId}
      const toolsMap = new Map()
      toolsMap.set("GET-user-userId", mockTool)
      apiClient.setTools(toolsMap)

      // Mock the parseToolId method to return a path with curly braces format
      const originalParseToolId = (apiClient as any).parseToolId
      ;(apiClient as any).parseToolId = vi.fn().mockReturnValue({
        method: "get",
        path: "/user/{userId}",
      })

      // Execute the call
      await apiClient.executeApiCall("GET-user-userId", { userId: "user123" })

      // Verify the correct URL was constructed
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/user/user123",
        headers: { "X-API-Key": "test-key" },
        params: {},
      })

      // Restore original parseToolId
      ;(apiClient as any).parseToolId = originalParseToolId
    })

    it("should handle Express-style path parameters with colon prefix", async () => {
      // Create a mock tool with Express-style parameter in path
      const mockTool = {
        name: "get-user-by-id",
        description: "Get user by ID",
        inputSchema: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              description: "User ID",
              "x-parameter-location": "path",
            },
          },
        },
      }

      // Set up the tool in the client and mock parseToolId to return path with :userId
      const toolsMap = new Map()
      toolsMap.set("GET-user-userId", mockTool)
      apiClient.setTools(toolsMap)

      // Mock the parseToolId method to return a path with Express format
      const originalParseToolId = (apiClient as any).parseToolId
      ;(apiClient as any).parseToolId = vi.fn().mockReturnValue({
        method: "get",
        path: "/user/:userId",
      })

      // Execute the call
      await apiClient.executeApiCall("GET-user-userId", { userId: "user123" })

      // Verify the correct URL was constructed
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/user/user123",
        headers: { "X-API-Key": "test-key" },
        params: {},
      })

      // Restore original parseToolId
      ;(apiClient as any).parseToolId = originalParseToolId
    })

    it("should properly escape regex special characters in parameter keys", async () => {
      // Create a mock tool with a parameter key that contains regex special characters
      const mockTool = {
        name: "get-data-with-special-param",
        description: "Get data with a parameter that has special regex characters",
        inputSchema: {
          type: "object",
          properties: {
            "param.with*special+chars": {
              // Parameter with regex special characters
              type: "string",
              description: "Parameter with special characters",
              "x-parameter-location": "path",
            },
          },
        },
      }

      // Set up the tool in the client
      const toolsMap = new Map()
      toolsMap.set("GET-data-param", mockTool)
      apiClient.setTools(toolsMap)

      // Mock the parseToolId method to return a path with special parameter
      const originalParseToolId = (apiClient as any).parseToolId
      ;(apiClient as any).parseToolId = vi.fn().mockReturnValue({
        method: "get",
        path: "/data/{param.with*special+chars}",
      })

      // Execute the call
      await apiClient.executeApiCall("GET-data-param", { "param.with*special+chars": "value123" })

      // Verify the correct URL was constructed
      expect(mockAxiosInstance).toHaveBeenCalledWith({
        method: "get",
        url: "/data/value123",
        headers: { "X-API-Key": "test-key" },
        params: {},
      })

      // Restore original parseToolId
      ;(apiClient as any).parseToolId = originalParseToolId
    })
  })

  describe("parseToolId", () => {
    it("should correctly parse tool ID into method and path", async () => {
      await apiClient.executeApiCall("GET-users-profile-details", {})

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "get",
          url: "/users/profile/details",
        }),
      )
    })

    it("should handle hyphens in path segments", async () => {
      await apiClient.executeApiCall("POST-api-v1-user-profile", {})

      expect(mockAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          method: "post",
          url: "/api/v1/user/profile",
        }),
      )
    })
  })
})
