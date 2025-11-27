# Spec: MCP Server for Code Quality Monitoring

## Purpose
Define the Model Context Protocol server that monitors a selected project directory and reports code-quality issues back to the Electron app.

## Requirements

### 1. Directory Monitoring
- Use `chokidar` to watch for:
  - `file change`
  - `file add`
  - `file unlink`
- Only monitor files ending with:
  - `.js`, `.ts`, `.jsx`, `.tsx`, `.py`

### 2. Tools Exposed via MCP
#### Tool: analyze_code_quality(filePath)
Returns:
{
lines: number,
complexityScore: number,
containsConsoleLogs: boolean,
containsMagicNumbers: boolean,
insultSeverity: "low" | "medium" | "high"
}
### 3. Triggers
On each file save:
- run `analyze_code_quality`
- map severity to UI reaction
- send structured event to Electron:
{
type: "INSULT_TRIGGER",
severity,
filePath
}

markdown
Kodu kopyala

### 4. Performance Constraints
- Must run asynchronously.
- Must not block the IDE.
- Limit CPU usage.

### 5. Deliverables
- `mcp/index.ts`
- `mcp/analyzers/codeQualityAnalyzer.ts`