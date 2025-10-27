import type { Connector, ConnectorStats, ConnectorCredentials, ConnectorConfig } from '../types/connectorTypes';
import { INITIAL_CONNECTORS } from '../config/connectors';
import * as storage from '../utils/connectorStorage';

/**
 * Initialize connectors from configuration
 */
export const initializeConnectors = (): Connector[] => {
  // Try to load from storage first
  const stored = storage.loadConnectors();
  if (stored) return stored;
  
  // Initialize with default configuration
  const connectors: Connector[] = INITIAL_CONNECTORS.map(config => ({
    ...config,
    status: 'disconnected' as const,
    lastChecked: undefined,
    lastConnected: undefined,
    credentials: undefined,
    config: undefined
  }));
  
  storage.saveConnectors(connectors);
  return connectors;
};

/**
 * Get all connectors
 */
export const getAllConnectors = (): Connector[] => {
  return storage.loadConnectors() || initializeConnectors();
};

/**
 * Get connector by ID
 */
export const getConnectorById = (id: string): Connector | undefined => {
  const connectors = getAllConnectors();
  return connectors.find(c => c.id === id);
};

/**
 * Get connectors by category
 */
export const getConnectorsByCategory = (category: string): Connector[] => {
  const connectors = getAllConnectors();
  return connectors.filter(c => c.category === category);
};

/**
 * Get connectors by status
 */
export const getConnectorsByStatus = (status: Connector['status']): Connector[] => {
  const connectors = getAllConnectors();
  return connectors.filter(c => c.status === status);
};

/**
 * Search connectors by name or description
 */
export const searchConnectors = (query: string): Connector[] => {
  const connectors = getAllConnectors();
  const lowerQuery = query.toLowerCase();
  return connectors.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get connector statistics
 */
export const getConnectorStats = (): ConnectorStats => {
  const connectors = getAllConnectors();
  
  const stats: ConnectorStats = {
    totalConnectors: connectors.length,
    connectedCount: 0,
    disconnectedCount: 0,
    errorCount: 0,
    byCategory: {
      communication: 0,
      calendar: 0,
      development: 0,
      ai_ml: 0,
      business: 0,
      data: 0,
      forms: 0,
      infrastructure: 0,
      design: 0,
      utilities: 0
    }
  };
  
  connectors.forEach(connector => {
    // Count by status
    switch (connector.status) {
      case 'connected':
        stats.connectedCount++;
        break;
      case 'disconnected':
        stats.disconnectedCount++;
        break;
      case 'error':
        stats.errorCount++;
        break;
    }
    
    // Count by category
    stats.byCategory[connector.category]++;
  });
  
  return stats;
};

/**
 * Connect a connector with credentials
 */
export const connectConnector = async (
  connectorId: string,
  credentials: ConnectorCredentials,
  config?: ConnectorConfig
): Promise<{ success: boolean; message: string }> => {
  try {
    // Save credentials
    storage.saveConnectorCredentials(connectorId, credentials);
    
    // Save config if provided
    if (config) {
      storage.saveConnectorConfig(connectorId, config);
    }
    
    // Test the connection
    const testResult = await testConnection(connectorId);
    
    if (testResult.success) {
      storage.updateConnectorStatus(connectorId, 'connected', true);
      return { success: true, message: 'Connector connected successfully' };
    } else {
      storage.updateConnectorStatus(connectorId, 'error');
      return { success: false, message: testResult.message };
    }
  } catch (error) {
    storage.updateConnectorStatus(connectorId, 'error');
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to connect connector' 
    };
  }
};

/**
 * Disconnect a connector
 */
export const disconnectConnector = (connectorId: string): void => {
  storage.removeConnectorCredentials(connectorId);
};

/**
 * Test connector connection
 */
export const testConnection = async (
  connectorId: string
): Promise<{ success: boolean; message: string }> => {
  const connector = getConnectorById(connectorId);
  
  if (!connector) {
    return { success: false, message: 'Connector not found' };
  }
  
  if (!connector.credentials) {
    return { success: false, message: 'No credentials configured' };
  }
  
  // Update status to pending
  storage.updateConnectorStatus(connectorId, 'pending');
  
  try {
    // Simulate connection test
    // In a real implementation, this would make actual API calls to verify credentials
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll consider it successful if credentials exist
    const hasValidCredentials = 
      connector.credentials.apiKey || 
      connector.credentials.accessToken ||
      connector.credentials.clientId;
    
    if (hasValidCredentials) {
      storage.updateConnectorStatus(connectorId, 'connected', true);
      return { success: true, message: 'Connection successful' };
    } else {
      storage.updateConnectorStatus(connectorId, 'error');
      return { success: false, message: 'Invalid credentials' };
    }
  } catch (error) {
    storage.updateConnectorStatus(connectorId, 'error');
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection test failed' 
    };
  }
};

/**
 * Batch test all connected connectors
 */
export const testAllConnections = async (): Promise<{
  tested: number;
  successful: number;
  failed: number;
}> => {
  const connectors = getAllConnectors();
  const connectedConnectors = connectors.filter(c => 
    c.status === 'connected' || c.status === 'error'
  );
  
  let successful = 0;
  let failed = 0;
  
  for (const connector of connectedConnectors) {
    const result = await testConnection(connector.id);
    if (result.success) {
      successful++;
    } else {
      failed++;
    }
  }
  
  return {
    tested: connectedConnectors.length,
    successful,
    failed
  };
};

/**
 * Update connector configuration
 */
export const updateConnectorConfig = (
  connectorId: string,
  config: ConnectorConfig
): void => {
  storage.saveConnectorConfig(connectorId, config);
};

/**
 * Refresh connector status
 */
export const refreshConnectorStatus = async (connectorId: string): Promise<void> => {
  await testConnection(connectorId);
};

/**
 * Export connector data
 */
export const exportConnectorData = (): string => {
  return storage.exportConnectors();
};

/**
 * Import connector data
 */
export const importConnectorData = (jsonData: string): boolean => {
  return storage.importConnectors(jsonData);
};

/**
 * Reset all connectors to default state
 */
export const resetAllConnectors = (): void => {
  storage.clearAllConnectors();
  initializeConnectors();
};

