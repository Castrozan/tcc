/**
 * Validation script for path parameter handling
 *
 * This script demonstrates how path parameters are now handled in the API client:
 * 1. When path parameters are defined in OpenAPI spec with `in: "path"`, they're properly
 *    interpolated into the URL path
 * 2. Parameters are removed from the query string/body after being used in the path
 * 3. Only explicitly marked path parameters are substituted, preventing query parameters
 *    from being incorrectly applied to the path
 */

// Since we can't directly import the ApiClient from dist (bundled),
// this is a simplified demo of the path parameter handling logic

/**
 * Simplified demonstration of path parameter handling
 */
function demonstratePathParameterHandling() {
  console.log("Path Parameter Handling Demonstration")
  console.log("====================================\n")

  // Simplified implementation of our path parameter handling
  function processUrl(path, params, paramDefs) {
    const paramsCopy = { ...params }
    let resolvedPath = path

    // With parameter metadata from OpenAPI
    if (paramDefs) {
      console.log("Using OpenAPI parameter definitions:")

      // Check each parameter to see if it's a path parameter
      for (const [key, value] of Object.entries(paramsCopy)) {
        const paramDef = paramDefs[key]
        const paramLocation = paramDef?.['x-parameter-location']

        // If it's a path parameter, interpolate it
        if (paramLocation === "path") {
          resolvedPath = resolvedPath.replace(`/${key}`, `/${value}`)
          delete paramsCopy[key]
        }
      }
    } else {
      console.log("Fallback without OpenAPI definitions:")

      // Fallback behavior if tool definition is not available
      for (const key of Object.keys(paramsCopy)) {
        if (resolvedPath.includes(`/${key}`)) {
          const value = paramsCopy[key]
          resolvedPath = resolvedPath.replace(`/${key}`, `/${value}`)
          delete paramsCopy[key]
        }
      }
    }

    return {
      url: resolvedPath,
      remainingParams: paramsCopy,
    }
  }

  // Case 1: Simple path parameter with OpenAPI definitions
  console.log("Case 1: Simple path parameter with OpenAPI definition")
  console.log("--------------------------------------------------")
  const pathDefs1 = {
    petId: { 'x-parameter-location': "path" },
    format: { 'x-parameter-location': "query" },
  }
  const result1 = processUrl("/pet/petId", { petId: 1, format: "json" }, pathDefs1)
  console.log(`URL: ${result1.url}`)
  console.log(`Remaining parameters: ${JSON.stringify(result1.remainingParams)}\n`)

  // Case 2: Multiple path parameters with OpenAPI definitions
  console.log("Case 2: Multiple path parameters with OpenAPI definition")
  console.log("----------------------------------------------------")
  const pathDefs2 = {
    orderId: { 'x-parameter-location': "path" },
    itemId: { 'x-parameter-location': "path" },
    withDetails: { 'x-parameter-location': "query" },
  }
  const result2 = processUrl(
    "/store/order/orderId/item/itemId",
    { orderId: 123, itemId: 456, withDetails: true },
    pathDefs2,
  )
  console.log(`URL: ${result2.url}`)
  console.log(`Remaining parameters: ${JSON.stringify(result2.remainingParams)}\n`)

  // Case 3: Parameter with same name as path segment with OpenAPI definitions
  console.log("Case 3: Parameter matching path segment name but defined as query parameter")
  console.log("---------------------------------------------------------------------")
  const pathDefs3 = {
    query: { location: "query" },
    results: { location: "query" },
  }
  const result3 = processUrl("/search/results", { query: "test", results: "json" }, pathDefs3)
  console.log(`URL: ${result3.url}`)
  console.log(`Remaining parameters: ${JSON.stringify(result3.remainingParams)}\n`)

  // Case 4: Path parameter handler without OpenAPI definitions (fallback)
  console.log("Case 4: Fallback behavior without OpenAPI definitions")
  console.log("--------------------------------------------------")
  const result4 = processUrl("/pet/petId", { petId: 1, format: "json" })
  console.log(`URL: ${result4.url}`)
  console.log(`Remaining parameters: ${JSON.stringify(result4.remainingParams)}\n`)

  console.log("Demonstration complete! ✅")
}

// Run the demonstration
demonstratePathParameterHandling()
