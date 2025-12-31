// ==================================
// codex-assets-manager/src/app/AppShell.tsx
// ==================================
/**
 * Root application shell
 * Provides layout grid and auth gate
 */
import React from 'react';
import { TopBar } from '../layout/TopBar';
import { Sidebar } from '../layout/Sidebar';
import { MainPanel } from '../layout/MainPanel';
import { VaultGuard } from './VaultGuard';

export const AppShell: React.FC = () => {
  return (
    <VaultGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <TopBar />
        <div className="flex h-full">
          <Sidebar />
          <MainPanel />
        </div>
      </div>
    </VaultGuard>
  );
};

// ==================================
// codex-assets-manager/src/app/VaultGuard.tsx
// ==================================
/**
 * Authentication gate
 * Checks Vault session before rendering children
 */
import React, { useEffect, useState } from 'react';
import { vaultClient } from '../api/vaultClient';

interface VaultGuardProps {
  children: React.ReactNode;
}

export const VaultGuard: React.FC<VaultGuardProps> = ({ children }) => {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vaultClient.getSession()
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading Vault session...</div>;
  }

  if (!session) {
    return <div>Unauthorized. Vault session required.</div>;
  }

  return <>{children}</>;
};

// ==================================
// codex-assets-manager/src/app/routes.tsx
// ==================================
/**
 * Route definitions
 */
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AssetsList } from '../assets/AssetsList';
import { AssetDetail } from '../assets/AssetDetail';
import { IngestView } from '../ingest/IngestView';
import { VaultView } from '../vault/VaultView';
import { ActivityLog } from '../activity/ActivityLog';
import { SystemControls } from '../system/SystemControls';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AssetsList />} />
      <Route path="/assets" element={<AssetsList />} />
      <Route path="/assets/:id" element={<AssetDetail />} />
      <Route path="/ingest" element={<IngestView />} />
      <Route path="/vault" element={<VaultView />} />
      <Route path="/activity" element={<ActivityLog />} />
      <Route path="/system" element={<SystemControls />} />
    </Routes>
  );
};

// ==================================
// codex-assets-manager/src/layout/TopBar.tsx
// ==================================
/**
 * Top navigation bar
 * Shows Vault status and identity
 */
import React from 'react';

interface TopBarProps {
  vaultStatus?: 'secure' | 'degraded' | 'locked';
  identity?: string;
  activeAssets?: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  vaultStatus = 'secure',
  identity = 'Founder',
  activeAssets = 0
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Codex Assets Manager</h1>
        <span className="text-xs text-slate-500">Vault: {vaultStatus}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm">{identity}</span>
        <span className="text-xs text-slate-500">Active: {activeAssets}</span>
      </div>
    </header>
  );
};

// ==================================
// codex-assets-manager/src/layout/Sidebar.tsx
// ==================================
/**
 * Navigation sidebar
 * Asset-first navigation
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/assets', label: 'Assets' },
  { path: '/ingest', label: 'Ingest' },
  { path: '/vault', label: 'Vault' },
  { path: '/activity', label: 'Activity' },
  { path: '/system', label: 'System' }
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 p-4">
      <nav className="space-y-2">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-4 py-2 rounded ${
              location.pathname === item.path
                ? 'bg-cyan-400 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

// ==================================
// codex-assets-manager/src/layout/MainPanel.tsx
// ==================================
/**
 * Main content area
 * Route container
 */
import React from 'react';
import { AppRoutes } from '../app/routes';

export const MainPanel: React.FC = () => {
  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <AppRoutes />
    </main>
  );
};

// ==================================
// codex-assets-manager/src/ingest/IngestView.tsx
// ==================================
/**
 * Ingest screen
 * Upload → Scan → Bind flow
 */
import React, { useState } from 'react';
import { UploadZone } from './UploadZone';
import { ScanResults } from './ScanResults';
import { BindAction } from './BindAction';

export const IngestView: React.FC = () => {
  const [ingestId, setIngestId] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<unknown>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Ingest App</h2>
      
      <UploadZone onUpload={setIngestId} />
      
      {ingestId && (
        <ScanResults 
          ingestId={ingestId} 
          onScanComplete={setScanResult}
        />
      )}
      
      {scanResult && (
        <BindAction 
          ingestId={ingestId!} 
          scanResult={scanResult}
        />
      )}
    </div>
  );
};

// ==================================
// codex-assets-manager/src/ingest/UploadZone.tsx
// ==================================
/**
 * File upload component
 * Drag/drop or select folder
 */
import React from 'react';

