import React, { useState, useEffect } from 'react';
import { Avatar } from './Avatar';
import './WelcomeDashboard.css';

export interface DashboardSettings {
  watchFolders: string[]; // Multiple folders
  watchFiles: string[]; // Individual files
  fileTypes: {
    js: boolean;
    ts: boolean;
    jsx: boolean;
    tsx: boolean;
    py: boolean;
    css: boolean;
    html: boolean;
    json: boolean;
    yml: boolean;
    md: boolean;
    gitignore: boolean;
    glsl: boolean;
    shader: boolean;
  };
  watchSubfolders: boolean;
  accessories: {
    hat: 'none' | 'witch' | 'top';
    wings: 'none' | 'bat' | 'angel';
    overlay: 'none' | 'ghost' | 'dark';
  };
  soundEnabled: boolean;
  aggressionLevel: number; // 1-10
}

interface WelcomeDashboardProps {
  onStart: (settings: DashboardSettings) => void;
  onClose?: () => void;
}

type TabId = 'folder' | 'appearance' | 'statistics' | 'audio';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'folder', label: 'Folder', icon: '📁' },
  { id: 'appearance', label: 'Appearance', icon: '🎭' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'audio', label: 'Audio', icon: '🔊' },
];

const STORAGE_KEY = 'evil-clippy-settings';

