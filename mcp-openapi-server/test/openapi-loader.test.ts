import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { readFile } from "fs/promises"
import { OpenAPISpecLoader } from "../src/openapi-loader"
import { OpenAPIV3 } from "openapi-types"
import { Tool } from "@modelcontextprotocol/sdk/types.js"

// Mock dependencies
vi.mock("fs/promises")

vi.mock("js-yaml", async () => {
  const actualJsYamlMod = await vi.importActual<typeof import("js-yaml")>("js-yaml")

  // The SUT (System Under Test) uses "import yaml from 'js-yaml'",
  // which means it expects 'js-yaml' to have a default export.
  // The mocked 'load' function for this default export should call the actual 'load' from js-yaml.
  // According to @types/js-yaml, the 'load' function is a direct export of the module.
  const realLoadFn = actualJsYamlMod.load

  if (typeof realLoadFn !== "function") {
    // This would be unexpected if @types/js-yaml is correct and js-yaml is installed.
    console.error(
      "Vitest mock issue: js-yaml .load function not found on actualJsYamlMod as per types.",
      actualJsYamlMod,
    )
    throw new Error("Vitest mock setup: actualJsYamlMod.load is not a function")
  }

  return {
    default: {
      load: vi.fn((content: string) => realLoadFn(content)),
    },
    // Provide other exports as well, consistent with the actual module, in case they are ever used.
    load: vi.fn((content: string) => realLoadFn(content)),
    // safeLoad: vi.fn((content: string) => actualJsYamlMod.safeLoad(content)), // Temporarily remove if causing type issues
    // Add other js-yaml exports if necessary for full fidelity, though 'load' is the key one here.
  }
})

// Mock fetch globally for tests that might use it
global.fetch = vi.fn()

