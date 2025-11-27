# Kiro Integration Overview – Clippy's Revenge

This project was developed using several key Kiro IDE features, including:
- **Spec-driven development**
- **Vibe coding**
- **Agent hooks**
- **Steering documents**
- **MCP (Model Context Protocol) integration**

Each part of the `.kiro` directory documents how Kiro was used to generate, refine, and automate the development of “Clippy’s Revenge.”

## Structure

### `/specs`
Spec-driven development files used inside Kiro to generate UI components, MCP logic, and system behaviors. These files guided Kiro step-by-step to produce real code.

### `/hooks`
Custom automation logic. Hooks allowed Kiro to automatically run MCP analysis when files changed, or initialize the project environment.

### `/steering`
Behavior documents defining Clippy’s personality. These structured rules were used when vibe coding to ensure consistent tone and output.

### `/mcp`
Manifest describing the MCP server used by Kiro to monitor the user’s project directory and return code-quality insights.

## How Kiro Was Used

### 1. Spec-driven development
Specs such as `avatar_ui.md` and `mcp_server.md` were fed directly into Kiro’s “Specs” mode.  
Kiro generated:
- React components for the Clippy avatar  
- Tailwind/98.css UI  
- MCP file watchers  
- Electron window setup  
- IPC bridging code  

### 2. Vibe Coding
During UI iterations, vibe coding was used to refine:
- glitch animations  
- screen-shake effects  
- evil Clippy dialogue templates  

### 3. Hooks
Hooks automated core workflow steps, such as triggering MCP analysis on file save.

### 4. Steering
Clippy’s personality file (`clippy_dark_persona.md`) acted as a global behavioral rulebook to keep output sarcastic and spooky.

### 5. MCP
A custom MCP server was used to detect file changes, analyze code quality, and send events back to the Electron app.

This `.kiro` folder demonstrates complete and valid Kiro integration needed for hackathon submission.
