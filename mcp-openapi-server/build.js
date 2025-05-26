import * as esbuild from "esbuild";
await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "./dist/bundle.js",
  target: "node18",
  external: [
    "@modelcontextprotocol/sdk",
    "@modelcontextprotocol/sdk/server/index.js",
    "@modelcontextprotocol/sdk/server/stdio.js",
    "@modelcontextprotocol/sdk/server/transport.js",
    "@modelcontextprotocol/sdk/types.js"
  ],
  banner: {
    js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);`,
  },
});
