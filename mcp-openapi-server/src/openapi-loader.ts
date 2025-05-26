import { OpenAPIV3 } from "openapi-types"
import { readFile } from "fs/promises"
import { Tool } from "@modelcontextprotocol/sdk/types.js"
import yaml from "js-yaml"
import crypto from "crypto"
import { REVISED_COMMON_WORDS_TO_REMOVE, WORD_ABBREVIATIONS } from "./abbreviations.js"

/**
 * Spec input method type
 */
export type SpecInputMethod = "url" | "file" | "stdin" | "inline"

/**
 * Class to load and parse OpenAPI specifications
 */
export class OpenAPISpecLoader {
  /**
   * Disable name optimization
   */
  private disableAbbreviation: boolean

  constructor(config?: { disableAbbreviation?: boolean }) {
    this.disableAbbreviation = config?.disableAbbreviation ?? false
  }

  /**
   * Load an OpenAPI specification from various sources
   */
  async loadOpenAPISpec(
    specPathOrUrl: string,
    inputMethod: SpecInputMethod = "url",
    inlineContent?: string,
  ): Promise<OpenAPIV3.Document> {
    let specContent: string

    try {
      switch (inputMethod) {
        case "url":
          specContent = await this.loadFromUrl(specPathOrUrl)
          break
        case "file":
          specContent = await this.loadFromFile(specPathOrUrl)
          break
        case "stdin":
          specContent = await this.loadFromStdin()
          break
        case "inline":
          if (!inlineContent) {
            throw new Error("Inline content is required when using 'inline' input method")
          }
          specContent = inlineContent
          break
        default:
          throw new Error(`Unsupported input method: ${inputMethod}`)
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load OpenAPI spec from ${inputMethod}: ${error.message}`)
      }
      throw error
    }

    return this.parseSpecContent(specContent, inputMethod)
  }

  /**
   * Load spec content from URL
   */
  private async loadFromUrl(url: string): Promise<string> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Load spec content from local file
   */
  private async loadFromFile(filePath: string): Promise<string> {
    return await readFile(filePath, "utf-8")
  }

  /**
   * Load spec content from standard input
   */
  private async loadFromStdin(): Promise<string> {
    return new Promise((resolve, reject) => {
      let data = ""

      // Set stdin to read mode
      process.stdin.setEncoding("utf8")

      // Handle data chunks
      process.stdin.on("data", (chunk) => {
        data += chunk
      })

      // Handle end of input
      process.stdin.on("end", () => {
        if (data.trim().length === 0) {
          reject(new Error("No data received from stdin"))
        } else {
          resolve(data)
        }
      })

      // Handle errors
      process.stdin.on("error", (error) => {
        reject(new Error(`Error reading from stdin: ${error.message}`))
      })

      // Resume stdin to start reading
      process.stdin.resume()
    })
  }

  /**
   * Parse spec content as JSON or YAML
   */
  private parseSpecContent(specContent: string, source: string): OpenAPIV3.Document {
    if (!specContent || specContent.trim().length === 0) {
      throw new Error(`Empty or invalid spec content from ${source}`)
    }

    // Attempt to parse as JSON, then YAML if JSON parsing fails
    try {
      return JSON.parse(specContent) as OpenAPIV3.Document
    } catch (jsonError) {
      try {
        const yamlResult = yaml.load(specContent) as OpenAPIV3.Document
        if (!yamlResult || typeof yamlResult !== "object") {
          throw new Error("YAML parsing resulted in invalid object")
        }
        return yamlResult
      } catch (yamlError) {
        throw new Error(
          `Failed to parse as JSON or YAML. JSON error: ${
            (jsonError as Error).message
          }. YAML error: ${(yamlError as Error).message}`,
        )
      }
    }
  }

  /**
   * Inline `$ref` schemas from components and drop recursive cycles
   */
  private inlineSchema(
    schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
    components: Record<string, OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject> | undefined,
    visited: Set<string>,
  ): OpenAPIV3.SchemaObject {
    // Handle reference objects
    if ("$ref" in schema && typeof schema.$ref === "string") {
      const ref = schema.$ref
      const match = ref.match(/^#\/components\/schemas\/(.+)$/)
      if (match && components) {
        const name = match[1]
        if (visited.has(name)) {
          return {} as OpenAPIV3.SchemaObject
        }
        const comp = components[name]
        if (!comp) {
          return {} as OpenAPIV3.SchemaObject
        }
        visited.add(name)
        return this.inlineSchema(comp, components, visited)
      }
    }

    // We know it's a SchemaObject now since ReferenceObject only has $ref
    const schemaObj = schema as OpenAPIV3.SchemaObject

    // Inline object schemas
    if (schemaObj.type === "object" && schemaObj.properties) {
      const newProps: Record<string, OpenAPIV3.SchemaObject> = {}
      for (const [propName, propSchema] of Object.entries(schemaObj.properties)) {
        newProps[propName] = this.inlineSchema(
          propSchema as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
          components,
          new Set(visited),
        )
      }
      return { ...schemaObj, properties: newProps } as OpenAPIV3.SchemaObject
    }
    // Inline array schemas
    if (schemaObj.type === "array" && schemaObj.items) {
      return {
        ...schemaObj,
        items: this.inlineSchema(
          schemaObj.items as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
          components,
          new Set(visited),
        ),
      } as OpenAPIV3.SchemaObject
    }
    return schemaObj
  }

  /**
   * Determine the appropriate JSON Schema type for a parameter
   * @param paramSchema The OpenAPI schema object after inlining
   * @param paramName The name of the parameter (for logging purposes)
   * @returns The determined type string, or undefined if the type should be omitted
   */
  private determineParameterType(
    paramSchema: OpenAPIV3.SchemaObject,
    paramName: string,
  ): string | undefined {
    // Handle empty schema (potentially from cycle removal in inlineSchema)
    if (Object.keys(paramSchema).length === 0 && typeof paramSchema !== "boolean") {
      console.warn(
        `Parameter '${paramName}' schema was empty after inlining (potential cycle or unresolvable ref), defaulting to string.`,
      )
      return "string"
    }

    // Handle boolean schema (true/false for allowing any/no value)
    if (typeof paramSchema === "boolean") {
      return "boolean" // Or alternate convention if needed
    }

    // Use explicit type if available
    if (paramSchema.type) {
      return paramSchema.type
    }

    // Determine if schema has structural elements that imply a type
    const hasProperties =
      "properties" in paramSchema &&
      paramSchema.properties &&
      Object.keys(paramSchema.properties).length > 0

    const hasItems =
      paramSchema.type === "array" && !!(paramSchema as OpenAPIV3.ArraySchemaObject).items

    const hasComposition =
      ("allOf" in paramSchema && paramSchema.allOf && paramSchema.allOf.length > 0) ||
      ("anyOf" in paramSchema && paramSchema.anyOf && paramSchema.anyOf.length > 0) ||
      ("oneOf" in paramSchema && paramSchema.oneOf && paramSchema.oneOf.length > 0)

    // If no structural elements, default to string
    if (!hasProperties && !hasItems && !hasComposition) {
      return "string"
    }

    // For complex schemas with structural elements but no explicit type,
    // return undefined to omit the type field.
    // JSON Schema validators can infer type from structure:
    // - 'object' if properties exist
    // - 'array' if items exist
    // This behavior should be documented for consumers of the API
    return undefined
  }

  /**
   * Parse an OpenAPI specification into a map of tools
   */
  parseOpenAPISpec(spec: OpenAPIV3.Document): Map<string, Tool> {
    const tools = new Map<string, Tool>()

    // Convert each OpenAPI path to an MCP tool
    for (const [path, pathItem] of Object.entries(spec.paths)) {
      if (!pathItem) continue

      for (const [method, operation] of Object.entries(pathItem)) {
        if (method === "parameters" || !operation) continue

        // Skip invalid HTTP methods
        if (
          !["get", "post", "put", "patch", "delete", "options", "head"].includes(
            method.toLowerCase(),
          )
        ) {
          console.warn(`Skipping non-HTTP method "${method}" for path ${path}`)
          continue
        }

        const op = operation as OpenAPIV3.OperationObject
        const cleanPath = path.replace(/^\//, "").replace(/\{([^}]+)\}/g, "$1")
        const toolId = `${method.toUpperCase()}-${cleanPath}`.replace(/[^a-zA-Z0-9-]/g, "-")

        let nameSource = op.operationId || op.summary || `${method.toUpperCase()} ${path}`
        const name = this.abbreviateOperationId(nameSource)

        const tool: Tool = {
          name,
          description: op.description || `Make a ${method.toUpperCase()} request to ${path}`,
          inputSchema: {
            type: "object",
            properties: {},
          },
        }

        // Gather all required property names
        const requiredParams: string[] = []

        // Merge parameters into inputSchema
        if (op.parameters) {
          for (const param of op.parameters) {
            let paramObj: OpenAPIV3.ParameterObject | undefined // To hold the (potentially resolved) parameter

            // Handle parameter references by resolving them
            if ("$ref" in param && typeof param.$ref === "string") {
              const refMatch = param.$ref.match(/^#\/components\/parameters\/(.+)$/)
              if (refMatch && spec.components?.parameters) {
                const paramNameFromRef = refMatch[1]
                const resolvedParam = spec.components.parameters[paramNameFromRef]

                // Ensure resolvedParam is a ParameterObject
                if (resolvedParam && "name" in resolvedParam && "in" in resolvedParam) {
                  paramObj = resolvedParam as OpenAPIV3.ParameterObject
                } else {
                  console.warn(
                    `Could not resolve parameter reference or invalid structure: ${param.$ref}`,
                  )
                  continue
                }
              } else {
                console.warn(`Could not parse parameter reference: ${param.$ref}`)
                continue
              }
            } else if ("name" in param && "in" in param) {
              // Direct parameter object
              paramObj = param as OpenAPIV3.ParameterObject
            } else {
              // This case implies an invalid parameter structure that isn't a $ref and isn't a valid direct parameter.
              console.warn(
                "Skipping parameter due to missing 'name' or 'in' properties and not being a valid $ref:",
                param,
              )
              continue
            }

            // If paramObj is still undefined here, it means the parameter could not be processed.
            if (!paramObj) {
              // This should theoretically be caught by the continue statements above.
              console.warn("Failed to process a parameter (paramObj is undefined):", param)
              continue
            }

            if (paramObj.schema) {
              // Get the fully inlined schema with all nested references resolved
              const paramSchema = this.inlineSchema(
                paramObj.schema as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
                spec.components?.schemas,
                new Set<string>(),
              )

              // Create the parameter definition
              const paramDef: any = {
                description: paramObj.description || `${paramObj.name} parameter`,
                "x-parameter-location": paramObj.in, // Store parameter location (path, query, etc.)
              }

              // Determine and set the appropriate type
              const paramType = this.determineParameterType(paramSchema, paramObj.name)
              if (paramType !== undefined) {
                paramDef.type = paramType
              }

              // Copy all other relevant properties from the inlined schema to paramDef
              // Avoid overwriting already set 'description' or 'type' unless schema has them.
              if (typeof paramSchema === "object" && paramSchema !== null) {
                for (const [key, value] of Object.entries(paramSchema)) {
                  if (key === "description" && paramDef.description) continue // Keep existing if already set
                  if (key === "type" && paramDef.type) continue // Keep existing if already set
                  paramDef[key] = value
                }
              }

              // Add the schema to the tool's input schema properties
              tool.inputSchema.properties![paramObj.name] = paramDef

              if (paramObj.required === true) {
                requiredParams.push(paramObj.name)
              }
            }
          }
        }

        // Merge requestBody schema into inputSchema
        if (op.requestBody && "content" in op.requestBody) {
          const requestBodyObj = op.requestBody as OpenAPIV3.RequestBodyObject

          // Handle different content types
          let mediaTypeObj: OpenAPIV3.MediaTypeObject | undefined

          if (requestBodyObj.content["application/json"]) {
            mediaTypeObj = requestBodyObj.content["application/json"]
          } else if (Object.keys(requestBodyObj.content).length > 0) {
            // Take the first available content type
            const firstContentType = Object.keys(requestBodyObj.content)[0]
            mediaTypeObj = requestBodyObj.content[firstContentType]
          }

          if (mediaTypeObj?.schema) {
            // Handle schema inlining with proper types
            const inlinedSchema = this.inlineSchema(
              mediaTypeObj.schema as OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
              spec.components?.schemas,
              new Set<string>(),
            )

            // Include all properties from inlinedSchema for object, else use body wrapper
            if (inlinedSchema.type === "object" && inlinedSchema.properties) {
              // Handle object properties
              for (const [propName, propSchema] of Object.entries(inlinedSchema.properties)) {
                const paramName = tool.inputSchema.properties![propName]
                  ? `body_${propName}`
                  : propName

                tool.inputSchema.properties![paramName] = propSchema as OpenAPIV3.SchemaObject

                if (inlinedSchema.required && inlinedSchema.required.includes(propName)) {
                  requiredParams.push(paramName)
                }
              }
            } else {
              // Use body wrapper for non-object schemas
              tool.inputSchema.properties!["body"] = inlinedSchema
              requiredParams.push("body")
            }
          }
        }

        // Only add the required array if there are required properties
        if (requiredParams.length > 0) {
          tool.inputSchema.required = requiredParams
        }

        tools.set(toolId, tool)
      }
    }

    return tools
  }

  // Helper function to generate a simple hash
  private generateShortHash(input: string, length: number = 4): string {
    return crypto.createHash("sha256").update(input).digest("hex").substring(0, length)
  }

  // Helper to split by underscore, camelCase, and numbers, then filter out empty strings
  private splitCombined(input: string): string[] {
    // Split by underscore first
    const underscoreParts = input.split("_")
    let combinedParts: string[] = []

    underscoreParts.forEach((part) => {
      // Add space before uppercase letters (camelCase) and before numbers
      const spacedPart = part
        .replace(/([A-Z]+)/g, " $1") // Handles sequences of uppercase like "MYID"
        .replace(/([A-Z][a-z])/g, " $1") // Handles regular camelCase like "MyIdentifier"
        .replace(/([a-z])([0-9])/g, "$1 $2") // Handles case like "word123"
        .replace(/([0-9])([A-Za-z])/g, "$1 $2") // Handles case like "123word"

      const splitParts = spacedPart.split(" ").filter((p) => p.length > 0)
      combinedParts = combinedParts.concat(splitParts)
    })
    return combinedParts.map((p) => p.trim()).filter((p) => p.length > 0)
  }

  private _initialSanitizeAndValidate(
    originalId: string,
    maxLength: number,
  ): { currentName: string; originalWasLong: boolean; errorName?: string } {
    if (!originalId || originalId.trim().length === 0)
      return { currentName: "", originalWasLong: false, errorName: "unnamed-tool" }

    const originalWasLong = originalId.length > maxLength
    let currentName = originalId.replace(/[^a-zA-Z0-9_]/g, "-")
    currentName = currentName.replace(/-+/g, "-").replace(/^-+|-+$/g, "")

    if (currentName.length === 0)
      return {
        currentName: "",
        originalWasLong,
        errorName: "tool-" + this.generateShortHash(originalId, 8),
      }

    return { currentName, originalWasLong }
  }

  private _performSemanticAbbreviation(name: string): string {
    let parts = this.splitCombined(name)
    parts = parts.filter((part) => {
      const cleanPartForCheck = part.toLowerCase().replace(/-+$/, "")
      return !REVISED_COMMON_WORDS_TO_REMOVE.includes(cleanPartForCheck)
    })

    parts = parts.map((part) => {
      const lowerPart = part.toLowerCase()
      if (WORD_ABBREVIATIONS[lowerPart]) {
        const abbr = WORD_ABBREVIATIONS[lowerPart]
        if (
          part.length > 0 &&
          part[0] === part[0].toUpperCase() &&
          part.slice(1) === part.slice(1).toLowerCase()
        ) {
          return abbr[0].toUpperCase() + abbr.substring(1).toLowerCase()
        } else if (part === part.toUpperCase() && part.length > 1 && abbr.length > 1) {
          return abbr.toUpperCase()
        } else if (part.length > 0 && part[0] === part[0].toUpperCase()) {
          return abbr[0].toUpperCase() + abbr.substring(1).toLowerCase()
        }
        return abbr.toLowerCase()
      }
      return part
    })
    return parts.join("-")
  }

  private _applyVowelRemovalIfOverLength(name: string, maxLength: number): string {
    let currentName = name
    if (currentName.length > maxLength) {
      const currentParts = currentName.split("-")
      const newParts = currentParts.map((part) => {
        const isAbbreviation = Object.values(WORD_ABBREVIATIONS).some(
          (abbr) => abbr.toLowerCase() === part.toLowerCase(),
        )
        if (part.length > 5 && !isAbbreviation) {
          const newPart = part[0] + part.substring(1).replace(/[aeiouAEIOU]/g, "")
          if (newPart.length < part.length && newPart.length > 1) return newPart
        }
        return part
      })
      currentName = newParts.join("-")
    }
    return currentName
  }

  private _truncateAndApplyHashIfNeeded(
    name: string,
    originalId: string,
    originalWasLong: boolean,
    maxLength: number,
  ): string {
    let currentName = name
    currentName = currentName.replace(/-+/g, "-").replace(/^-+|-+$/g, "") // Consolidate hyphens before length check for hashing

    const needsHash = originalWasLong || currentName.length > maxLength

    if (needsHash) {
      const hash = this.generateShortHash(originalId, 4)
      const maxLengthForBase = maxLength - hash.length - 1

      if (currentName.length > maxLengthForBase) {
        currentName = currentName.substring(0, maxLengthForBase)
        currentName = currentName.replace(/-+$/, "")
      }
      currentName = currentName + "-" + hash
    }
    return currentName
  }

  private _finalizeNameFormatting(name: string, originalId: string, maxLength: number): string {
    let finalName = name.toLowerCase()
    finalName = finalName
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")

    if (finalName.length > maxLength) {
      finalName = finalName.substring(0, maxLength)
      finalName = finalName.replace(/-+$/, "")
    }
    if (finalName.length === 0) {
      return "tool-" + this.generateShortHash(originalId, 8)
    }
    return finalName
  }

  public abbreviateOperationId(originalId: string, maxLength: number = 64): string {
    maxLength = this.disableAbbreviation ? Number.MAX_SAFE_INTEGER : maxLength
    const {
      currentName: sanitizedName,
      originalWasLong,
      errorName,
    } = this._initialSanitizeAndValidate(originalId, maxLength)
    if (errorName) return errorName

    let processedName
    if (this.disableAbbreviation) {
      processedName = this.splitCombined(sanitizedName).join("-")
    } else {
      processedName = this._performSemanticAbbreviation(sanitizedName)
      processedName = this._applyVowelRemovalIfOverLength(processedName, maxLength)
    }
    processedName = this._truncateAndApplyHashIfNeeded(
      processedName,
      originalId,
      originalWasLong,
      maxLength,
    )
    processedName = this._finalizeNameFormatting(processedName, originalId, maxLength)

    return processedName
  }
}
