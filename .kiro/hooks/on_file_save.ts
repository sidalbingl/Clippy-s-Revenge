export default async function onFileSave(ctx) {
  const filePath = ctx?.event?.filePath;
  if (!filePath) return;

  // MCP bağlan
  const mcp = await ctx.connectMCP("clippy-mcp");

  // MCP analiz çağrısı
  const result = await mcp.callTool("analyze_code_quality", {
    filePath,
  });

  // Kiro’ya geri mesaj gönder
  ctx.sendMessage({
    role: "system",
    content: `Clippy analyzed file. Severity: ${result.insultSeverity}`,
  });
}
