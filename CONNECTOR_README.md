# Connector Management System

A comprehensive connector integration system for the Aio-Gemini project, enabling seamless management of 35+ external service integrations with real-time status tracking and credential management.

## 🚀 Features

### Core Capabilities

- **35+ Pre-configured Connectors**: Support for popular services across 10 categories
- **Real-time Status Tracking**: Monitor connection health with automatic status updates
- **Credential Management**: Secure storage and encryption of API keys and tokens
- **Connection Testing**: Verify connector configurations with one-click testing
- **Advanced Filtering**: Search and filter by category, status, or keywords
- **Responsive Dashboard**: Premium UI with glassmorphism effects and smooth animations
- **Batch Operations**: Test multiple connectors simultaneously
- **OAuth Support**: Built-in support for OAuth 2.0 authentication flows

### Connector Categories

1. **Communication** (2 connectors)
   - Gmail
   - Outlook Mail

2. **Calendar** (2 connectors)
   - Google Calendar
   - Outlook Calendar

3. **Development** (6 connectors)
   - GitHub
   - Vercel
   - Neon
   - Prisma Postgres
   - Sentry
   - Serena

4. **AI & ML** (5 connectors)
   - Cohere
   - ElevenLabs
   - OpenRouter
   - Hugging Face
   - Invideo

5. **Business** (6 connectors)
   - Stripe
   - PayPal for Business
   - Asana
   - Linear
   - Notion
   - Zapier

6. **Data** (5 connectors)
   - Polygon.io
   - JSONBin.io
   - Supabase
   - PopHIVE
   - Explorium

7. **Forms** (2 connectors)
   - Typeform
   - Jotform

8. **Infrastructure** (2 connectors)
   - Cloudflare
   - Playwright

9. **Design** (2 connectors)
   - Canva
   - Webflow

10. **Utilities** (2 connectors)
    - Firecrawl
    - Todoist

## 📦 Installation

The connector system is already integrated into the Aio-Gemini project. No additional installation is required.

### File Structure

```
Aio-Gemini-/
├── components/
│   ├── ConnectorCard.tsx          # Individual connector card component
│   ├── ConnectorDashboard.tsx     # Main dashboard component
│   ├── ConnectorModal.tsx         # Configuration modal
│   ├── ConnectorStatusBadge.tsx   # Status indicator component
│   └── connectorIcons.tsx         # Icon components
├── config/
│   └── connectors.ts              # Connector configuration data
├── services/
│   └── connectorService.ts        # Business logic and API layer
├── types/
│   └── connectorTypes.ts          # TypeScript type definitions
├── utils/
│   └── connectorStorage.ts        # Storage and encryption utilities
└── CONNECTOR_ARCHITECTURE.md      # Architecture documentation
```

## 🎯 Usage

### Accessing the Connector Dashboard

1. Launch the application: `npm run dev`
2. Click on the **"Connector Management"** card from the main dashboard
3. The connector dashboard will open in a modal view

### Connecting a Service

1. **Find Your Connector**
   - Use the search bar to find a specific connector
   - Filter by category or status
   - Browse the grid view

2. **Configure Credentials**
   - Click the **"Configure"** button on any connector card
   - Enter your API credentials (API key, access token, etc.)
   - Optionally configure the API endpoint and environment
   - Click **"Save & Test Connection"**

3. **Verify Connection**
   - The system automatically tests the connection after saving
   - Status badge updates to show connection state
   - Success message confirms the configuration

### Managing Connectors

#### Testing Connections

- **Single Test**: Click the "Test" button on any connected connector
- **Batch Test**: Click "Refresh All" to test all connected connectors

#### Disconnecting Services

1. Open the connector configuration modal
2. Click the **"Disconnect"** button
3. Confirm the action
4. Credentials are securely removed

#### Filtering and Search

- **Search**: Type keywords in the search bar (searches name, description, category)
- **Category Filter**: Select a category from the dropdown
- **Status Filter**: Filter by Connected, Disconnected, or Error status

### Status Indicators

| Status | Color | Description |
|--------|-------|-------------|
| **Connected** | Green | Credentials verified, connector operational |
| **Disconnected** | Gray | No credentials configured |
| **Error** | Red | Invalid credentials or API unreachable |
| **Pending** | Amber | Connection test in progress |

## 🔧 Configuration

### Environment Variables

For production deployments, store API keys as environment variables:

```bash
# Example .env file
GMAIL_API_KEY=your_gmail_api_key
GITHUB_TOKEN=your_github_token
STRIPE_SECRET_KEY=your_stripe_key
# ... add more as needed
```

### Storage Options

The system supports multiple storage backends:

1. **LocalStorage** (Default)
   - Best for: Development and demo
   - Encryption: Simple Base64 encoding
   - Persistence: Browser-based

