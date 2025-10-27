import React, { useState, useEffect } from 'react';
import type { Connector, ConnectorCredentials, ConnectorConfig } from '../types/connectorTypes';
import { ConnectorStatusBadge } from './ConnectorStatusBadge';
import { CloseIcon } from './icons';
import { DocumentIcon } from './connectorIcons';

interface ConnectorModalProps {
  connector: Connector;
  onClose: () => void;
  onSave: (connectorId: string, credentials: ConnectorCredentials, config?: ConnectorConfig) => Promise<void>;
  onDisconnect: (connectorId: string) => void;
}

export const ConnectorModal: React.FC<ConnectorModalProps> = ({
  connector,
  onClose,
  onSave,
  onDisconnect
}) => {
  const [credentials, setCredentials] = useState<ConnectorCredentials>({
    apiKey: connector.credentials?.apiKey || '',
    accessToken: connector.credentials?.accessToken || '',
    clientId: connector.credentials?.clientId || '',
    clientSecret: connector.credentials?.clientSecret || ''
  });

  const [config, setConfig] = useState<ConnectorConfig>({
    endpoint: connector.config?.endpoint || '',
    environment: connector.config?.environment || 'production'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const Icon = connector.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await onSave(connector.id, credentials, config);
      setSaveMessage({ type: 'success', text: 'Connector configured successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setSaveMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to save configuration' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = () => {
    if (confirm(`Are you sure you want to disconnect ${connector.name}?`)) {
      onDisconnect(connector.id);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl ring-1 ring-white/10" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700/50 bg-slate-900/95 p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 p-3 shadow-lg ring-1 ring-white/10">
              <Icon className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{connector.name}</h2>
              <p className="text-sm text-slate-400">{connector.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ConnectorStatusBadge status={connector.status} />
            <button 
              onClick={onClose} 
              className="rounded-full p-2 text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white active:scale-95"
            >
              <CloseIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Features Section */}
            {connector.features && connector.features.length > 0 && (
              <div className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-white/5">
                <h3 className="mb-3 text-sm font-semibold text-slate-300">Available Features</h3>
                <div className="flex flex-wrap gap-2">
                  {connector.features.map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-400 ring-1 ring-cyan-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* OAuth Notice */}
            {connector.requiresOAuth && (
              <div className="rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 flex-shrink-0 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-amber-400">OAuth Authentication Required</h4>
                    <p className="mt-1 text-sm text-amber-300/80">
                      This connector requires OAuth authentication. You'll need to authorize access through the provider's authentication flow.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Credentials Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Credentials</h3>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  API Key
                </label>
                <input
                  type="password"
                  value={credentials.apiKey}
                  onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300 placeholder-slate-500 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Enter your API key"
                />
              </div>

              {connector.requiresOAuth && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Access Token
                    </label>
                    <input
                      type="password"
                      value={credentials.accessToken}
                      onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300 placeholder-slate-500 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                      placeholder="Enter access token"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Client ID
                      </label>
                      <input
                        type="text"
                        value={credentials.clientId}
                        onChange={(e) => setCredentials({ ...credentials, clientId: e.target.value })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300 placeholder-slate-500 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="Client ID"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-300">
                        Client Secret
                      </label>
                      <input
                        type="password"
                        value={credentials.clientSecret}
                        onChange={(e) => setCredentials({ ...credentials, clientSecret: e.target.value })}
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300 placeholder-slate-500 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        placeholder="Client Secret"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Configuration Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-200">Configuration</h3>
              
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  API Endpoint (Optional)
                </label>
                <input
                  type="url"
                  value={config.endpoint}
                  onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300 placeholder-slate-500 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="https://api.example.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Environment
                </label>
                <select
                  value={config.environment}
                  onChange={(e) => setConfig({ ...config, environment: e.target.value as any })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-slate-300 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="production">Production</option>
                  <option value="sandbox">Sandbox</option>
                  <option value="development">Development</option>
                </select>
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`rounded-lg p-4 ${
                saveMessage.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20' 
                  : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
              }`}>
                {saveMessage.text}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-cyan-500/30 transition-all duration-200 hover:shadow-cyan-500/50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save & Test Connection'
                )}
              </button>

              {connector.status !== 'disconnected' && (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="rounded-lg bg-red-600/20 px-6 py-3 font-semibold text-red-400 ring-1 ring-red-500/30 transition-all duration-200 hover:bg-red-600/30 hover:ring-red-500/50 active:scale-95"
                >
                  Disconnect
                </button>
              )}

              {connector.docsLink && (
                <a
                  href={connector.docsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-3 font-semibold text-slate-200 ring-1 ring-white/10 transition-all duration-200 hover:bg-slate-600 active:scale-95"
                >
                  <DocumentIcon className="h-5 w-5" />
                  Docs
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

