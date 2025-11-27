import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { MCPWatcher } from '../mcp';

let mainWindow: BrowserWindow | null = null;
let mcpWatcher: MCPWatcher | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 500,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.setPosition(
    Math.floor(process.platform === 'win32' ? require('electron').screen.getPrimaryDisplay().workAreaSize.width - 420 : 0),
    Math.floor(process.platform === 'win32' ? require('electron').screen.getPrimaryDisplay().workAreaSize.height - 520 : 0)
  );
}

function startMCPWatcher(watchPath: string) {
  try {
    if (mcpWatcher) {
      console.log('[Main] Stopping existing watcher');
      mcpWatcher.stop();
    }

    console.log('[Main] Starting MCP watcher for:', watchPath);
    mcpWatcher = new MCPWatcher(watchPath);
    
    mcpWatcher.start((event) => {
      // Forward MCP events to renderer with error handling
      if (mainWindow && !mainWindow.isDestroyed()) {
        console.log('[Main] Forwarding event to renderer:', event.severity);
        mainWindow.webContents.send('insult-event', event);
      } else {
        console.warn('[Main] Cannot forward event - window not available');
      }
    });
    
    console.log('[Main] MCP watcher started successfully');
  } catch (error) {
    console.error('[Main] Error starting MCP watcher:', error);
  }
}

app.whenReady().then(() => {
  createWindow();
  
  // Auto-start watching current directory in development
  if (process.env.NODE_ENV === 'development') {
    const watchPath = process.cwd();
    console.log('[MCP] Auto-starting watcher for:', watchPath);
    startMCPWatcher(watchPath);
  }
});

app.on('window-all-closed', () => {
  if (mcpWatcher) {
    mcpWatcher.stop();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('trigger-insult', async (_event, data) => {
  if (mainWindow) {
    mainWindow.webContents.send('insult-event', data);
  }
  return { success: true };
});

ipcMain.handle('select-watch-directory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Directory to Watch',
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    startMCPWatcher(selectedPath);
    return { success: true, path: selectedPath };
  }

  return { success: false };
});

ipcMain.handle('stop-watcher', async () => {
  if (mcpWatcher) {
    mcpWatcher.stop();
    mcpWatcher = null;
    return { success: true };
  }
  return { success: false };
});
