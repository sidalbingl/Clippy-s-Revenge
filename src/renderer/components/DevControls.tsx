import { useState } from 'react';

export const DevControls = () => {
  const [isVisible, setIsVisible] = useState(false);

  const triggerTestEvent = (severity: 'low' | 'medium' | 'high') => {
    const messages = {
      low: "I've seen interns write better variable names.",
      medium: "Are you trying to summon undefined behavior?",
      high: "This code is the real horror story here.",
    };

    if (window.electronAPI) {
      window.electronAPI.triggerInsult({
        type: 'INSULT_TRIGGER',
        severity,
        filePath: 'test.ts',
        message: messages[severity],
      });
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-2 right-2 bg-evil-dark border border-evil-grey text-gray-400 px-2 py-1 text-xs font-mono opacity-50 hover:opacity-100 hover:border-evil-red-dark transition-all"
        style={{ 
          WebkitAppRegion: 'no-drag',
          boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.8)',
        } as any}
      >
        [DEV]
      </button>
    );
  }

  return (
    <div 
      className="fixed top-2 right-2 bg-evil-black border-2 border-evil-red-dark p-3 text-white text-xs font-mono"
      style={{ 
        WebkitAppRegion: 'no-drag',
        boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.9), 0 0 12px rgba(255, 0, 0, 0.3)',
      } as any}
    >
      <div className="flex justify-between items-center mb-3 border-b border-evil-grey pb-2">
        <span className="text-evil-red font-bold tracking-wider">DEV CONTROLS</span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-evil-red transition-colors"
        >
          [X]
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={() => triggerTestEvent('low')}
          className="w-full bg-evil-grey hover:bg-gray-700 border border-gray-600 px-3 py-1.5 transition-all hover:border-gray-500"
          style={{ boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.8)' }}
        >
          [LOW] Test
        </button>
        <button
          onClick={() => triggerTestEvent('medium')}
          className="w-full bg-orange-900 hover:bg-orange-800 border border-orange-700 px-3 py-1.5 transition-all hover:border-orange-600"
          style={{ boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.8)' }}
        >
          [MED] Test
        </button>
        <button
          onClick={() => triggerTestEvent('high')}
          className="w-full bg-evil-red-darker hover:bg-evil-red-dark border border-evil-red-dark px-3 py-1.5 transition-all hover:border-evil-red"
          style={{ boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.8)' }}
        >
          [HIGH] Test
        </button>
      </div>
    </div>
  );
};
