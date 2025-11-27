export interface ElectronAPI {
  onInsultEvent: (callback: (data: any) => void) => void;
  triggerInsult: (data: any) => Promise<{ success: boolean }>;
  selectWatchDirectory: () => Promise<{ success: boolean; path?: string }>;
  stopWatcher: () => Promise<{ success: boolean }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
