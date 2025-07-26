# Deployment Guide for Gotcha! Calculator

This guide will help you deploy the Gotcha! calculator to GitHub Pages.

## Prerequisites

1. A GitHub account
2. Git installed on your computer
3. Node.js and npm installed

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner and select "New repository"
3. Name your repository `gotcha` (or any name you prefer)
4. Make it public (required for GitHub Pages)
5. Don't initialize with README, .gitignore, or license (we'll push our existing files)
6. Click "Create repository"

## Step 2: Update Configuration

1. Open `package.json` in your project
2. Update the `homepage` field with your GitHub Pages URL:
   ```json
   {
     "homepage": "https://yourusername.github.io/gotcha"
   }
   ```
   Replace `yourusername` with your actual GitHub username.

## Step 3: Initialize Git and Push to GitHub

1. Open a terminal in your project directory
2. Run these commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/gotcha.git
   git push -u origin main
   ```

## Step 4: Deploy to GitHub Pages

1. Install the gh-pages package (if not already installed):
   ```bash
   npm install --save-dev gh-pages
   ```

2. Deploy the application:
   ```bash
   npm run deploy
   ```

3. Go to your GitHub repository settings:
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select "gh-pages" branch and "/ (root)" folder
   - Click "Save"

## Step 5: Verify Deployment

1. Wait a few minutes for GitHub Pages to build and deploy
2. Visit your GitHub Pages URL: `https://yourusername.github.io/gotcha`
3. The application should be live and functional

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check that the `homepage` field in `package.json` is correct
- Ensure the repository is public

### 404 Errors
- Wait a few minutes for GitHub Pages to build
- Check that the gh-pages branch was created successfully
- Verify the Pages source is set to gh-pages branch

### App Not Loading
- Check the browser console for JavaScript errors
- Ensure all static assets are being served correctly
- Verify the build was successful locally first

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Update the `homepage` field in `package.json` to your custom domain
3. Rebuild and redeploy: `npm run deploy`
4. Configure your domain's DNS settings to point to GitHub Pages

## Updating the Application

To update your deployed application:

1. Make your changes to the code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. Deploy the updated version:
   ```bash
   npm run deploy
   ```

## Local Development

For local development:

1. Start the development server:
   ```bash
   npm start
   ```
2. The app will open at `http://localhost:3000`
3. Make changes and see them reflected immediately

## Build for Production

To create a production build locally:

```bash
npm run build
```

This creates a `build` folder with optimized static files that can be served from any web server. 