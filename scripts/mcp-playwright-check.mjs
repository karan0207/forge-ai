import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const targetUrl = "https://workweave.dev";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@playwright/mcp"],
});

const client = new Client(
  { name: "playwright-mcp-check", version: "0.1.0" },
  { capabilities: {} },
);

const selectTool = (tools, regex) =>
  tools.find((tool) => regex.test(tool.name));

const buildInput = (tool, preferred) => {
  const schema = tool.inputSchema ?? {};
  const properties = schema.properties ?? {};
  const required = schema.required ?? [];
  const input = {};

  for (const key of Object.keys(properties)) {
    if (Object.prototype.hasOwnProperty.call(preferred, key)) {
      input[key] = preferred[key];
    }
  }

  for (const key of required) {
    if (!(key in input)) {
      const schemaEntry = properties[key];
      const enumValues = Array.isArray(schemaEntry?.enum)
        ? schemaEntry.enum
        : null;
      if (enumValues && enumValues.length > 0) {
        if (enumValues.includes("png")) {
          input[key] = "png";
          continue;
        }
        input[key] = enumValues[0];
        continue;
      }
      if (key === "url" || key === "uri" || key === "href") {
        input[key] = targetUrl;
        continue;
      }
      const type = schemaEntry?.type;
      if (type === "string") input[key] = "";
      else if (type === "number") input[key] = 0;
      else if (type === "boolean") input[key] = false;
      else if (type === "array") input[key] = [];
      else input[key] = {};
    }
  }

  return input;
};

try {
  await client.connect(transport);

  const toolsResult = await client.listTools();
  const tools = toolsResult.tools ?? [];

  const navigateTool = selectTool(tools, /navigate|goto|open/i);
  if (!navigateTool) {
    console.error("No navigate tool found. Available tools:");
    console.error(tools.map((tool) => tool.name).join("\n"));
    process.exitCode = 1;
  } else {
    const navigateInput = buildInput(navigateTool, { url: targetUrl });
    await client.callTool({
      name: navigateTool.name,
      arguments: navigateInput,
    });
    console.log(`Navigated to ${targetUrl}`);

    const titleTool = selectTool(tools, /title/i);
    if (titleTool) {
      const titleInput = buildInput(titleTool, {});
      const titleResult = await client.callTool({
        name: titleTool.name,
        arguments: titleInput,
      });
      console.log("Title result:", JSON.stringify(titleResult, null, 2));
    } else {
      const snapshotTool = selectTool(tools, /snapshot|screenshot|content/i);
      if (snapshotTool) {
        const snapshotInput = buildInput(snapshotTool, {});
        const snapshotResult = await client.callTool({
          name: snapshotTool.name,
          arguments: snapshotInput,
        });
        console.log("Snapshot result:", JSON.stringify(snapshotResult, null, 2));
      } else {
        console.log("No title or snapshot tool found.");
        console.log("Available tools:");
        console.log(tools.map((tool) => tool.name).join("\n"));
      }
    }
  }
} finally {
  await client.close();
}
