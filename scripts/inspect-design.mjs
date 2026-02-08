import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "npx",
  args: ["-y", "@playwright/mcp"],
});

const client = new Client(
  { name: "design-inspector", version: "0.1.0" },
  { capabilities: {} },
);

async function inspectDesign() {
  try {
    await client.connect(transport);
    const result = await client.listTools();
    const tools = result.tools;
    console.log("Available tools:", tools.map(t => t.name).join(", "));

    const evaluateTool = tools.find(t => t.name === "browser_evaluate" || t.name === "evaluate");
    if (evaluateTool) {
        console.log("Evaluate tool schema:", JSON.stringify(evaluateTool.inputSchema, null, 2));
    }
    const navigateTool = tools.find(t => t.name === "browser_navigate" || t.name === "navigate");

    if (!navigateTool) {
      console.log("Available tools:", tools.map(t => t.name).join(", "));
      console.error("No navigation tool found matching 'navigate' or 'browser_navigate'.");
      return;
    }

    // Navigate
    console.log("Navigating...");
    await client.callTool({
      name: navigateTool.name,
      arguments: { url: "https://workweave.dev" },
    });

    if (evaluateTool) {
      console.log("Extracting styles...");
      const styleExtractionScript = `
        (() => {
          const getStyle = (selector, prop) => {
            const el = document.querySelector(selector);
            return el ? window.getComputedStyle(el).getPropertyValue(prop) : null;
          };
          
          const primaryButton = document.querySelector('a[href*="login"], button, a[class*="btn"]'); 
          
          return {
            backgroundColor: getStyle('body', 'background-color'),
            textColor: getStyle('body', 'color'),
            h1Color: getStyle('h1', 'color'),
            h1Font: getStyle('h1', 'font-family'),
            h1Size: getStyle('h1', 'font-size'),
            accentColor: 'Check orange buttons visually or via specific selector' 
          };
        })()
      `;
      
      // Try to find an orange element or just dump the body content generally if evaluate is hard to pipe return values
      // Note: @playwright/mcp evaluate usually returns the result of the script
      
      const styles = await client.callTool({
        name: evaluateTool.name,
        arguments: { function: styleExtractionScript },
      });
      console.log("Extracted Styles:", JSON.stringify(styles, null, 2));
    } else {
        console.log("Evaluate tool not found. Fetching page content to parse...");
        // Fallback: Read content and infer.
        // Actually, without evaluate, getting exact computed styles is hard. 
        // I will rely on the text content extraction I already know works, and the user's image.
        // But I will try to 'dump' the HTML content to find classes if possible.
        
        const contentTool = tools.find(t => t.name === "get_content" || t.name === "content"); // Standard is often 'content' or 'snapshot' doesn't return html usually?
        // Actually, let's just use what we have.
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
}

inspectDesign();
