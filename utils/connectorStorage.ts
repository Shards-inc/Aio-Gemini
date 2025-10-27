import type { Connector, ConnectorCredentials, ConnectorConfig } from '../types/connectorTypes';

const STORAGE_KEY = 'aio_gemini_connectors';
const ENCRYPTED_STORAGE_KEY = 'aio_gemini_connectors_encrypted';

/**
 * Simple encryption/decryption for demo purposes
 * In production, use proper encryption libraries and secure key management
 */
const simpleEncrypt = (data: string): string => {
  return btoa(data);
};

const simpleDecrypt = (data: string): string => {
  try {
    return atob(data);
  } catch {
    return '';
  }
};

/**
 * Save connectors to localStorage
 */
export const saveConnectors = (connectors: Connector[]): void => {
  try {
    const data = JSON.stringify(connectors);
    const encrypted = simpleEncrypt(data);
    localStorage.setItem(ENCRYPTED_STORAGE_KEY, encrypted);
    
    // Also save non-sensitive data in plain format for quick access
    const publicData = connectors.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      status: c.status,
      lastChecked: c.lastChecked,
      lastConnected: c.lastConnected
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(publicData));
  } catch (error) {
    console.error('Failed to save connectors:', error);
  }
};

/**
 * Load connectors from localStorage
 */
export const loadConnectors = (): Connector[] | null => {
  try {
    const encrypted = localStorage.getItem(ENCRYPTED_STORAGE_KEY);
    if (!encrypted) return null;
    
    const decrypted = simpleDecrypt(encrypted);
    if (!decrypted) return null;
    
    const connectors = JSON.parse(decrypted);
    
    // Convert date strings back to Date objects
    return connectors.map((c: any) => ({
      ...c,
      lastChecked: c.lastChecked ? new Date(c.lastChecked) : undefined,
      lastConnected: c.lastConnected ? new Date(c.lastConnected) : undefined
    }));
  } catch (error) {
    console.error('Failed to load connectors:', error);
    return null;
  }
};

/**
 * Save connector credentials
 */
export const saveConnectorCredentials = (
  connectorId: string,
  credentials: ConnectorCredentials
): void => {
  const connectors = loadConnectors();
  if (!connectors) return;
  
  const index = connectors.findIndex(c => c.id === connectorId);
  if (index === -1) return;
  
  connectors[index].credentials = credentials;
  connectors[index].status = 'pending';
  connectors[index].lastChecked = new Date();
  
  saveConnectors(connectors);
};

/**
 * Save connector configuration
 */
export const saveConnectorConfig = (
  connectorId: string,
  config: ConnectorConfig
): void => {
  const connectors = loadConnectors();
  if (!connectors) return;
  
  const index = connectors.findIndex(c => c.id === connectorId);
  if (index === -1) return;
  
  connectors[index].config = config;
  saveConnectors(connectors);
};

/**
 * Update connector status
 */
export const updateConnectorStatus = (
  connectorId: string,
  status: Connector['status'],
  updateLastConnected: boolean = false
): void => {
  const connectors = loadConnectors();
  if (!connectors) return;
  
  const index = connectors.findIndex(c => c.id === connectorId);
  if (index === -1) return;
  
  connectors[index].status = status;
  connectors[index].lastChecked = new Date();
  
  if (updateLastConnected && status === 'connected') {
    connectors[index].lastConnected = new Date();
  }
  
  saveConnectors(connectors);
};

/**
 * Remove connector credentials
 */
export const removeConnectorCredentials = (connectorId: string): void => {
  const connectors = loadConnectors();
  if (!connectors) return;
  
  const index = connectors.findIndex(c => c.id === connectorId);
  if (index === -1) return;
  
  delete connectors[index].credentials;
  connectors[index].status = 'disconnected';
  connectors[index].lastChecked = new Date();
  
  saveConnectors(connectors);
};

/**
 * Clear all connector data
 */
export const clearAllConnectors = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ENCRYPTED_STORAGE_KEY);
};

/**
 * Export connectors to JSON (for backup)
 */
export const exportConnectors = (): string => {
  const connectors = loadConnectors();
  return JSON.stringify(connectors, null, 2);
};

/**
 * Import connectors from JSON (for restore)
 */
export const importConnectors = (jsonData: string): boolean => {
  try {
    const connectors = JSON.parse(jsonData);
    saveConnectors(connectors);
    return true;
  } catch (error) {
    console.error('Failed to import connectors:', error);
    return false;
  }
};

