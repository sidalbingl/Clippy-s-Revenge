export {};

declare global {
  interface Window {
    electronAPI: {
      onInsultEvent: (callback: (data: any) => void) => void;
      triggerInsult: (data: any) => Promise<{ success: boolean }>;
      selectWatchDirectory: () => Promise<{ success: boolean; path?: string }>;
      selectWatchFiles: () => Promise<{ success: boolean; paths?: string[] }>;
      startWatcher: (config: any) => Promise<{ success: boolean; error?: string }>;
      stopWatcher: () => Promise<{ success: boolean }>;
      setClickthrough: (enabled: boolean) => Promise<{ success: boolean }>;
      minimizeWindow: () => Promise<{ success: boolean }>;
      hideWindow: () => Promise<{ success: boolean }>;
      quitApp: () => Promise<{ success: boolean }>;
      getStatistics: () => Promise<{ success: boolean; statistics?: any; error?: string }>;
      resetStatistics: () => Promise<{ success: boolean; error?: string }>;
      setIgnoreMouseEvents?: (ignore: boolean, options?: { forward: boolean }) => void;
    };
  }
}
