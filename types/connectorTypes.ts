import type React from 'react';

export type ConnectorStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export type ConnectorCategory = 
  | 'communication'
  | 'calendar'
  | 'development'
  | 'ai_ml'
  | 'business'
  | 'data'
  | 'forms'
  | 'infrastructure'
  | 'design'
  | 'utilities';

export interface ConnectorCredentials {
  apiKey?: string;
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  [key: string]: any;
}

export interface ConnectorConfig {
  endpoint?: string;
  webhookUrl?: string;
  environment?: 'production' | 'sandbox' | 'development';
  [key: string]: any;
}

export interface Connector {
  id: string;
  name: string;
  category: ConnectorCategory;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  status: ConnectorStatus;
  lastChecked?: Date;
  lastConnected?: Date;
  credentials?: ConnectorCredentials;
  config?: ConnectorConfig;
  docsLink?: string;
  requiresOAuth?: boolean;
  features?: string[];
}

export interface ConnectorStats {
  totalConnectors: number;
  connectedCount: number;
  disconnectedCount: number;
  errorCount: number;
  byCategory: Record<ConnectorCategory, number>;
}

