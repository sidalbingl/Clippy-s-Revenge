import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  onInsultEvent: (callback: (data: any) => void) => {
    ipcRenderer.on('insult-event', (_event, data) => callback(data));
  },
  triggerInsult: (data: any) => ipcRenderer.invoke('trigger-insult', data),
  selectWatchDirectory: () => ipcRenderer.invoke('select-watch-directory'),
  stopWatcher: () => ipcRenderer.invoke('stop-watcher'),
});
