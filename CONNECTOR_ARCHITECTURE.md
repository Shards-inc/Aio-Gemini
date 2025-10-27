# Connector Integration System Architecture

## Overview

This document outlines the architecture for adding connector integration with connection status tracking and management features to the Aio-Gemini project.

## System Components

### 1. Connector Configuration System

**Purpose**: Centralized configuration for all available connectors

**Structure**:
```typescript
interface Connector {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  lastChecked?: Date;
  credentials?: {
    apiKey?: string;
    accessToken?: string;
    [key: string]: any;
  };
  config?: {
    endpoint?: string;
    [key: string]: any;
  };
}
```

**Categories**:
- Communication (Gmail, Outlook Mail)
- Calendar (Google Calendar, Outlook Calendar)
- Development (GitHub, Vercel, Neon, Prisma Postgres, Sentry, Serena)
- AI/ML (Cohere, ElevenLabs, OpenRouter, Hugging Face, Invideo)
- Business (Stripe, PayPal, Asana, Linear, Notion, Zapier)
- Data (Polygon.io, JSONBin.io, Supabase, PopHIVE, Explorium)
- Forms (Typeform, Jotform)
- Infrastructure (Cloudflare, Playwright)
- Design (Canva, Webflow)
- Utilities (Firecrawl, Todoist)

### 2. Connector Service Layer

**Purpose**: Handle connector operations and status management

**Key Functions**:
- `checkConnectorStatus(connectorId: string)`: Verify if a connector is properly configured
- `connectConnector(connectorId: string, credentials: any)`: Initialize a connector connection
- `disconnectConnector(connectorId: string)`: Remove connector credentials
- `testConnection(connectorId: string)`: Test if the connector is working
- `getAllConnectors()`: Retrieve all connector configurations
- `getConnectorsByCategory(category: string)`: Filter connectors by category
- `updateConnectorConfig(connectorId: string, config: any)`: Update connector settings

### 3. Storage Layer

**Purpose**: Persist connector configurations and credentials

**Implementation Options**:
- **Local Storage**: For development and demo purposes (current implementation)
- **JSONBin.io**: For cloud-based storage with the available API key
- **Environment Variables**: For production deployments

**Security Considerations**:
- Encrypt sensitive credentials before storage
- Never expose API keys in client-side code
- Use secure environment variable management for production

### 4. UI Components

**Purpose**: Provide user interface for connector management

**Components**:

#### ConnectorDashboard
- Grid view of all connectors
- Category filtering
- Search functionality
- Status indicators (color-coded)
- Quick actions (connect/disconnect/test)

#### ConnectorCard
- Connector icon and name
- Connection status badge
- Last checked timestamp
- Quick action buttons
- Category tag

#### ConnectorModal
- Detailed connector information
- Configuration form
- Credential input fields
- Connection test button
- Save/Cancel actions
- Documentation link

#### ConnectorStatusIndicator
- Visual status representation
- Tooltip with details
- Auto-refresh capability

### 5. Integration with Existing Features

**Approach**:
- Add new "Connectors" feature to the existing FEATURES array
- Maintain consistency with existing UI/UX patterns
- Use the same styling system (Tailwind CSS)
- Follow the modal pattern for detailed views

## Data Flow

```
User Action → UI Component → Connector Service → Storage Layer
                                    ↓
                            Status Check/API Call
                                    ↓
                            Update UI with Result
```

## Status Management

### Status Types
1. **Connected**: Credentials verified, connector operational
2. **Disconnected**: No credentials configured
3. **Error**: Credentials invalid or API unreachable
4. **Pending**: Connection test in progress

### Status Check Strategy
- **On-demand**: User clicks "Test Connection"
- **Periodic**: Background checks every 5 minutes for connected connectors
- **On-load**: Check status when connector dashboard opens

## Security Best Practices

1. **Credential Encryption**: Use Web Crypto API for client-side encryption
2. **Secure Storage**: Store encrypted credentials in localStorage or JSONBin.io
3. **API Key Protection**: Never commit API keys to version control
4. **HTTPS Only**: Ensure all API calls use HTTPS
5. **Token Refresh**: Implement token refresh logic for OAuth-based connectors

## UI/UX Design Principles

Following the existing design system:
- **Premium Feel**: Glassmorphism effects, smooth transitions
- **Color Scheme**: Slate/Cyan theme matching existing features
- **Responsive**: Mobile-first design approach
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Feedback**: Loading states, success/error messages, tooltips

## Implementation Phases

### Phase 1: Core Infrastructure
- Create connector configuration file
- Implement connector service layer
- Set up storage utilities

### Phase 2: UI Components
- Build ConnectorDashboard component
- Create ConnectorCard component
- Implement ConnectorModal component
- Add status indicators

### Phase 3: Integration
- Add Connectors feature to main app
- Integrate with existing feature system
- Test all connectors

### Phase 4: Enhancement
- Add search and filtering
- Implement auto-refresh
- Add bulk operations
- Create documentation

## Technical Stack

- **Frontend**: React 19.2.0, TypeScript 5.8.2
- **Styling**: Tailwind CSS (via existing setup)
- **Build Tool**: Vite 6.2.0
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Storage**: LocalStorage + JSONBin.io API
- **Icons**: Custom SVG icons (matching existing pattern)

## API Integration Examples

### JSONBin.io for Cloud Storage
```typescript
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_BASE_URL = 'https://api.jsonbin.io/v3';

async function saveConnectors(connectors: Connector[]) {
  const response = await fetch(`${JSONBIN_BASE_URL}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify({ connectors })
  });
  return response.json();
}
```

### Connector Status Check
```typescript
async function checkConnectorStatus(connector: Connector): Promise<boolean> {
  try {
    // Example: Check if API key is valid
    const response = await fetch(connector.config.endpoint, {
      headers: {
        'Authorization': `Bearer ${connector.credentials.apiKey}`
      }
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
```

## Future Enhancements

1. **OAuth Integration**: Support OAuth 2.0 flow for connectors
2. **Webhook Support**: Receive real-time updates from connectors
3. **Usage Analytics**: Track connector usage and performance
4. **Connector Marketplace**: Allow users to add custom connectors
5. **Batch Operations**: Connect/disconnect multiple connectors at once
6. **Health Dashboard**: Visual analytics for connector health
7. **Notification System**: Alert users when connectors fail
8. **Connector Templates**: Pre-configured setups for common use cases

## Conclusion

This architecture provides a scalable, secure, and user-friendly system for managing connector integrations in the Aio-Gemini project. The design follows existing patterns while introducing new capabilities for connection management and status tracking.

