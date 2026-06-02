import { Composio } from "@composio/core";
import { ClaudeAgentSDKProvider } from "@composio/claude-agent-sdk";
import { createSdkMcpServer, query } from "@anthropic-ai/claude-agent-sdk";

const composio = new Composio({ provider: new ClaudeAgentSDKProvider() });

// Each user/operator that the agent acts on behalf of gets a stable userId.
// In production this would come from session context; here we use a fixed dev id.
const userId = process.env["COMPOSIO_USER_ID"] ?? "ronda_dev";

const prompt = process.argv[2] ?? "List open GitHub issues for the Bonasib/crown repository";

const session = await composio.create(userId);
const tools = await session.tools();

const composioServer = createSdkMcpServer({
  name: "composio",
  version: "1.0.0",
  tools,
});

console.log(`\nAgent prompt: ${prompt}\n`);

for await (const content of query({
  prompt,
  options: {
    mcpServers: { composio: composioServer },
    permissionMode: "bypassPermissions",
  },
})) {
  if (content.type === "assistant") {
    console.log("Claude:", content.message);
  }
}