2. **JSONBin.io** (Recommended for Production)
   - Best for: Cloud-based storage
   - Encryption: Client-side encryption before upload
   - Persistence: Cloud-based with versioning

3. **Environment Variables**
   - Best for: Server-side deployments
   - Encryption: Not needed (server-side)
   - Persistence: Configuration files

### Security Best Practices

⚠️ **Important Security Notes:**

1. **Never commit API keys** to version control
2. **Use environment variables** for production deployments
3. **Enable HTTPS** for all API communications
4. **Rotate credentials** regularly
5. **Implement proper access controls** in production
6. **Use OAuth 2.0** for services that support it

## 🎨 UI/UX Design

### Design Philosophy

The connector management interface follows a **premium luxury design** approach:

- **Glassmorphism Effects**: Frosted glass appearance with backdrop blur
- **Smooth Animations**: Transitions and hover effects for enhanced interactivity
- **Color Scheme**: Slate/Cyan theme with gradient accents
- **Responsive Layout**: Mobile-first design with adaptive grid
- **Status Visualization**: Color-coded badges with animated indicators

### Component Hierarchy

```
ConnectorDashboard
├── Statistics Cards (4)
│   ├── Total Connectors
│   ├── Connected Count
│   ├── Disconnected Count
│   └── Error Count
├── Filters & Search
│   ├── Search Input
│   ├── Category Dropdown
│   ├── Status Dropdown
│   └── Refresh All Button
└── Connector Grid
    └── ConnectorCard (multiple)
        ├── Icon & Name
        ├── Status Badge
        ├── Description
        ├── Features Tags
        ├── Metadata
        └── Action Buttons
```

## 🔌 API Integration

### Adding a New Connector

1. **Define the Connector**

```typescript
// In config/connectors.ts
{
  id: 'my_service',
  name: 'My Service',
  category: 'business',
  description: 'Description of the service',
  icon: Icons.SparkIcon,
  docsLink: 'https://docs.myservice.com',
  requiresOAuth: false,
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

2. **Implement Connection Logic**

```typescript
// In services/connectorService.ts
// The testConnection function handles verification
// Customize for your specific API requirements
```

3. **Add Custom Credential Fields** (Optional)

```typescript
// In components/ConnectorModal.tsx
// Add custom input fields for service-specific credentials
```

### Example: Testing a Connector

```typescript
import * as connectorService from './services/connectorService';

// Test a single connector
const result = await connectorService.testConnection('github');
console.log(result); // { success: true, message: 'Connection successful' }

// Get connector statistics
const stats = connectorService.getConnectorStats();
console.log(stats.connectedCount); // Number of connected connectors
```

## 📊 Statistics Dashboard

The dashboard provides real-time metrics:

- **Total Connectors**: Total number of available connectors
- **Connected**: Number of successfully connected services
- **Disconnected**: Number of unconfigured connectors
- **Errors**: Number of connectors with connection issues

## 🚀 Deployment

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Deploy to Vercel

```bash
vercel --prod
```

### Deploy to Netlify

```bash
netlify deploy --prod
```

## 🔍 Troubleshooting

### Common Issues

**Issue**: Connector shows "Error" status after configuration

**Solution**:
- Verify API credentials are correct
- Check if the API endpoint is accessible
- Ensure the API key has proper permissions
- Review browser console for detailed error messages

---

**Issue**: Credentials not persisting after page refresh

**Solution**:
- Check browser localStorage is enabled
- Verify localStorage quota is not exceeded
- Clear browser cache and try again

---

**Issue**: OAuth connectors not working

**Solution**:
- Ensure redirect URLs are configured in the service provider
- Check OAuth client ID and secret are correct
- Verify OAuth scopes are properly set

## 📚 Additional Resources

- [Architecture Documentation](./CONNECTOR_ARCHITECTURE.md)
- [Main Project README](./README.md)
- [TypeScript Types](./types/connectorTypes.ts)
- [Service Layer API](./services/connectorService.ts)

## 🤝 Contributing

To add support for a new connector:

1. Add the connector definition to `config/connectors.ts`
2. Create an icon component if needed
3. Implement connection testing logic in `connectorService.ts`
4. Add custom credential fields in `ConnectorModal.tsx` if required
5. Update this README with the new connector information
6. Test thoroughly before submitting a pull request

## 📝 License

This connector management system is part of the Aio-Gemini project and follows the same license.

## 🎉 Acknowledgments

Built with:
- React 19.2.0
- TypeScript 5.8.2
- Tailwind CSS
- Vite 6.2.0

---

**Need Help?** Check the [Architecture Documentation](./CONNECTOR_ARCHITECTURE.md) for detailed technical information.