describe("OpenAPISpecLoader", () => {
  let openAPILoader: OpenAPISpecLoader
  const mockOpenAPISpec: OpenAPIV3.Document = {
    openapi: "3.0.0",
    info: {
      title: "Test API",
      version: "1.0.0",
    },
    paths: {
      "/users": {
        get: {
          operationId: "getUsers",
          summary: "Get all users",
          description: "Returns a list of users",
          parameters: [
            {
              name: "limit",
              in: "query",
              description: "Maximum number of users to return",
              required: false,
              schema: {
                type: "integer",
              },
            },
          ],
          responses: {},
        },
        post: {
          operationId: "createUser",
          summary: "Create a user",
          description: "Creates a new user",
          responses: {},
        },
      },
      "/users/{id}": {
        get: {
          operationId: "getUserById",
          summary: "Get user by ID",
          description: "Returns a user by ID",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "User ID",
              required: true,
              schema: {
                type: "string",
              },
            },
          ],
          responses: {},
        },
      },
    },
  }

  beforeEach(() => {
    openAPILoader = new OpenAPISpecLoader()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("loadOpenAPISpec", () => {
    it("should load spec from URL", async () => {
      const url = "https://example.com/api-spec.json"
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockOpenAPISpec),
        json: async () => mockOpenAPISpec, // Though text() is used in implementation
      } as Response)

      const result = await openAPILoader.loadOpenAPISpec(url, "url")

      expect(fetch).toHaveBeenCalledWith(url)
      expect(result).toEqual(mockOpenAPISpec)
    })

    it("should load spec from local file (JSON)", async () => {
      const filePath = "./api-spec.json"
      const fileContent = JSON.stringify(mockOpenAPISpec)
      vi.mocked(readFile).mockResolvedValueOnce(fileContent)

      const result = await openAPILoader.loadOpenAPISpec(filePath, "file")

      expect(readFile).toHaveBeenCalledWith(filePath, "utf-8")
      expect(result).toEqual(mockOpenAPISpec)
    })

    it("should load spec from local file (YAML)", async () => {
      const filePath = "./api-spec.yaml"
      const yamlContent = `
openapi: 3.0.0
info:
  title: Test API YAML
  version: 1.0.0
paths:
  /test:
    get:
      summary: Test YAML endpoint
      responses:
        '200':
          description: Successful response
`
      const expectedSpecObject = {
        openapi: "3.0.0",
        info: {
          title: "Test API YAML",
          version: "1.0.0",
        },
        paths: {
          "/test": {
            get: {
              summary: "Test YAML endpoint",
              responses: {
                "200": {
                  description: "Successful response",
                },
              },
            },
          },
        },
      }

      vi.mocked(readFile).mockResolvedValueOnce(yamlContent)

      const result = await openAPILoader.loadOpenAPISpec(filePath, "file")

      expect(readFile).toHaveBeenCalledWith(filePath, "utf-8")
      expect(result).toEqual(expectedSpecObject)
    })

    it("should load spec from inline content (JSON)", async () => {
      const inlineContent = JSON.stringify(mockOpenAPISpec)

      const result = await openAPILoader.loadOpenAPISpec("inline", "inline", inlineContent)

      expect(result).toEqual(mockOpenAPISpec)
    })

    it("should load spec from inline content (YAML)", async () => {
      const yamlContent = `
openapi: 3.0.0
info:
  title: Inline YAML API
  version: 1.0.0
paths:
  /inline:
    get:
      summary: Inline endpoint
      responses:
        '200':
          description: Success
`
      const expectedSpec = {
        openapi: "3.0.0",
        info: {
          title: "Inline YAML API",
          version: "1.0.0",
        },
        paths: {
          "/inline": {
            get: {
              summary: "Inline endpoint",
              responses: {
                "200": {
                  description: "Success",
                },
              },
            },
          },
        },
      }

      const result = await openAPILoader.loadOpenAPISpec("inline", "inline", yamlContent)

      expect(result).toEqual(expectedSpec)
    })

    it("should load spec from stdin", async () => {
      const stdinContent = JSON.stringify(mockOpenAPISpec)

      // Mock process.stdin
      const mockStdin = {
        setEncoding: vi.fn(),
        on: vi.fn(),
        resume: vi.fn(),
      }

      // Replace process.stdin temporarily
      const originalStdin = process.stdin
      Object.defineProperty(process, "stdin", {
        value: mockStdin,
        configurable: true,
      })

      // Set up the stdin mock to simulate data flow
      mockStdin.on.mockImplementation((event: string, callback: Function) => {
        if (event === "data") {
          setTimeout(() => callback(stdinContent), 0)
        } else if (event === "end") {
          setTimeout(() => callback(), 10)
        }
        return mockStdin
      })

      const result = await openAPILoader.loadOpenAPISpec("stdin", "stdin")

      expect(mockStdin.setEncoding).toHaveBeenCalledWith("utf8")
      expect(mockStdin.resume).toHaveBeenCalled()
      expect(result).toEqual(mockOpenAPISpec)

      // Restore original stdin
      Object.defineProperty(process, "stdin", {
        value: originalStdin,
        configurable: true,
      })
    })

    it("should throw error if URL fetch fails", async () => {
      const url = "https://example.com/api-spec.json"
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response)

      await expect(openAPILoader.loadOpenAPISpec(url, "url")).rejects.toThrow(
        "Failed to load OpenAPI spec from url: HTTP 404: Not Found",
      )
    })

    it("should throw error if file reading fails", async () => {
      const filePath = "./api-spec.json"
      const error = new Error("File not found")
      vi.mocked(readFile).mockRejectedValueOnce(error)

      await expect(openAPILoader.loadOpenAPISpec(filePath, "file")).rejects.toThrow(
        "Failed to load OpenAPI spec from file: File not found",
      )
    })

    it("should throw error if inline content is missing", async () => {
      await expect(openAPILoader.loadOpenAPISpec("inline", "inline")).rejects.toThrow(
        "Inline content is required when using 'inline' input method",
      )
    })

    it("should throw error if stdin provides empty content", async () => {
      // Mock process.stdin for empty content
      const mockStdin = {
        setEncoding: vi.fn(),
        on: vi.fn(),
        resume: vi.fn(),
      }

      const originalStdin = process.stdin
      Object.defineProperty(process, "stdin", {
        value: mockStdin,
        configurable: true,
      })

      mockStdin.on.mockImplementation((event: string, callback: Function) => {
        if (event === "end") {
          setTimeout(() => callback(), 0)
        }
        return mockStdin
      })

      await expect(openAPILoader.loadOpenAPISpec("stdin", "stdin")).rejects.toThrow(
        "Failed to load OpenAPI spec from stdin: No data received from stdin",
      )

      Object.defineProperty(process, "stdin", {
        value: originalStdin,
        configurable: true,
      })
    })

    it("should throw error for invalid JSON/YAML content", async () => {
      const invalidContent = "{ invalid json content"

      await expect(
        openAPILoader.loadOpenAPISpec("inline", "inline", invalidContent),
      ).rejects.toThrow(/Failed to parse as JSON or YAML/)
    })

    it("should throw error for empty content", async () => {
      await expect(openAPILoader.loadOpenAPISpec("inline", "inline", "")).rejects.toThrow(
        "Failed to load OpenAPI spec from inline",
      )
    })

    it("should throw error for unsupported input method", async () => {
      await expect(openAPILoader.loadOpenAPISpec("test", "unsupported" as any)).rejects.toThrow(
        "Unsupported input method: unsupported",
      )
    })

    // Backward compatibility test
    it("should maintain backward compatibility with old interface", async () => {
      const url = "https://example.com/api-spec.json"
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        text: async () => JSON.stringify(mockOpenAPISpec),
      } as Response)

      // Test the old interface (without specifying input method)
      const result = await openAPILoader.loadOpenAPISpec(url)

      expect(fetch).toHaveBeenCalledWith(url)
      expect(result).toEqual(mockOpenAPISpec)
    })
  })

  describe("parseOpenAPISpec with disableAbbreviation", () => {
    it("should not abbreviate tool names when disableAbbreviation is true", () => {
      const loader = new OpenAPISpecLoader({ disableAbbreviation: true })
      const spec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: { title: "Test API", version: "1.0.0" },
        paths: {
          "/users/management/authorization-groups": {
            get: {
              operationId: "getUserManagementAuthorizationGroups",
              summary: "Get all user management authorization groups",
              responses: {},
            },
          },
        },
      }

      const tools = loader.parseOpenAPISpec(spec)
      const toolId = Array.from(tools.keys())[0]

      // Should not be abbreviated
      expect(toolId).toContain("GET-users-management-authorization-groups")
      const tool = tools.get(toolId)!
      expect(tool.name).toContain("get-user-management-authorization-groups")
    })
  })

  describe("parseOpenAPISpec", () => {
    it("should convert OpenAPI paths to MCP tools", () => {
      const tools = openAPILoader.parseOpenAPISpec(mockOpenAPISpec)

      expect(tools.size).toBe(3)
      expect(tools.has("GET-users")).toBe(true)
      expect(tools.has("POST-users")).toBe(true)
      expect(tools.has("GET-users-id")).toBe(true)
    })

    it("should set correct tool properties", () => {
      const tools = openAPILoader.parseOpenAPISpec(mockOpenAPISpec)
      const getUsersTool = tools.get("GET-users") as Tool

      expect(getUsersTool).toBeDefined()
      expect(getUsersTool.name).toBe("get-usrs")
      expect(getUsersTool.description).toBe("Returns a list of users")
      expect(getUsersTool.inputSchema).toEqual({
        type: "object",
        properties: {
          limit: {
            type: "integer",
            description: "Maximum number of users to return",
            "x-parameter-location": "query",
          },
        },
      })
    })

    it("should handle required parameters", () => {
      const tools = openAPILoader.parseOpenAPISpec(mockOpenAPISpec)
      const getUserByIdTool = tools.get("GET-users-id") as Tool

      expect(getUserByIdTool).toBeDefined()
      expect(getUserByIdTool.inputSchema).toEqual({
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "User ID",
            "x-parameter-location": "path",
          },
        },
        required: ["id"],
      })
    })

    it("should use operationId as tool name when available", () => {
      const tools = openAPILoader.parseOpenAPISpec(mockOpenAPISpec)
      const getUsersTool = tools.get("GET-users") as Tool

      expect(getUsersTool.name).toBe("get-usrs")
    })

    it("should handle paths with special characters", () => {
      const specWithSpecialChars: OpenAPIV3.Document = {
        ...mockOpenAPISpec,
        paths: {
          "/api/v1/user-profiles": {
            get: {
              operationId: "getUserProfiles",
              responses: {},
            },
          },
        },
      }

      const tools = openAPILoader.parseOpenAPISpec(specWithSpecialChars)
      expect(tools.has("GET-api-v1-user-profiles")).toBe(true)
    })

    it("should handle empty paths object", () => {
      const emptySpec: OpenAPIV3.Document = {
        ...mockOpenAPISpec,
        paths: {},
      }

      const tools = openAPILoader.parseOpenAPISpec(emptySpec)
      expect(tools.size).toBe(0)
    })

    it("should skip parameters property in pathItem", () => {
      const specWithPathParams: OpenAPIV3.Document = {
        ...mockOpenAPISpec,
        paths: {
          "/users": {
            parameters: [
              {
                name: "common",
                in: "query",
                schema: {
                  type: "string",
                },
              },
            ],
            get: {
              operationId: "getUsers",
              responses: {},
            },
          },
        },
      }

      const tools = openAPILoader.parseOpenAPISpec(specWithPathParams)
      expect(tools.size).toBe(1)
      expect(tools.has("GET-users")).toBe(true)
    })

    it("should skip non-HTTP methods in path item", () => {
      const specWithNonHttpMethods: OpenAPIV3.Document = {
        ...mockOpenAPISpec,
        paths: {
          "/api/users": {
            // Valid HTTP method
            get: {
              operationId: "getUsers",
              responses: {},
            },
            // Non-HTTP method property that should be skipped
            servers: [{ url: "https://api.example.com" }],
            // Another non-HTTP method that should be skipped
            summary: "Users API endpoint",
            // Another valid HTTP method
            post: {
              operationId: "createUser",
              responses: {},
            },
          },
        },
      }

      const tools = openAPILoader.parseOpenAPISpec(specWithNonHttpMethods)
      expect(tools.size).toBe(2)
      expect(tools.has("GET-api-users")).toBe(true)
      expect(tools.has("POST-api-users")).toBe(true)
      // Verify non-HTTP methods aren't included
      expect([...tools.keys()].some((key) => key.startsWith("SERVERS-"))).toBe(false)
      expect([...tools.keys()].some((key) => key.startsWith("SUMMARY-"))).toBe(false)
    })

    // New tests for Input Schema Composition and $ref inlining
    it("should merge primitive request bodies into a 'body' property and mark required", () => {
      const spec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: { title: "Primitive API", version: "1.0.0" },
        paths: {
          "/echo": {
            post: {
              summary: "Echo primitive",
              requestBody: {
                content: { "application/json": { schema: { type: "string" } } },
              },
              responses: { "200": { description: "OK" } },
            },
          },
        },
      }
      const tools = openAPILoader.parseOpenAPISpec(spec)
      const tool = tools.get("POST-echo")!
      expect(tool.inputSchema.properties).toHaveProperty("body")
      expect((tool.inputSchema.properties! as any).body.type).toBe("string")
      expect(tool.inputSchema.required).toEqual(["body"])
    })

    it("should merge object request bodies and preserve property names and required flags", () => {
      const spec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: { title: "Object API", version: "1.0.0" },
        paths: {
          "/create": {
            post: {
              summary: "Create object",
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { foo: { type: "integer" }, bar: { type: "boolean" } },
                      required: ["foo"],
                    },
                  },
                },
              },
              responses: { "200": { description: "OK" } },
            },
          },
        },
      }
      const tools = openAPILoader.parseOpenAPISpec(spec)
      const tool = tools.get("POST-create")!
      expect(tool.inputSchema.properties).toHaveProperty("foo")
      expect(tool.inputSchema.properties).toHaveProperty("bar")
      expect(tool.inputSchema.required).toEqual(["foo"])
    })

    it("should merge array request bodies into 'body' property and mark required", () => {
      const spec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: { title: "Array API", version: "1.0.0" },
        paths: {
          "/list": {
            post: {
              summary: "List items",
              requestBody: {
                content: {
                  "application/json": { schema: { type: "array", items: { type: "number" } } },
                },
              },
              responses: { "200": { description: "OK" } },
            },
          },
        },
      }
      const tools = openAPILoader.parseOpenAPISpec(spec)
      const tool = tools.get("POST-list")!
      expect(tool.inputSchema.properties).toHaveProperty("body")
      expect((tool.inputSchema.properties! as any).body.type).toBe("array")
      expect(tool.inputSchema.required).toEqual(["body"])
    })

    it("should merge parameters and requestBody, handling name collisions by prefixing", () => {
      const spec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: { title: "Mix API", version: "1.0.0" },
        paths: {
          "/items/{id}": {
            post: {
              summary: "Update item",
              parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
              requestBody: {
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: { id: { type: "string" }, value: { type: "string" } },
                      required: ["value"],
                    },
                  },
                },
              },
              responses: { "200": { description: "OK" } },
            },
          },
        },
      }
      const tools = openAPILoader.parseOpenAPISpec(spec)
      const tool = tools.get("POST-items-id")!
      // Path param 'id' and body properties
      expect(tool.inputSchema.properties).toHaveProperty("id")
      expect(tool.inputSchema.properties).toHaveProperty("value")
      // Only required: path param and required body properties
      expect(tool.inputSchema.required).toEqual(["id", "value"])
    })

    it("should inline $ref schemas and drop recursive cycles in requestBody", () => {
      const spec: OpenAPIV3.Document = {
        openapi: "3.0.0",
        info: { title: "Ref API", version: "1.0.0" },
        paths: {
          "/person": {
            post: {
              summary: "Create person",
              requestBody: {
                content: {
                  "application/json": { schema: { $ref: "#/components/schemas/Person" } },
                },
              },
              responses: { "200": { description: "OK" } },
            },
          },
        },
        components: {
          schemas: {
            Person: {
              type: "object",
              properties: {
                name: { type: "string" },
                friend: { $ref: "#/components/schemas/Person" },
              },
              required: ["name"],
            },
          },
        },
      }
      const tools = openAPILoader.parseOpenAPISpec(spec)
      const tool = tools.get("POST-person")!
      expect(tool.inputSchema.properties).toHaveProperty("name")
      expect(tool.inputSchema.properties).toHaveProperty("friend")
      // friend nested should be empty object due to recursion
      expect((tool.inputSchema.properties! as any).friend).toEqual({})
      expect(tool.inputSchema.required).toEqual(["name"])
    })

    it("should resolve parameter references properly", () => {
      const specWithRefParams: OpenAPIV3.Document = {
        ...mockOpenAPISpec,
        paths: {
          "/items/{id}": {
            get: {
              operationId: "getItemById",
              parameters: [
                { $ref: "#/components/parameters/IdParam" },
                { $ref: "#/components/parameters/LimitParam" },
              ],
              responses: {},
            },
          },
        },
        components: {
          parameters: {
            IdParam: {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Item identifier",
            },
            LimitParam: {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer" },
              description: "Maximum number of results",
            },
          },
        },
      }

      const tools = openAPILoader.parseOpenAPISpec(specWithRefParams)
      expect(tools.size).toBe(1)

      const tool = tools.get("GET-items-id")
      expect(tool).toBeDefined()

      // Check that both referenced parameters were properly resolved
      const properties = tool!.inputSchema.properties!
      expect(properties).toHaveProperty("id")
      expect(properties).toHaveProperty("limit")

      // Check the details of each resolved parameter
      expect(properties.id).toEqual({
        type: "string",
        description: "Item identifier",
        "x-parameter-location": "path",
      })

      expect(properties.limit).toEqual({
        type: "integer",
        description: "Maximum number of results",
        "x-parameter-location": "query",
      })

      // Verify that required parameters were correctly identified
      expect(tool!.inputSchema.required).toContain("id")
      // Check that limit isn't required (should not be in the required array)
      const required = tool!.inputSchema.required as string[]
      expect(required.includes("limit")).toBe(false)
    })

    it("should resolve nested references in parameters", () => {
      const specWithNestedRefs: OpenAPIV3.Document = {
        ...mockOpenAPISpec,
        paths: {
          "/products": {
            get: {
              operationId: "getProducts",
              parameters: [
                { $ref: "#/components/parameters/FilterParam" },
                { $ref: "#/components/parameters/PaginationParam" },
              ],
              responses: {},
            },
          },
        },
        components: {
          schemas: {
            PaginationOptions: {
              type: "object",
              properties: {
                page: { type: "integer", description: "Page number", default: 1 },
                size: { type: "integer", description: "Items per page", default: 20 },
              },
            },
            FilterOptions: {
              type: "object",
              properties: {
                category: { type: "string", description: "Product category" },
                minPrice: { type: "number", description: "Minimum price" },
              },
            },
          },
          parameters: {
            FilterParam: {
              name: "filter",
              in: "query",
              required: false,
              schema: { $ref: "#/components/schemas/FilterOptions" },
              description: "Product filtering options",
            },
            PaginationParam: {
              name: "pagination",
              in: "query",
              required: false,
              schema: { $ref: "#/components/schemas/PaginationOptions" },
              description: "Pagination options",
            },
          },
        },
      }

      const tools = openAPILoader.parseOpenAPISpec(specWithNestedRefs)
      expect(tools.size).toBe(1)

      const tool = tools.get("GET-products")
      expect(tool).toBeDefined()

      // Check that both referenced parameters were properly resolved
      const properties = tool!.inputSchema.properties!
      expect(properties).toHaveProperty("filter")
      expect(properties).toHaveProperty("pagination")

      // Now that we've improved the implementation, we should get fully resolved nested references
      const filterParam = properties.filter as Record<string, any>
      expect(filterParam.type).toBe("object")
      expect(filterParam.description).toBe("Product filtering options")
      expect(filterParam["x-parameter-location"]).toBe("query")
      // Check that nested properties are preserved
      expect(filterParam.properties).toBeDefined()
      expect(filterParam.properties.category).toBeDefined()
      expect(filterParam.properties.category.type).toBe("string")
      expect(filterParam.properties.category.description).toBe("Product category")
      expect(filterParam.properties.minPrice).toBeDefined()
      expect(filterParam.properties.minPrice.type).toBe("number")
      expect(filterParam.properties.minPrice.description).toBe("Minimum price")

      const paginationParam = properties.pagination as Record<string, any>
      expect(paginationParam.type).toBe("object")
      expect(paginationParam.description).toBe("Pagination options")
      expect(paginationParam["x-parameter-location"]).toBe("query")
      // Check that nested properties with defaults are preserved
      expect(paginationParam.properties).toBeDefined()
      expect(paginationParam.properties.page).toBeDefined()
      expect(paginationParam.properties.page.type).toBe("integer")
      expect(paginationParam.properties.page.default).toBe(1)
      expect(paginationParam.properties.size).toBeDefined()
      expect(paginationParam.properties.size.type).toBe("integer")
      expect(paginationParam.properties.size.default).toBe(20)

      // Neither parameter should be required
      const required = tool!.inputSchema.required
      expect(required).toBeUndefined()
    })
  })

  describe("disableAbbreviation", () => {
    it("should not abbreviate operation IDs when disableAbbreviation is true", () => {
      const loader = new OpenAPISpecLoader({ disableAbbreviation: true })
      const longName = "ServiceUsersManagementController_updateServiceUsersAuthorityGroup"
      const result = loader.abbreviateOperationId(longName)

      // Should not be abbreviated
      expect(result).toContain("service-users-management-controller")
      expect(result).toContain("update-service-users-authority-group")
    })
  })

  describe("abbreviateOperationId", () => {
    const maxLength = 64
    // Helper to check length and character validity
    const isValidToolName = (name: string) => {
      expect(name.length).toBeLessThanOrEqual(maxLength)
      expect(name).toMatch(/^[a-z0-9-]+$/)
      expect(name).not.toMatch(/--/)
      expect(name.startsWith("-")).toBe(false)
      expect(name.endsWith("-")).toBe(false)
    }

    it("should not change short, valid names", () => {
      const name = "short-and-valid"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe(name)
      isValidToolName(result)
    })

    it("should sanitize basic invalid characters and lowercase", () => {
      const name = "Get User By ID"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe("get-user-by-id")
      isValidToolName(result)
    })

    it("should handle empty string input", () => {
      const result = openAPILoader.abbreviateOperationId("", maxLength)
      expect(result).toBe("unnamed-tool")
      isValidToolName(result)
    })

    it("should handle string with only special characters", () => {
      const result = openAPILoader.abbreviateOperationId("_!@#$%^&*_()+", maxLength)
      // Expecting a hash as it becomes empty after initial sanitization
      expect(result).toMatch(/^tool-[a-f0-9]{8}$/)
      isValidToolName(result)
    })

    it("should remove common words", () => {
      const name = "UserServiceGetUserDetailsControllerApi"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      // UserServiceGetUserDetailsControllerApi -> User Service Get User Details
      // Remove Controller, Api -> User Service Get User Details
      // Abbr: Usr Svc Get Usr Details -> usr-svc-get-usr-details
      expect(result).toBe("usr-svc-get-usr-details")
      isValidToolName(result)
    })

    it("should apply standard abbreviations preserving TitleCase", () => {
      const name = "UpdateUserConfigurationManagement"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe("upd-usr-config-mgmt")
      isValidToolName(result)
    })

    it("should apply standard abbreviations preserving ALLCAPS", () => {
      const name = "LIST_USER_RESOURCES_API"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe("lst-usr-resrcs")
      isValidToolName(result)
    })

    it("should apply vowel removal for long words", () => {
      const name = "ServiceUsersExtraordinarilyLongManagementControllerUpdateUserAuthorityGroup"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      // This will likely be truncated with hash as well due to length
      expect(result.length).toBeLessThanOrEqual(maxLength)
      isValidToolName(result)
    })

    it("should truncate and hash very long names", () => {
      const name =
        "ThisIsAVeryLongOperationIdThatExceedsTheMaximumLengthAndNeedsToBeTruncatedAndHashedServiceUsersManagementControllerUpdateUserAuthorityGroup"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toMatch(/^[a-z0-9-]+-[a-f0-9]{4}$/)
      expect(result.length).toBeLessThanOrEqual(maxLength)
      isValidToolName(result)
    })

    it("should handle names that become empty after processing before hash", () => {
      const name = "Controller_Service_API_Method" // All common words as per revised list + service/method
      // Controller, Service, API, Method -> split
      // Controller, API removed by common. -> Service, Method
      // Abbr: Svc, Method -> svc-method
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe("svc-method") // Not empty, so no hash
      isValidToolName(result)
    })

    it("should ensure no leading/trailing/multiple hyphens after processing", () => {
      const name = "---LeadingTrailingAnd---Multiple---Hyphens---"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      // Initial sanitization -> LeadingTrailingAnd-Multiple-Hyphens
      // splitCombined -> [Leading, Trailing, And, Multiple, Hyphens]
      // common word removal (and) -> [Leading, Trailing, Multiple, Hyphens]
      // join -> leading-trailing-multiple-hyphens
      expect(result).toBe("leading-trailing-multiple-hyphens")
      isValidToolName(result)
    })

    it("should handle name that is exactly maxLength", () => {
      const name = "a".repeat(maxLength)
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe(name)
      isValidToolName(result)
    })

    it("should handle name that is maxLength + 1", () => {
      const name = "a".repeat(maxLength + 1)
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toMatch(/^[a-z0-9-]+-[a-f0-9]{4}$/) // Expect hash
      isValidToolName(result)
    })

    it("should correctly abbreviate the original problematic example", () => {
      const name = "ServiceUsersManagementController_updateServiceUsersAuthorityGroup"
      // Original length 69 > 64 -> originalWasLong = true, so needsHash = true.
      // Processed: svc-usrs-mgmt-upd-svc-usrs-auth-grp (length 37)
      // Not > maxLengthForBase (59). So, not truncated.
      // Result: svc-usrs-mgmt-upd-svc-usrs-auth-grp-HASH
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toMatch(/^svc-usrs-mgmt-upd-svc-usrs-auth-grp-[a-f0-9]{4}$/)
      isValidToolName(result)
    })

    it("should handle names requiring multiple processing steps ending in truncation", () => {
      const name =
        "AN_EXTREMELY_LONG_IDENTIFIER_FOR_UPDATING_CONFIGURATION_RESOURCES_AND_OTHER_THINGS_ServiceController"
      // Original length 110 > 64 -> originalWasLong = true, so needsHash = true.
      // Processed: an-extremely-long-id-upd-config-resrcs-other-things-svc (length 63)
      // currentName (63) > maxLengthForBase (59). Truncate to 59: an-extremely-long-id-upd-config-resrcs-other-things-sv
      // Result: an-extremely-long-id-upd-config-resrcs-other-things-sv-HASH
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toMatch(/^[a-z0-9-]+-[a-f0-9]{4}$/) // General hash check is fine here
      isValidToolName(result)
    })

    it("should handle names with numbers", () => {
      const name = "getUserDetailsForUser123AndService456"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      // Trace with current logic:
      // Initial: getUserDetailsForUser123AndService456
      // Split: get, User, Details, For, User, 123, And, Service, 456
      // Common word removal (assuming for, and, the, with added to list):
      //   -> get, User, Details, User, 123, Service, 456
      // Abbreviate: Get, Usr, Details, Usr, 123, Svc, 456
      // Joined & lowercased: get-usr-details-usr-123-svc-456
      // Previous actual output: get-usr-details-for-user123-and-service456
      // This indicates common words 'for' 'and' were NOT removed, and 'User', 'Service' were not abbreviated from User123 etc.
      // The new common word list in the main function now includes "for" and "and".
      // The splitCombined already correctly separates User123 to User, 123.
      // So the expectation should be get-usr-details-usr-123-svc-456
      expect(result).toBe("get-usr-details-usr-123-svc-456")
      isValidToolName(result)
    })

    it("should produce different hashes for slightly different long names", () => {
      const name1 = "ThisIsAnExtremelyLongNameThatWillBeTruncatedAndHashedPartOneService"
      const name2 = "ThisIsAnExtremelyLongNameThatWillBeTruncatedAndHashedPartTwoService"
      const result1 = openAPILoader.abbreviateOperationId(name1, maxLength)
      const result2 = openAPILoader.abbreviateOperationId(name2, maxLength)
      expect(result1).not.toBe(result2)
      expect(result1.slice(-4)).not.toBe(result2.slice(-4)) // Check hash part is different
      isValidToolName(result1)
      isValidToolName(result2)
    })

    it("should handle names that become valid after only sanitization and are within limit", () => {
      const name = "My Operation With Spaces"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toBe("my-spaces")
      isValidToolName(result)
    })

    it("should handle names that become valid after sanitization but exceed limit and need hashing", () => {
      const name =
        "My Very Very Very Very Very Very Very Very Very Very Very Very Very Long Operation With Spaces"
      const result = openAPILoader.abbreviateOperationId(name, maxLength)
      expect(result).toMatch(/^[a-z0-9-]+-[a-f0-9]{4}$/)
      isValidToolName(result)
    })
  })
})
