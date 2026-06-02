import { config } from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Composio } from "@composio/core";
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";

// Load .env from the monorepo root (three directories up from apps/agent/src/)
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../../.env") });

const composio = new Composio({
  apiKey: process.env["COMPOSIO_API_KEY"],
  provider: new ClaudeAgentSDKProvider(),
});

// Each user that the agent acts on behalf of gets a stable userId.
const userId = process.env["COMPOSIO_USER_ID"] ?? "ronda_dev";

const prompt =
  process.argv[2] ??
  "List open GitHub issues for the Bonasib/crown repository";

const session = await composio.create(userId);
const tools = await session.tools();

const composioServer = createSdkMcpServer({
  name: "composio",
  version: "1.0.0",
  tools,
});

// Pre-allowlist every Composio MCP tool so the agent runs non-interactively.
// "bypassPermissions" is blocked when the process runs as root, so we use the
// default permission mode and whitelist the tool pattern instead.
const allowedTools = tools.map((t) => `mcp__composio__${t.name}`);

console.log(`\nAgent prompt: ${prompt}\n${"─".repeat(60)}`);

for await (const event of query({
  prompt,
  options: {
    mcpServers: { composio: composioServer },
    allowedTools,
  },
})) {
  if (event.type === "assistant") {
    for (const block of event.message.content) {
      if (block.type === "text" && block.text.trim()) {
        console.log("\nClaude:", block.text.trim());
      }
    }
  } else if (event.type === "result") {
    console.log(`\n${"─".repeat(60)}`);
    if (event.subtype === "success") {
      console.log("Result:", event.result);
    } else {
      console.error("Error:", event.errors.join("; "));
    }
  }
}
