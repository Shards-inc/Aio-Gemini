import React from 'react';
import type { Connector } from '../types/connectorTypes';
import { ConnectorStatusBadge } from './ConnectorStatusBadge';
import { SettingsIcon, RefreshIcon } from './connectorIcons';
import { CONNECTOR_CATEGORIES } from '../config/connectors';

interface ConnectorCardProps {
  connector: Connector;
  onConfigure: (connector: Connector) => void;
  onTest: (connector: Connector) => void;
  isTestingId?: string | null;
}

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
  connector,
  onConfigure,
  onTest,
  isTestingId
}) => {
  const isTesting = isTestingId === connector.id;
  const Icon = connector.icon;
  
  const formatDate = (date?: Date) => {
    if (!date) return 'Never';
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 shadow-lg backdrop-blur-sm ring-1 ring-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 hover:ring-cyan-500/30">
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 p-3 shadow-lg ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-cyan-500/20">
              <Icon className="h-7 w-7 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">{connector.name}</h3>
              <p className="text-xs text-slate-500">
                {CONNECTOR_CATEGORIES[connector.category]}
              </p>
            </div>
          </div>
          <ConnectorStatusBadge status={connector.status} size="sm" />
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-slate-400">
          {connector.description}
        </p>

        {/* Features */}
        {connector.features && connector.features.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {connector.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/5"
              >
                {feature}
              </span>
            ))}
            {connector.features.length > 3 && (
              <span className="rounded-full bg-slate-700/50 px-2.5 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/5">
                +{connector.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Metadata */}
        <div className="mb-4 space-y-1 text-xs text-slate-500">
          {connector.lastChecked && (
            <div className="flex items-center justify-between">
              <span>Last checked:</span>
              <span className="font-medium text-slate-400">{formatDate(connector.lastChecked)}</span>
            </div>
          )}
          {connector.lastConnected && (
            <div className="flex items-center justify-between">
              <span>Last connected:</span>
              <span className="font-medium text-slate-400">{formatDate(connector.lastConnected)}</span>
            </div>
          )}
          {connector.requiresOAuth && (
            <div className="mt-2 flex items-center gap-1.5 text-amber-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Requires OAuth</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onConfigure(connector)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-500 hover:shadow-cyan-500/40 active:scale-95"
          >
            <SettingsIcon className="h-4 w-4" />
            Configure
          </button>
          
          {connector.status !== 'disconnected' && (
            <button
              onClick={() => onTest(connector)}
              disabled={isTesting}
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-lg ring-1 ring-white/10 transition-all duration-200 hover:bg-slate-600 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshIcon className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing...' : 'Test'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

