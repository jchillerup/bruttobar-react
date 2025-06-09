# Environment Configuration

This React project uses environment variables to manage API endpoints for different deployment environments.

## How it works

The project uses Vite's built-in environment variable system to handle different API configurations:

- **Development**: Uses Vite's proxy configuration to bypass CORS issues
- **Production**: Directly calls the API endpoint specified in environment variables

## Configuration Files

### `.env.development`
Used during local development (`npm run dev`). The proxy in `vite.config.ts` handles API routing, so no API URL is needed here.

### `.env.production`
Used when building for production (`npm run build`). Contains:
```
VITE_API_BASE_URL=https://dev-bruttobar.apprunner.dk
```

## API Configuration

The `src/config/api.ts` file provides a centralized way to construct API URLs:

```typescript
import { getApiUrl } from './config/api';

// In development: returns '/api/auth/token' (uses proxy)
// In production: returns 'https://dev-bruttobar.apprunner.dk/auth/token'
const url = getApiUrl('/auth/token');
```

## Deployment

### Static Deployment

When deploying statically (e.g., to Netlify, Vercel, GitHub Pages):

1. The build process will use `.env.production` automatically
2. API calls will go directly to the configured API URL
3. Ensure your API has proper CORS headers configured

### Custom API Endpoints

To use a different API endpoint:

1. Create a `.env.production.local` file (git-ignored)
2. Set your custom API URL:
   ```
   VITE_API_BASE_URL=https://your-api-endpoint.com
   ```
3. Build the project: `npm run build`

### Environment-specific builds

You can also create environment-specific files:
- `.env.staging` - for staging environment
- `.env.production` - for production environment

Then build with:
```bash
# For staging
npm run build -- --mode staging

# For production (default)
npm run build
```

## Security Notes

- Never commit `.env` files with sensitive data
- Use `.env.local` or `.env.production.local` for sensitive values
- These files are already in `.gitignore`
