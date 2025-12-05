import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { MCPWatcher, WatcherConfig } from '../mcp';
import { statisticsStore } from './StatisticsStore';

// Load environment variables - override system env vars
dotenv.config({ override: true });

let mainWindow: BrowserWindow | null = null;
let mcpWatcher: MCPWatcher | null = null;

function createWindow() {
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    hasShadow: false,
    skipTaskbar: false, // Show in taskbar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setPosition(0, 0);
  mainWindow.maximize();
  mainWindow.setBounds({ x: 0, y: 0, width: width, height: height });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Initially do NOT ignore mouse events - dashboard needs to be interactive
  mainWindow.setIgnoreMouseEvents(false);

  // Renderer will control click-through via IPC (set-clickthrough handler)
}

function startMCPWatcher(config: WatcherConfig) {
  try {
    if (mcpWatcher) {
      console.log('[Main] Stopping existing watcher');
      mcpWatcher.stop();
    }

    console.log('[Main] Starting MCP watcher with config:', config);
    mcpWatcher = new MCPWatcher(config);
    
    mcpWatcher.start((event) => {
      // Store statistics
      statisticsStore.addAnalysis({
        filePath: event.filePath,
        severity: event.severity,
        message: event.message,
        timestamp: Date.now(),
      });
      
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
  
  // DO NOT auto-start watcher - wait for user to select folder from dashboard
  console.log('[Main] Waiting for user to select folder from dashboard...');
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
  // Temporarily disable alwaysOnTop for dialog
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(false);
  }

  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openDirectory'],
    title: 'Select Directory to Watch',
  });

  // Re-enable alwaysOnTop after dialog closes
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(true);
  }

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];
    return { success: true, path: selectedPath };
  }

  return { success: false };
});

ipcMain.handle('select-watch-files', async () => {
  // Temporarily disable alwaysOnTop for dialog
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(false);
  }

  const result = await dialog.showOpenDialog(mainWindow!, {
    properties: ['openFile', 'multiSelections'],
    title: 'Select Files to Watch',
    filters: [
      { name: 'Code Files', extensions: ['js', 'ts', 'jsx', 'tsx', 'py', 'css', 'html', 'json', 'yml', 'yaml', 'md', 'glsl', 'shader'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  // Re-enable alwaysOnTop after dialog closes
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(true);
  }

  if (!result.canceled && result.filePaths.length > 0) {
    return { success: true, paths: result.filePaths };
  }

  return { success: false };
});

ipcMain.handle('start-watcher', async (_event, config: WatcherConfig) => {
  try {
    startMCPWatcher(config);
    return { success: true };
  } catch (error) {
    console.error('[Main] Error starting watcher:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('stop-watcher', async () => {
  if (mcpWatcher) {
    mcpWatcher.stop();
    mcpWatcher = null;
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('set-clickthrough', async (_event, enabled: boolean) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(enabled, { forward: true });
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('minimize-window', async () => {
  if (mainWindow) {
    mainWindow.minimize();
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('hide-window', async () => {
  if (mainWindow) {
    mainWindow.hide();
    return { success: true };
  }
  return { success: false };
});

ipcMain.handle('quit-app', async () => {
  if (mcpWatcher) {
    mcpWatcher.stop();
  }
  app.quit();
  return { success: true };
});

ipcMain.handle('get-statistics', async () => {
  try {
    const stats = statisticsStore.getStatistics();
    return { success: true, statistics: stats };
  } catch (error) {
    console.error('[Main] Error getting statistics:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('reset-statistics', async () => {
  try {
    statisticsStore.reset();
    return { success: true };
  } catch (error) {
    console.error('[Main] Error resetting statistics:', error);
    return { success: false, error: String(error) };
  }
});
