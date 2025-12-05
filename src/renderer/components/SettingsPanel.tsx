import React, { useState } from 'react';
import './SettingsPanel.css';

type TabId = 'avatar' | 'tracking' | 'sounds' | 'ai' | 'statistics' | 'personality' | 'general';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'avatar', label: 'Avatar', icon: '🎭' },
  { id: 'tracking', label: 'Tracking', icon: '📁' },
  { id: 'sounds', label: 'Sounds', icon: '🔊' },
  { id: 'ai', label: 'AI Analysis', icon: '🤖' },
  { id: 'statistics', label: 'Statistics', icon: '📊' },
  { id: 'personality', label: 'Personality', icon: '😈' },
  { id: 'general', label: 'General', icon: '⚙️' },
];

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('avatar');

  if (!isOpen) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <h1 className="settings-title">
            <span className="title-icon">👻</span>
            Evil Clippy Settings
          </h1>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="settings-content">
          {/* Sidebar */}
          <div className="settings-sidebar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="settings-body">
            {activeTab === 'avatar' && <AvatarTab />}
            {activeTab === 'tracking' && <TrackingTab />}
            {activeTab === 'sounds' && <SoundsTab />}
            {activeTab === 'ai' && <AITab />}
            {activeTab === 'statistics' && <StatisticsTab />}
            {activeTab === 'personality' && <PersonalityTab />}
            {activeTab === 'general' && <GeneralTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components (Placeholders)
function AvatarTab() {
  const [selectedHat, setSelectedHat] = useState<'none' | 'witch' | 'top'>('none');
  const [selectedWings, setSelectedWings] = useState<'none' | 'bat' | 'angel'>('none');
  const [selectedOverlay, setSelectedOverlay] = useState<'none' | 'ghost' | 'dark'>('none');

  return (
    <div className="tab-content">
      <h2 className="tab-title">Avatar Customization</h2>
      <p className="tab-description">Change Clippy's costume and accessories</p>
      
      <div className="setting-section">
        <h3>🎩 Hat Selection</h3>
        <div className="costume-grid">
          <div 
            className={`costume-card ${selectedHat === 'none' ? 'selected' : ''}`}
            onClick={() => setSelectedHat('none')}
          >
            ❌ None
          </div>
          <div 
            className={`costume-card ${selectedHat === 'witch' ? 'selected' : ''}`}
            onClick={() => setSelectedHat('witch')}
          >
            🧙 Witch Hat
          </div>
          <div 
            className={`costume-card ${selectedHat === 'top' ? 'selected' : ''}`}
            onClick={() => setSelectedHat('top')}
          >
            🎩 Top Hat
          </div>
        </div>
      </div>

      <div className="setting-section">
        <h3>🪽 Wings Selection</h3>
        <div className="costume-grid">
          <div 
            className={`costume-card ${selectedWings === 'none' ? 'selected' : ''}`}
            onClick={() => setSelectedWings('none')}
          >
            ❌ None
          </div>
          <div 
            className={`costume-card ${selectedWings === 'bat' ? 'selected' : ''}`}
            onClick={() => setSelectedWings('bat')}
          >
            🦇 Bat Wings
          </div>
          <div 
            className={`costume-card ${selectedWings === 'angel' ? 'selected' : ''}`}
            onClick={() => setSelectedWings('angel')}
          >
            👼 Angel Wings
          </div>
        </div>
      </div>

      <div className="setting-section">
        <h3>✨ Overlay Effects</h3>
        <div className="costume-grid">
          <div 
            className={`costume-card ${selectedOverlay === 'none' ? 'selected' : ''}`}
            onClick={() => setSelectedOverlay('none')}
          >
            ❌ None
          </div>
          <div 
            className={`costume-card ${selectedOverlay === 'ghost' ? 'selected' : ''}`}
            onClick={() => setSelectedOverlay('ghost')}
          >
            👻 Ghost Aura
          </div>
          <div 
            className={`costume-card ${selectedOverlay === 'dark' ? 'selected' : ''}`}
            onClick={() => setSelectedOverlay('dark')}
          >
            🌑 Dark Aura
          </div>
        </div>
      </div>

      <div className="setting-section">
        <h3>Animation Speed</h3>
        <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" className="slider" />
      </div>
    </div>
  );
}

function TrackingTab() {
  return (
    <div className="tab-content">
      <h2 className="tab-title">File Tracking</h2>
      <p className="tab-description">Configure which folders and files to monitor</p>
      
      <div className="setting-section">
        <h3>Watch Directories</h3>
        <button className="action-button">
          📁 Select Folder to Watch
        </button>
        <div className="watched-list">
          <div className="watched-item">
            <span>📂 /current/project</span>
            <button className="remove-button">✕</button>
          </div>
        </div>
      </div>

      <div className="setting-section">
        <h3>File Types</h3>
        <div className="checkbox-group">
          {['.js', '.ts', '.jsx', '.tsx', '.py', '.css'].map((ext) => (
            <label key={ext} className="checkbox-label">
              <input type="checkbox" defaultChecked={ext !== '.css'} />
              <span>{ext}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function SoundsTab() {
  return (
    <div className="tab-content">
      <h2 className="tab-title">Sound Effects</h2>
      <p className="tab-description">Adjust audio settings and volume</p>
      
      <div className="setting-section">
        <label className="setting-label">
          <span>Master Volume</span>
          <input type="range" min="0" max="100" defaultValue="70" className="slider" />
        </label>
      </div>

      <div className="setting-section">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span>Enable Sound Effects</span>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span>Enable Voice Lines</span>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>Mute During Meetings</span>
        </label>
      </div>
    </div>
  );
}

function AITab() {
  return (
    <div className="tab-content">
      <h2 className="tab-title">AI Analysis</h2>
      <p className="tab-description">Configure Gemini AI integration</p>
      
      <div className="setting-section">
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span>Enable Gemini AI Analysis</span>
        </label>
      </div>

      <div className="setting-section">
        <h3>API Key</h3>
        <input type="password" placeholder="Enter Gemini API Key" className="text-input" />
      </div>

      <div className="setting-section">
        <h3>Analysis Tone</h3>
        <select className="select-input">
          <option>Brutal & Sarcastic</option>
          <option>Mildly Annoyed</option>
          <option>Helpful & Kind</option>
        </select>
      </div>

      <div className="setting-section">
        <h3>Response Language</h3>
        <select className="select-input">
          <option>English</option>
          <option>Turkish</option>
          <option>Spanish</option>
        </select>
      </div>
    </div>
  );
}

function StatisticsTab() {
  return (
    <div className="tab-content">
      <h2 className="tab-title">Statistics</h2>
      <p className="tab-description">View your coding horror stats</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">247</div>
          <div className="stat-label">Files Analyzed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">89</div>
          <div className="stat-label">Roasts Delivered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">23</div>
          <div className="stat-label">Critical Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">156</div>
          <div className="stat-label">Laughs Triggered</div>
        </div>
      </div>
    </div>
  );
}

function PersonalityTab() {
  return (
    <div className="tab-content">
      <h2 className="tab-title">Personality</h2>
      <p className="tab-description">Customize Clippy's behavior style</p>
      
      <div className="setting-section">
        <h3>Behavior Mode</h3>
        <div className="radio-group">
          {[
            { id: 'playful', label: '😊 Playful', desc: 'Light-hearted and fun' },
            { id: 'scary', label: '👻 Scary', desc: 'Dark and spooky' },
            { id: 'sarcastic', label: '😈 Sarcastic', desc: 'Brutal and mocking' },
          ].map((mode) => (
            <label key={mode.id} className="radio-card">
              <input type="radio" name="personality" defaultChecked={mode.id === 'sarcastic'} />
              <div className="radio-content">
                <div className="radio-label">{mode.label}</div>
                <div className="radio-desc">{mode.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="setting-section">
        <label className="setting-label">
          <span>Roast Frequency</span>
          <input type="range" min="1" max="10" defaultValue="7" className="slider" />
        </label>
      </div>
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="tab-content">
      <h2 className="tab-title">General Settings</h2>
      <p className="tab-description">App preferences and information</p>
      
      <div className="setting-section">
        <h3>Appearance</h3>
        <label className="checkbox-label">
          <input type="checkbox" defaultChecked />
          <span>Dark Mode</span>
        </label>
      </div>

      <div className="setting-section">
        <h3>Startup</h3>
        <label className="checkbox-label">
          <input type="checkbox" />
          <span>Launch on System Startup</span>
        </label>
      </div>

      <div className="setting-section">
        <h3>About</h3>
        <div className="info-box">
          <p><strong>Evil Clippy</strong></p>
          <p>Version 1.0.0</p>
          <p>Kiroween Hackathon 2025</p>
        </div>
      </div>
    </div>
  );
}