export function WelcomeDashboard({ onStart, onClose }: WelcomeDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('folder');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [settings, setSettings] = useState<DashboardSettings>({
    watchFolders: [],
    watchFiles: [],
    fileTypes: {
      js: true,
      ts: true,
      jsx: true,
      tsx: true,
      py: false,
      css: true,
      html: false,
      json: false,
      yml: false,
      md: false,
      gitignore: false,
      glsl: false,
      shader: false,
    },
    watchSubfolders: true,
    accessories: {
      hat: 'witch',
      wings: 'bat',
      overlay: 'none',
    },
    soundEnabled: true,
    aggressionLevel: 7,
  });

  // Load saved settings on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        console.error('[Dashboard] Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const handleSelectFolder = async () => {
    if (window.electronAPI?.selectWatchDirectory) {
      const result = await window.electronAPI.selectWatchDirectory();
      if (result.success && result.path) {
        // Add folder if not already in list
        if (!settings.watchFolders.includes(result.path)) {
          setSettings({
            ...settings,
            watchFolders: [...settings.watchFolders, result.path],
          });
        }
      }
    }
  };

  const handleSelectFiles = async () => {
    if (window.electronAPI?.selectWatchFiles) {
      const result = await window.electronAPI.selectWatchFiles();
      if (result.success && result.paths && result.paths.length > 0) {
        // Add files that aren't already in the list
        const newFiles = result.paths.filter((path: string) => !settings.watchFiles.includes(path));
        if (newFiles.length > 0) {
          setSettings({
            ...settings,
            watchFiles: [...settings.watchFiles, ...newFiles],
          });
        }
      }
    }
  };

  const handleRemoveFolder = (folderPath: string) => {
    setSettings({
      ...settings,
      watchFolders: settings.watchFolders.filter((f) => f !== folderPath),
    });
  };

  const handleRemoveFile = (filePath: string) => {
    setSettings({
      ...settings,
      watchFiles: settings.watchFiles.filter((f) => f !== filePath),
    });
  };

  const handleToggleFileType = (fileType: keyof DashboardSettings['fileTypes']) => {
    setActivePreset(null); // Clear preset when manually toggling
    setSettings({
      ...settings,
      fileTypes: {
        ...settings.fileTypes,
        [fileType]: !settings.fileTypes[fileType],
      },
    });
  };

  const applyPreset = (presetId: string, fileTypes: DashboardSettings['fileTypes']) => {
    setActivePreset(presetId);
    setSettings({
      ...settings,
      fileTypes,
    });
  };

  const handleStart = () => {
    if (settings.watchFolders.length === 0 && settings.watchFiles.length === 0) {
      alert('Please select at least one folder or file to watch! 👻');
      return;
    }

    // Check if at least one file type is selected (only if watching folders)
    if (settings.watchFolders.length > 0) {
      const hasFileType = Object.values(settings.fileTypes).some((enabled) => enabled);
      if (!hasFileType) {
        alert('Please select at least one file type to monitor! 📄');
        return;
      }
    }

    onStart(settings);
  };

  const accessories = {
    hat: [
      { id: 'witch' as const, emoji: '🧙', name: 'Witch Hat', desc: 'Purple witch hat' },
      { id: 'top' as const, emoji: '🎩', name: 'Top Hat', desc: 'Classic gentleman' },
    ],
    wings: [
      { id: 'bat' as const, emoji: '🦇', name: 'Bat Wings', desc: 'Dark vampire wings' },
      { id: 'angel' as const, emoji: '👼', name: 'Angel Wings', desc: 'Holy white wings' },
    ],
    overlay: [
      { id: 'ghost' as const, emoji: '👻', name: 'Ghost Aura', desc: 'Ethereal glow' },
      { id: 'dark' as const, emoji: '🌑', name: 'Dark Aura', desc: 'Mysterious dark energy' },
    ],
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (onClose) {
      onClose();
    }
  };

  const handlePreventDefault = (e: React.WheelEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="dashboard-overlay"
      onClick={handleOverlayClick}
      onWheel={handlePreventDefault}
      onContextMenu={handlePreventDefault}
    >
      <div
        className="dashboard-container"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <div className="header-avatar">
              <Avatar state="idle" enableFloating={false} />
            </div>
            <div className="header-text">
              <h1 className="header-title">Evil Clippy</h1>
              <p className="header-subtitle">Configuration Panel</p>
            </div>
          </div>
          <div className="header-buttons">
            <button
              className="minimize-btn"
              onClick={async () => {
                if (window.electronAPI?.minimizeWindow) {
                  await window.electronAPI.minimizeWindow();
                }
              }}
              title="Minimize"
            >
              −
            </button>
            <button
              className="close-btn"
              onClick={async () => {
                if (window.electronAPI?.quitApp) {
                  await window.electronAPI.quitApp();
                }
              }}
              title="Quit"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="dashboard-main">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="dashboard-content">
            {activeTab === 'folder' && (
              <div className="content-section">
                <h2 className="content-title">Files & Folders to Monitor</h2>
                <p className="content-desc">Add project folders or specific files you want Evil Clippy to watch</p>

                {/* Privacy Warning */}
                <div className="warning-box" style={{ marginBottom: '20px' }}>
                  <span className="warning-icon">⚠️</span>
                  <div className="warning-text">
                    <strong>Privacy Notice:</strong> Your code will be analyzed by Google Gemini AI. 
                    Code snippets are sent to Google's servers for analysis. 
                    Do not use with sensitive or proprietary code without permission.
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                  <button className="folder-select-btn" onClick={handleSelectFolder}>
                    <span className="folder-icon">📂</span>
                    <span className="folder-text">Add Folder</span>
                  </button>
                  <button className="folder-select-btn" onClick={handleSelectFiles}>
                    <span className="folder-icon">📄</span>
                    <span className="folder-text">Add Files</span>
                  </button>
                </div>

                {/* Folder List */}
                {settings.watchFolders.length > 0 && (
                  <div className="folder-list">
                    <h3 className="list-title">Monitored Folders ({settings.watchFolders.length})</h3>
                    {settings.watchFolders.map((folder) => (
                      <div key={folder} className="folder-item">
                        <span className="folder-item-icon">📁</span>
                        <span className="folder-item-path">{folder}</span>
                        <button
                          className="folder-remove-btn"
                          onClick={() => handleRemoveFolder(folder)}
                          title="Remove folder"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File List */}
                {settings.watchFiles.length > 0 && (
                  <div className="folder-list">
                    <h3 className="list-title">Monitored Files ({settings.watchFiles.length})</h3>
                    {settings.watchFiles.map((file) => (
                      <div key={file} className="folder-item">
                        <span className="folder-item-icon">📄</span>
                        <span className="folder-item-path">{file}</span>
                        <button
                          className="folder-remove-btn"
                          onClick={() => handleRemoveFile(file)}
                          title="Remove file"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Magic Presets */}
                <div className="magic-presets-section">
                  <h3 className="section-subtitle">🔮 Magic Presets</h3>
                  <p className="preset-desc">Choose your dark path, mortal...</p>
                  
                  <div className="presets-grid">
                    <button
                      className={`preset-card ${activePreset === 'react' ? 'active' : ''}`}
                      onClick={() => applyPreset('react', { 
                        js: true, jsx: true, ts: true, tsx: true, css: true, 
                        py: false, html: false, json: false, yml: false, md: false, gitignore: false, glsl: false, shader: false 
                      })}
                    >
                      <div className="preset-icon">🧙‍♂️</div>
                      <div className="preset-name">React Wizard</div>
                      <div className="preset-files">.js .jsx .ts .tsx .css</div>
                    </button>

                    <button
                      className={`preset-card ${activePreset === 'python' ? 'active' : ''}`}
                      onClick={() => applyPreset('python', { 
                        py: true, yml: true, json: true,
                        js: false, jsx: false, ts: false, tsx: false, css: false, html: false, md: false, gitignore: false, glsl: false, shader: false
                      })}
                    >
                      <div className="preset-icon">🐍</div>
                      <div className="preset-name">Python Mage</div>
                      <div className="preset-files">.py .yml .json</div>
                    </button>

                    <button
                      className={`preset-card ${activePreset === 'fullstack' ? 'active' : ''}`}
                      onClick={() => applyPreset('fullstack', { 
                        js: true, ts: true, tsx: true, jsx: true, html: true, css: true, json: true,
                        py: false, yml: false, md: false, gitignore: false, glsl: false, shader: false
                      })}
                    >
                      <div className="preset-icon">🕸</div>
                      <div className="preset-name">Fullstack Shadowlord</div>
                      <div className="preset-files">.js .ts .tsx .html .css</div>
                    </button>

                    <button
                      className={`preset-card ${activePreset === 'gamedev' ? 'active' : ''}`}
                      onClick={() => applyPreset('gamedev', { 
                        ts: true, glsl: true, shader: true, json: true,
                        js: false, jsx: false, tsx: false, py: false, css: false, html: false, yml: false, md: false, gitignore: false
                      })}
                    >
                      <div className="preset-icon">🕷</div>
                      <div className="preset-name">Spooky Game Dev</div>
                      <div className="preset-files">.ts .glsl .shader .json</div>
                    </button>

                    <button
                      className={`preset-card ${activePreset === 'config' ? 'active' : ''}`}
                      onClick={() => applyPreset('config', { 
                        json: true, yml: true, md: true, gitignore: true,
                        js: false, jsx: false, ts: false, tsx: false, py: false, css: false, html: false, glsl: false, shader: false
                      })}
                    >
                      <div className="preset-icon">☠</div>
                      <div className="preset-name">Soul Files</div>
                      <div className="preset-files">.json .yml .md .gitignore</div>
                    </button>
                  </div>

                  {/* Manual Override */}
                  <details className="manual-override">
                    <summary className="override-toggle">⚙️ Manual Override (Advanced)</summary>
                    <div className="file-types-grid">
                      {Object.entries(settings.fileTypes).map(([type, enabled]) => (
                        <label key={type} className="file-type-checkbox">
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => handleToggleFileType(type as keyof DashboardSettings['fileTypes'])}
                          />
                          <span className="checkbox-custom"></span>
                          <span className="checkbox-label">.{type}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>

                {/* Subfolder Toggle */}
                <div className="subfolder-toggle">
                  <label className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-title">Watch Subfolders</span>
                      <span className="toggle-subtitle">Monitor files in nested directories</span>
                    </div>
                    <label className="modern-toggle">
                      <input
                        type="checkbox"
                        checked={settings.watchSubfolders}
                        onChange={(e) => setSettings({ ...settings, watchSubfolders: e.target.checked })}
                      />
                      <span className="toggle-switch"></span>
                    </label>
                  </label>
                </div>

                {/* Info Box */}
                <div className="info-box">
                  <span className="info-box-icon">ℹ️</span>
                  <div className="info-box-text">
                    <strong>Auto-ignored:</strong> node_modules, .git, dist, build folders are automatically excluded
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="content-section">
                <h2 className="content-title">Avatar Accessories</h2>
                <p className="content-desc">Customize your Clippy with accessories</p>

                {/* Split Layout: Preview Left, Options Right */}
                <div className="appearance-layout">
                  {/* Left: Live Preview */}
                  <div className="appearance-preview">
                    <div className="avatar-preview-container">
                      <div className="avatar-preview">
                        <Avatar state="idle" accessories={settings.accessories} enableFloating={false} />
                      </div>
                      <p className="preview-label">Live Preview</p>
                    </div>
                  </div>

                  {/* Right: Accessory Selection */}
                  <div className="appearance-options">
                    {/* Hat Selection */}
                    <div className="accessory-category">
                      <div className="category-header">
                        <h3 className="category-title">Headwear</h3>
                      </div>
                      <div className="accessory-grid">
                        {accessories.hat.map((item) => (
                          <button
                            key={item.id}
                            className={`accessory-card ${settings.accessories.hat === item.id ? 'active' : ''}`}
                            onClick={() => setSettings({
                              ...settings,
                              accessories: {
                                ...settings.accessories,
                                hat: settings.accessories.hat === item.id ? 'none' : item.id
                              }
                            })}
                          >
                            <div className="card-emoji">{item.emoji}</div>
                            <div className="card-name">{item.name}</div>
                            <div className="card-desc">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Wings Selection */}
                    <div className="accessory-category">
                      <div className="category-header">
                        <h3 className="category-title">Wings</h3>
                      </div>
                      <div className="accessory-grid">
                        {accessories.wings.map((item) => (
                          <button
                            key={item.id}
                            className={`accessory-card ${settings.accessories.wings === item.id ? 'active' : ''}`}
                            onClick={() => setSettings({
                              ...settings,
                              accessories: {
                                ...settings.accessories,
                                wings: settings.accessories.wings === item.id ? 'none' : item.id
                              }
                            })}
                          >
                            <div className="card-emoji">{item.emoji}</div>
                            <div className="card-name">{item.name}</div>
                            <div className="card-desc">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Effect Selection */}
                    <div className="accessory-category">
                      <div className="category-header">
                        <h3 className="category-title">Special Effects</h3>
                      </div>
                      <div className="accessory-grid">
                        {accessories.overlay.map((item) => (
                          <button
                            key={item.id}
                            className={`accessory-card ${settings.accessories.overlay === item.id ? 'active' : ''}`}
                            onClick={() => setSettings({
                              ...settings,
                              accessories: {
                                ...settings.accessories,
                                overlay: settings.accessories.overlay === item.id ? 'none' : item.id
                              }
                            })}
                          >
                            <div className="card-emoji">{item.emoji}</div>
                            <div className="card-name">{item.name}</div>
                            <div className="card-desc">{item.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'statistics' && <StatisticsTab />}

            {activeTab === 'audio' && (
              <div className="content-section">
                <h2 className="content-title">Audio Settings</h2>
                <p className="content-desc">Configure sound effects and voice</p>

                <div className="toggle-container">
                  <div className="toggle-item">
                    <div className="toggle-info">
                      <span className="toggle-title">Sound Effects</span>
                      <span className="toggle-subtitle">Enable spooky sounds and voice lines</span>
                    </div>
                    <label className="modern-toggle">
                      <input
                        type="checkbox"
                        checked={settings.soundEnabled}
                        onChange={(e) => setSettings({ ...settings, soundEnabled: e.target.checked })}
                      />
                      <span className="toggle-switch"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <button
            className={`start-btn ${settings.watchFolders.length === 0 && settings.watchFiles.length === 0 ? 'disabled' : ''}`}
            onClick={handleStart}
            disabled={settings.watchFolders.length === 0 && settings.watchFiles.length === 0}
          >
            <span className="start-icon">🎃</span>
            <span>Summon Evil Clippy</span>
          </button>
          {settings.watchFolders.length === 0 && settings.watchFiles.length === 0 && (
            <p className="footer-warning">⚠️ Please add at least one folder or file</p>
          )}
        </div>
      </div>
    </div>
  );
}


// Statistics Tab Component
function StatisticsTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
    // Refresh every 5 seconds
    const interval = setInterval(loadStatistics, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStatistics = async () => {
    if ((window.electronAPI as any)?.getStatistics) {
      const result = await (window.electronAPI as any).getStatistics();
      if (result.success) {
        setStats(result.statistics);
        setLoading(false);
      }
    }
  };

  if (loading || !stats) {
    return (
      <div className="content-section">
        <h2 className="content-title">Code Analysis Statistics</h2>
        <p className="content-desc">Loading statistics...</p>
      </div>
    );
  }

  const total = stats.severityDistribution.low + stats.severityDistribution.medium + stats.severityDistribution.high;
  const lowPercent = total > 0 ? (stats.severityDistribution.low / total) * 100 : 0;
  const mediumPercent = total > 0 ? (stats.severityDistribution.medium / total) * 100 : 0;
  const highPercent = total > 0 ? (stats.severityDistribution.high / total) * 100 : 0;

  return (
    <div className="content-section">
      <h2 className="content-title">Code Analysis Statistics</h2>
      <p className="content-desc">Track your coding quality and Clippy's feedback</p>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{stats.totalAnalyses}</div>
          <div className="stat-label">Files Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-value">{stats.roastsDelivered}</div>
          <div className="stat-label">Roasts Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">{stats.criticalIssues}</div>
          <div className="stat-label">Critical Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">😈</div>
          <div className="stat-value">{stats.angryMoments}</div>
          <div className="stat-label">Angry Moments</div>
        </div>
      </div>

      {/* Severity Distribution */}
      <div className="stats-section">
        <h3 className="section-subtitle">Severity Distribution</h3>
        <div className="severity-bars">
          <div className="severity-bar">
            <div className="severity-info">
              <span className="severity-label">🟢 Low</span>
              <span className="severity-count">{stats.severityDistribution.low}</span>
            </div>
            <div className="severity-progress">
              <div className="severity-fill low" style={{ width: `${lowPercent}%` }}></div>
            </div>
          </div>
          <div className="severity-bar">
            <div className="severity-info">
              <span className="severity-label">🟡 Medium</span>
              <span className="severity-count">{stats.severityDistribution.medium}</span>
            </div>
            <div className="severity-progress">
              <div className="severity-fill medium" style={{ width: `${mediumPercent}%` }}></div>
            </div>
          </div>
          <div className="severity-bar">
            <div className="severity-info">
              <span className="severity-label">🔴 High</span>
              <span className="severity-count">{stats.severityDistribution.high}</span>
            </div>
            <div className="severity-progress">
              <div className="severity-fill high" style={{ width: `${highPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Problem Files */}
      <div className="stats-section">
        <h3 className="section-subtitle">Most Problematic Files</h3>
        {stats.problemFiles.length > 0 ? (
          <div className="problem-files">
            {stats.problemFiles.map((file: any, index: number) => (
              <div key={file.filePath} className="problem-file">
                <span className="file-rank">{index + 1}</span>
                <span className="file-name">{file.filePath.split(/[/\\]/).pop()}</span>
                <span className="file-issues">{file.issueCount} issues</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>No issues detected yet. Keep coding!</p>
        )}
      </div>
    </div>
  );
}
