import type { Connector } from '../types/connectorTypes';
import * as Icons from '../components/icons';

export const CONNECTOR_CATEGORIES = {
  communication: 'Communication',
  calendar: 'Calendar',
  development: 'Development',
  ai_ml: 'AI & ML',
  business: 'Business',
  data: 'Data',
  forms: 'Forms',
  infrastructure: 'Infrastructure',
  design: 'Design',
  utilities: 'Utilities'
} as const;

export const INITIAL_CONNECTORS: Omit<Connector, 'status' | 'lastChecked' | 'credentials' | 'config'>[] = [
  // Communication
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'communication',
    description: 'Send and receive emails, manage labels, and access Gmail data.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.google.com/gmail/api',
    requiresOAuth: true,
    features: ['Send emails', 'Read messages', 'Manage labels']
  },
  {
    id: 'outlook_mail',
    name: 'Outlook Mail',
    category: 'communication',
    description: 'Access Outlook email, folders, and messaging features.',
    icon: Icons.SparkIcon,
    docsLink: 'https://docs.microsoft.com/en-us/graph/api/resources/mail-api-overview',
    requiresOAuth: true,
    features: ['Email management', 'Folder organization', 'Calendar integration']
  },
  
  // Calendar
  {
    id: 'google_calendar',
    name: 'Google Calendar',
    category: 'calendar',
    description: 'Create events, manage calendars, and sync schedules.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.google.com/calendar',
    requiresOAuth: true,
    features: ['Event management', 'Calendar sync', 'Reminders']
  },
  {
    id: 'outlook_calendar',
    name: 'Outlook Calendar',
    category: 'calendar',
    description: 'Manage Outlook calendar events and appointments.',
    icon: Icons.SparkIcon,
    docsLink: 'https://docs.microsoft.com/en-us/graph/api/resources/calendar',
    requiresOAuth: true,
    features: ['Event scheduling', 'Meeting management', 'Availability tracking']
  },
  
  // Development
  {
    id: 'github',
    name: 'GitHub',
    category: 'development',
    description: 'Access repositories, issues, pull requests, and GitHub Actions.',
    icon: Icons.SparkIcon,
    docsLink: 'https://docs.github.com/en/rest',
    requiresOAuth: true,
    features: ['Repository management', 'Issue tracking', 'CI/CD integration']
  },
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'development',
    description: 'Deploy and manage projects on Vercel platform.',
    icon: Icons.SparkIcon,
    docsLink: 'https://vercel.com/docs/rest-api',
    features: ['Deployment automation', 'Project management', 'Domain configuration']
  },
  {
    id: 'neon',
    name: 'Neon',
    category: 'development',
    description: 'Serverless Postgres database management.',
    icon: Icons.SparkIcon,
    docsLink: 'https://neon.tech/docs/introduction',
    features: ['Database management', 'Branching', 'Scaling']
  },
  {
    id: 'prisma_postgres',
    name: 'Prisma Postgres',
    category: 'development',
    description: 'Manage Prisma Postgres databases with ORM capabilities.',
    icon: Icons.SparkIcon,
    docsLink: 'https://www.prisma.io/docs',
    features: ['Schema management', 'Query building', 'Migrations']
  },
  {
    id: 'sentry',
    name: 'Sentry',
    category: 'development',
    description: 'Error tracking and performance monitoring.',
    icon: Icons.SparkIcon,
    docsLink: 'https://docs.sentry.io/api/',
    features: ['Error tracking', 'Performance monitoring', 'Release tracking']
  },
  {
    id: 'serena',
    name: 'Serena',
    category: 'development',
    description: 'Semantic code retrieval and editing.',
    icon: Icons.SparkIcon,
    docsLink: 'https://serena.dev/docs',
    features: ['Code search', 'Semantic analysis', 'Code editing']
  },
  
  // AI & ML
  {
    id: 'cohere',
    name: 'Cohere',
    category: 'ai_ml',
    description: 'Natural language processing and generation with Cohere AI.',
    icon: Icons.SparkIcon,
    docsLink: 'https://docs.cohere.com/',
    features: ['Text generation', 'Embeddings', 'Classification']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    category: 'ai_ml',
    description: 'High-quality AI voice generation and text-to-speech.',
    icon: Icons.ConversationalVoiceIcon,
    docsLink: 'https://elevenlabs.io/docs',
    features: ['Text-to-speech', 'Voice cloning', 'Audio generation']
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    category: 'ai_ml',
    description: 'Unified access to multiple AI models with automatic routing.',
    icon: Icons.SparkIcon,
    docsLink: 'https://openrouter.ai/docs',
    features: ['Multi-model access', 'Automatic routing', 'Cost optimization']
  },
  {
    id: 'hugging_face',
    name: 'Hugging Face',
    category: 'ai_ml',
    description: 'Access to thousands of AI models and datasets.',
    icon: Icons.SparkIcon,
    docsLink: 'https://huggingface.co/docs',
    features: ['Model inference', 'Dataset access', 'Model training']
  },
  {
    id: 'invideo',
    name: 'Invideo',
    category: 'ai_ml',
    description: 'AI-powered video generation and editing.',
    icon: Icons.MovieIcon,
    docsLink: 'https://invideo.io/docs',
    features: ['Video generation', 'Template-based creation', 'AI editing']
  },
  
  // Business
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'business',
    description: 'Payment processing, subscriptions, and financial operations.',
    icon: Icons.SparkIcon,
    docsLink: 'https://stripe.com/docs/api',
    features: ['Payment processing', 'Subscription management', 'Invoice generation']
  },
  {
    id: 'paypal',
    name: 'PayPal for Business',
    category: 'business',
    description: 'PayPal payments, invoicing, and business transactions.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developer.paypal.com/docs/api/',
    features: ['Payment processing', 'Invoicing', 'Refunds']
  },
  {
    id: 'asana',
    name: 'Asana',
    category: 'business',
    description: 'Project management, task tracking, and team collaboration.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.asana.com/docs',
    requiresOAuth: true,
    features: ['Task management', 'Project tracking', 'Team collaboration']
  },
  {
    id: 'linear',
    name: 'Linear',
    category: 'business',
    description: 'Issue tracking and project management for software teams.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.linear.app/docs',
    requiresOAuth: true,
    features: ['Issue tracking', 'Sprint planning', 'Roadmap management']
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'business',
    description: 'Document management, databases, and knowledge base.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.notion.com/',
    requiresOAuth: true,
    features: ['Page management', 'Database operations', 'Block editing']
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'business',
    description: 'Workflow automation and app integration.',
    icon: Icons.SparkIcon,
    docsLink: 'https://zapier.com/developer',
    requiresOAuth: true,
    features: ['Workflow automation', 'App integration', 'Data synchronization']
  },
  
  // Data
  {
    id: 'polygon',
    name: 'Polygon.io',
    category: 'data',
    description: 'Real-time and historical financial market data.',
    icon: Icons.SparkIcon,
    docsLink: 'https://polygon.io/docs',
    features: ['Stock data', 'Market analytics', 'Real-time quotes']
  },
  {
    id: 'jsonbin',
    name: 'JSONBin.io',
    category: 'data',
    description: 'Simple JSON storage and retrieval service.',
    icon: Icons.SparkIcon,
    docsLink: 'https://jsonbin.io/api-reference',
    features: ['JSON storage', 'Version control', 'Collections']
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'data',
    description: 'Open-source Firebase alternative with Postgres database.',
    icon: Icons.SparkIcon,
    docsLink: 'https://supabase.com/docs',
    features: ['Database management', 'Authentication', 'Real-time subscriptions']
  },
  {
    id: 'pophive',
    name: 'PopHIVE',
    category: 'data',
    description: 'Public health datasets from Yale University.',
    icon: Icons.SparkIcon,
    docsLink: 'https://pophive.yale.edu/docs',
    features: ['Health data', 'Research datasets', 'Analytics']
  },
  {
    id: 'explorium',
    name: 'Explorium',
    category: 'data',
    description: 'Business intelligence and prospect data enrichment.',
    icon: Icons.SparkIcon,
    docsLink: 'https://explorium.ai/docs',
    features: ['Data enrichment', 'Business intelligence', 'Prospect research']
  },
  
  // Forms
  {
    id: 'typeform',
    name: 'Typeform',
    category: 'forms',
    description: 'Create and manage interactive forms and surveys.',
    icon: Icons.SparkIcon,
    docsLink: 'https://www.typeform.com/developers',
    features: ['Form creation', 'Response collection', 'Webhook integration']
  },
  {
    id: 'jotform',
    name: 'Jotform',
    category: 'forms',
    description: 'Form builder with advanced features and integrations.',
    icon: Icons.SparkIcon,
    docsLink: 'https://api.jotform.com/docs',
    features: ['Form management', 'Submission tracking', 'Email notifications']
  },
  
  // Infrastructure
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    category: 'infrastructure',
    description: 'CDN, DNS, and edge computing services.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.cloudflare.com/api/',
    features: ['DNS management', 'Workers', 'R2 storage']
  },
  {
    id: 'playwright',
    name: 'Playwright',
    category: 'infrastructure',
    description: 'Browser automation and testing framework.',
    icon: Icons.SparkIcon,
    docsLink: 'https://playwright.dev/docs/api/class-playwright',
    features: ['Browser automation', 'Testing', 'Web scraping']
  },
  
  // Design
  {
    id: 'canva',
    name: 'Canva',
    category: 'design',
    description: 'Design creation and editing with Canva API.',
    icon: Icons.ImageEditIcon,
    docsLink: 'https://www.canva.dev/docs',
    requiresOAuth: true,
    features: ['Design creation', 'Template access', 'Export designs']
  },
  {
    id: 'webflow',
    name: 'Webflow',
    category: 'design',
    description: 'Website design, CMS, and hosting platform.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developers.webflow.com/',
    requiresOAuth: true,
    features: ['Site management', 'CMS operations', 'Publishing']
  },
  
  // Utilities
  {
    id: 'firecrawl',
    name: 'Firecrawl',
    category: 'utilities',
    description: 'Web scraping and crawling service.',
    icon: Icons.SparkIcon,
    docsLink: 'https://firecrawl.dev/docs',
    features: ['Web scraping', 'Data extraction', 'Site crawling']
  },
  {
    id: 'todoist',
    name: 'Todoist',
    category: 'utilities',
    description: 'Task management and to-do list organization.',
    icon: Icons.SparkIcon,
    docsLink: 'https://developer.todoist.com/rest/v2/',
    requiresOAuth: true,
    features: ['Task management', 'Project organization', 'Reminders']
  }
];

