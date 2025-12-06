# Deploying to Vercel

This project contains two separate applications that need to be deployed as separate Vercel projects.

## Option 1: Deploy Both Apps Separately (Recommended)

### Deploy Manager Portal

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy Manager App**:
   ```bash
   cd manager-app
   vercel
   ```
   - Follow the prompts
   - When asked for settings:
     - Framework Preset: Vite
     - Build Command: `cd .. && npm run build:manager`
     - Output Directory: `dist/manager`
     - Install Command: `npm install`

3. **Or use Vercel Dashboard**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your repository
   - Set Root Directory to: `manager-app`
   - Build Command: `cd .. && npm run build:manager`
   - Output Directory: `dist/manager`
   - Install Command: `npm install`

### Deploy Operator Portal

1. **Deploy Operator App**:
   ```bash
   cd operator-app
   vercel
   ```
   - Follow the prompts
   - When asked for settings:
     - Framework Preset: Vite
     - Build Command: `cd .. && npm run build:operator`
     - Output Directory: `dist/operator`
     - Install Command: `npm install`

2. **Or use Vercel Dashboard**:
   - Click "New Project" again
   - Import the same repository
   - Set Root Directory to: `operator-app`
   - Build Command: `cd .. && npm run build:operator`
   - Output Directory: `dist/operator`
   - Install Command: `npm install`

## Option 2: Deploy as Monorepo with Subdirectories

If you want both apps under one domain with different paths:

1. Create a single Vercel project
2. Use the root `vercel.json` configuration
3. Set up rewrites to route `/manager/*` and `/operator/*` to respective apps

## Environment Variables

If you need environment variables later (for API keys, etc.), add them in:
- Vercel Dashboard → Project Settings → Environment Variables

## Quick Deploy Commands

```bash
# Deploy Manager Portal
vercel --cwd manager-app --prod

# Deploy Operator Portal  
vercel --cwd operator-app --prod
```

## Troubleshooting

- **Build fails**: Make sure all dependencies are in `package.json` at the root
- **Path issues**: Verify the `root` setting in vite config files
- **404 errors**: Check that `rewrites` in vercel.json are correct

