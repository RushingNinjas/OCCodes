# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `code-dispatch-system` (or your choice)
3. Choose Public or Private
4. **DON'T** check "Initialize with README" (we already have files)
5. Click "Create repository"

## Step 2: Push Your Code

After creating the repo, run these commands (replace YOUR_USERNAME and YOUR_REPO_NAME):

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Alternative: If you already have a repo URL

Just run:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

## After pushing, deploy to Vercel:

1. Go to https://vercel.com
2. Import your GitHub repository
3. Deploy Manager Portal (root: `manager-app`)
4. Deploy Operator Portal (root: `operator-app`)

