import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onInsultEvent: (callback: (data: any) => void) => {
    ipcRenderer.on('insult-event', (_event, data) => callback(data));
  },
  triggerInsult: (data: any) => ipcRenderer.invoke('trigger-insult', data),
  selectWatchDirectory: () => ipcRenderer.invoke('select-watch-directory'),
  selectWatchFiles: () => ipcRenderer.invoke('select-watch-files'),
  startWatcher: (config: any) => ipcRenderer.invoke('start-watcher', config),
  stopWatcher: () => ipcRenderer.invoke('stop-watcher'),
  setClickthrough: (enabled: boolean) => ipcRenderer.invoke('set-clickthrough', enabled),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  hideWindow: () => ipcRenderer.invoke('hide-window'),
  quitApp: () => ipcRenderer.invoke('quit-app'),
  getStatistics: () => ipcRenderer.invoke('get-statistics'),
  resetStatistics: () => ipcRenderer.invoke('reset-statistics'),
});