interface UploadZoneProps {
  onUpload: (ingestId: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onUpload }) => {
  const handleUpload = async (files: FileList | null) => {
    // TODO: Implement upload to Vault
    // POST /vault/ingest/upload
    console.log('Upload', files);
  };

  return (
    <div className="border-2 border-dashed border-slate-700 rounded-lg p-12 text-center">
      <input 
        type="file" 
        onChange={(e) => handleUpload(e.target.files)}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <p className="text-lg mb-2">Drop project folder here</p>
        <p className="text-sm text-slate-500">or click to select</p>
      </label>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/ingest/ScanResults.tsx
// ==================================
/**
 * Display scan results
 * Read-only capability detection
 */
import React, { useEffect, useState } from 'react';
import { vaultClient } from '../api/vaultClient';

interface ScanResultsProps {
  ingestId: string;
  onScanComplete: (result: unknown) => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({ 
  ingestId, 
  onScanComplete 
}) => {
  const [result, setResult] = useState<unknown>(null);

  useEffect(() => {
    vaultClient.scanIngest(ingestId)
      .then(data => {
        setResult(data);
        onScanComplete(data);
      });
  }, [ingestId]);

  if (!result) {
    return <div>Scanning...</div>;
  }

  return (
    <div className="bg-slate-900 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Scan Results</h3>
      <pre className="text-sm text-slate-400">{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/ingest/BindAction.tsx
// ==================================
/**
 * Bind asset to Vault
 * Final step of ingest
 */
import React from 'react';
import { vaultClient } from '../api/vaultClient';

interface BindActionProps {
  ingestId: string;
  scanResult: unknown;
}

export const BindAction: React.FC<BindActionProps> = ({ 
  ingestId, 
  scanResult 
}) => {
  const handleBind = async () => {
    // TODO: Implement bind
    // POST /vault/ingest/:id/bind
    await vaultClient.bindIngest(ingestId);
  };

  return (
    <button 
      onClick={handleBind}
      className="bg-cyan-400 text-black px-6 py-3 rounded-lg font-bold"
    >
      Bind to Vault
    </button>
  );
};

// ==================================
// codex-assets-manager/src/assets/AssetsList.tsx
// ==================================
/**
 * List of managed assets
 */
import React, { useEffect, useState } from 'react';
import { vaultClient } from '../api/vaultClient';
import { AssetCard } from './AssetCard';

export const AssetsList: React.FC = () => {
  const [assets, setAssets] = useState<unknown[]>([]);

  useEffect(() => {
    vaultClient.listAssets()
      .then(setAssets);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assets</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {assets.map((asset: any) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/assets/AssetCard.tsx
// ==================================
/**
 * Individual asset card
 */
import React from 'react';
import { Link } from 'react-router-dom';

interface AssetCardProps {
  asset: any;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  return (
    <Link 
      to={`/assets/${asset.id}`}
      className="block bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-cyan-400"
    >
      <h3 className="text-lg font-bold mb-2">{asset.name || asset.id}</h3>
      <div className="text-sm text-slate-400 space-y-1">
        <p>Status: {asset.status}</p>
        <p>Runtime: {asset.runtime}</p>
        <p>Providers: {asset.providers?.join(', ')}</p>
      </div>
    </Link>
  );
};

// ==================================
// codex-assets-manager/src/assets/AssetDetail.tsx
// ==================================
/**
 * Asset detail view with tabs
 */
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { OverviewTab } from '../asset-tabs/OverviewTab';
import { PermissionsTab } from '../asset-tabs/PermissionsTab';
import { RuntimeTab } from '../asset-tabs/RuntimeTab';
import { LogsTab } from '../asset-tabs/LogsTab';
import { HealthTab } from '../asset-tabs/HealthTab';

const TABS = ['Overview', 'Permissions', 'Runtime', 'Logs', 'Health'];

export const AssetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Asset: {id}</h2>
      
      <div className="flex gap-2 border-b border-slate-800">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab 
                ? 'border-b-2 border-cyan-400 text-cyan-400' 
                : 'text-slate-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-lg p-6">
        {activeTab === 'Overview' && <OverviewTab assetId={id!} />}
        {activeTab === 'Permissions' && <PermissionsTab assetId={id!} />}
        {activeTab === 'Runtime' && <RuntimeTab assetId={id!} />}
        {activeTab === 'Logs' && <LogsTab assetId={id!} />}
        {activeTab === 'Health' && <HealthTab assetId={id!} />}
      </div>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/asset-tabs/OverviewTab.tsx
// ==================================
export const OverviewTab: React.FC<{ assetId: string }> = ({ assetId }) => {
  return <div>Overview for {assetId}</div>;
};

// ==================================
// codex-assets-manager/src/asset-tabs/PermissionsTab.tsx
// ==================================
export const PermissionsTab: React.FC<{ assetId: string }> = ({ assetId }) => {
  return <div>Permissions for {assetId}</div>;
};

// ==================================
// codex-assets-manager/src/asset-tabs/RuntimeTab.tsx
// ==================================
export const RuntimeTab: React.FC<{ assetId: string }> = ({ assetId }) => {
  return <div>Runtime controls for {assetId}</div>;
};

// ==================================
// codex-assets-manager/src/asset-tabs/LogsTab.tsx
// ==================================
export const LogsTab: React.FC<{ assetId: string }> = ({ assetId }) => {
  return <div>Logs for {assetId}</div>;
};

// ==================================
// codex-assets-manager/src/asset-tabs/HealthTab.tsx
// ==================================
export const HealthTab: React.FC<{ assetId: string }> = ({ assetId }) => {
  return <div>Health for {assetId}</div>;
};

// ==================================
// codex-assets-manager/src/vault/VaultView.tsx
// ==================================
/**
 * Vault provider overview
 * Never shows keys
 */
import React from 'react';
import { ProviderCard } from './ProviderCard';

export const VaultView: React.FC = () => {
  const providers = []; // TODO: Fetch from Vault

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vault Providers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((p: any) => (
          <ProviderCard key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/vault/ProviderCard.tsx
// ==================================
export const ProviderCard: React.FC<{ provider: any }> = ({ provider }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-bold">{provider.name}</h3>
      <p className="text-sm text-slate-400">Status: {provider.status}</p>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/activity/ActivityLog.tsx
// ==================================
/**
 * Immutable audit stream
 */
import React from 'react';
import { ActivityItem } from './ActivityItem';

export const ActivityLog: React.FC = () => {
  const events: any[] = []; // TODO: Fetch from Vault

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Activity Log</h2>
      <div className="space-y-2">
        {events.map(event => (
          <ActivityItem key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/activity/ActivityItem.tsx
// ==================================
export const ActivityItem: React.FC<{ event: any }> = ({ event }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4">
      <p className="text-sm">{event.message}</p>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/system/SystemControls.tsx
// ==================================
/**
 * Emergency system controls
 * Founder-only, dangerous by design
 */
import React from 'react';
import { DangerAction } from './DangerAction';

export const SystemControls: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-500">System Controls</h2>
      <div className="space-y-4">
        <DangerAction 
          label="Lock All Assets"
          action="lock"
        />
        <DangerAction 
          label="Pause Vault Outbound"
          action="pause"
        />
        <DangerAction 
          label="Emergency Shutdown"
          action="shutdown"
        />
      </div>
    </div>
  );
};

// ==================================
// codex-assets-manager/src/system/DangerAction.tsx
// ==================================
export const DangerAction: React.FC<{ label: string; action: string }> = ({ 
  label, 
  action 
}) => {
  return (
    <button className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold">
      {label}
    </button>
  );
};

// ==================================
// codex-assets-manager/src/api/vaultClient.ts
// ==================================
/**
 * Typed Vault API client
 * No secrets, no auth logic
 */

const BASE_URL = import.meta.env.VITE_VAULT_BASE_URL || '';

export const vaultClient = {
  async getSession() {
    const res = await fetch(`${BASE_URL}/vault/session`);
    return res.json();
  },

  async listAssets() {
    const res = await fetch(`${BASE_URL}/vault/assets`);
    return res.json();
  },

  async getAsset(id: string) {
    const res = await fetch(`${BASE_URL}/vault/assets/${id}`);
    return res.json();
  },

  async uploadIngest(files: FormData) {
    const res = await fetch(`${BASE_URL}/vault/ingest/upload`, {
      method: 'POST',
      body: files
    });
    return res.json();
  },

  async scanIngest(ingestId: string) {
    const res = await fetch(`${BASE_URL}/vault/ingest/${ingestId}/scan`);
    return res.json();
  },

  async bindIngest(ingestId: string) {
    const res = await fetch(`${BASE_URL}/vault/ingest/${ingestId}/bind`, {
      method: 'POST'
    });
    return res.json();
  },

  async startAsset(assetId: string) {
    const res = await fetch(`${BASE_URL}/vault/assets/${assetId}/runtime/start`, {
      method: 'POST'
    });
    return res.json();
  },

  async pauseAsset(assetId: string) {
    const res = await fetch(`${BASE_URL}/vault/assets/${assetId}/runtime/pause`, {
      method: 'POST'
    });
    return res.json();
  }
};