import React, { useState, useEffect, useMemo } from 'react';
import type { Connector, ConnectorCategory, ConnectorCredentials, ConnectorConfig } from '../types/connectorTypes';
import * as connectorService from '../services/connectorService';
import { ConnectorCard } from './ConnectorCard';
import { ConnectorModal } from './ConnectorModal';
import { SearchIcon, FilterIcon, RefreshIcon, ChartIcon } from './connectorIcons';
import { CONNECTOR_CATEGORIES } from '../config/connectors';

export const ConnectorDashboard: React.FC = () => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ConnectorCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'connected' | 'disconnected' | 'error'>('all');
  const [testingId, setTestingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load connectors on mount
  useEffect(() => {
    loadConnectors();
  }, []);

  const loadConnectors = () => {
    const loaded = connectorService.getAllConnectors();
    setConnectors(loaded);
  };

  // Filter connectors
  const filteredConnectors = useMemo(() => {
    return connectors.filter(connector => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          connector.name.toLowerCase().includes(query) ||
          connector.description.toLowerCase().includes(query) ||
          connector.category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && connector.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && connector.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [connectors, searchQuery, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    return connectorService.getConnectorStats();
  }, [connectors]);

  const handleConfigure = (connector: Connector) => {
    setSelectedConnector(connector);
  };

  const handleTest = async (connector: Connector) => {
    setTestingId(connector.id);
    try {
      await connectorService.refreshConnectorStatus(connector.id);
      loadConnectors();
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setTestingId(null);
    }
  };

  const handleSave = async (
    connectorId: string,
    credentials: ConnectorCredentials,
    config?: ConnectorConfig
  ) => {
    const result = await connectorService.connectConnector(connectorId, credentials, config);
    if (!result.success) {
      throw new Error(result.message);
    }
    loadConnectors();
  };

  const handleDisconnect = (connectorId: string) => {
    connectorService.disconnectConnector(connectorId);
    loadConnectors();
  };

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await connectorService.testAllConnections();
      loadConnectors();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="mb-2 text-3xl font-bold text-slate-100">Connector Management</h3>
        <p className="text-slate-400">
          Connect and manage integrations with external services and APIs. Configure credentials, test connections, and monitor status.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Connectors</p>
              <p className="mt-2 text-3xl font-bold text-slate-100">{stats.totalConnectors}</p>
            </div>
            <div className="rounded-lg bg-cyan-500/10 p-3">
              <ChartIcon className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 p-6 ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-400">Connected</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">{stats.connectedCount}</p>
            </div>
            <div className="rounded-lg bg-emerald-500/20 p-3">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Disconnected</p>
              <p className="mt-2 text-3xl font-bold text-slate-300">{stats.disconnectedCount}</p>
            </div>
            <div className="rounded-lg bg-slate-500/20 p-3">
              <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/10 p-6 ring-1 ring-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-400">Errors</p>
              <p className="mt-2 text-3xl font-bold text-red-300">{stats.errorCount}</p>
            </div>
            <div className="rounded-lg bg-red-500/20 p-3">
              <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search connectors..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 text-slate-300 placeholder-slate-500 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FilterIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="appearance-none rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-10 text-slate-300 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="all">All Categories</option>
              {Object.entries(CONNECTOR_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 px-4 text-slate-300 ring-1 ring-white/5 transition-all focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          >
            <option value="all">All Status</option>
            <option value="connected">Connected</option>
            <option value="disconnected">Disconnected</option>
            <option value="error">Error</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshAll}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:bg-cyan-500 hover:shadow-cyan-500/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh All'}
        </button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-slate-400">
        Showing <span className="font-semibold text-slate-300">{filteredConnectors.length}</span> of{' '}
        <span className="font-semibold text-slate-300">{connectors.length}</span> connectors
      </div>

      {/* Connector Grid */}
      {filteredConnectors.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredConnectors.map((connector) => (
            <ConnectorCard
              key={connector.id}
              connector={connector}
              onConfigure={handleConfigure}
              onTest={handleTest}
              isTestingId={testingId}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl bg-slate-800/50 p-12 text-center ring-1 ring-white/10">
          <SearchIcon className="mx-auto h-12 w-12 text-slate-600" />
          <h3 className="mt-4 text-lg font-semibold text-slate-300">No connectors found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Modal */}
      {selectedConnector && (
        <ConnectorModal
          connector={selectedConnector}
          onClose={() => setSelectedConnector(null)}
          onSave={handleSave}
          onDisconnect={handleDisconnect}
        />
      )}
    </div>
  );
};

