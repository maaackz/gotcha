# Gotcha! Calculator - Project Summary

## What We Built

A complete, production-ready web application for calculating weighted pull probabilities in gacha games. The app is built as a static site that can be deployed to GitHub Pages or any web server.

## Key Features Implemented

### ✅ Core Requirements
- **Entry Management**: Add, edit, and remove entries with names and weights
- **Probability Calculations**: Real-time calculation of pull probabilities and expected counts
- **Interactive UI**: Responsive form/table with inline editing
- **Chart Visualization**: Beautiful pie charts showing weight distribution
- **Total Pulls Input**: Configurable number of pulls for calculations

### ✅ Bonus Features
- **Collections System**: Organize entries into different collections (banners, events)
- **Local Storage**: All data persists between sessions
- **CSV Export**: Export results as downloadable CSV files
- **Input Validation**: Prevents invalid weights and names
- **Responsive Design**: Works perfectly on mobile and desktop

### ✅ Tech Stack
- **React 18** with hooks for state management
- **Tailwind CSS** for modern, responsive styling
- **Chart.js** with react-chartjs-2 for data visualization
- **PapaParse** for CSV export functionality
- **Create React App** for build tooling

## Project Structure

```
gotcha/
├── public/
│   └── index.html          # Main HTML file
├── src/
│   ├── App.js              # Main React component
│   ├── index.js            # React entry point
│   └── index.css           # Tailwind CSS imports
├── build/                  # Production build output
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── README.md               # Comprehensive documentation
├── DEPLOYMENT.md           # Detailed deployment guide
├── setup.js                # Demo data setup script
└── .gitignore              # Git ignore rules
```

## How to Use

### Quick Start
1. `npm install` - Install dependencies
2. `npm start` - Start development server
3. Open browser console and run the code from `setup.js` for demo data
4. Refresh page to see sample entries

### Adding Entries
1. Enter a name (e.g., "SSR Character")
2. Enter a weight (e.g., 1 for 1% chance)
3. Click "Add" to add to current collection

### Managing Collections
- Click "Add Collection" to create new collections
- Switch between collections by clicking collection names
- Delete collections with the "×" button

### Calculations
The app automatically calculates:
- **Probability**: `(weight / total_weight) * 100`
- **Expected Count**: `(weight / total_weight) * total_pulls`
- **Total Weight**: Sum of all entry weights

### Export
- Click "Export CSV" to download current collection data
- CSV includes names, weights, probabilities, and expected counts

## Deployment Ready

The project is fully configured for GitHub Pages deployment:

1. Update `homepage` in `package.json` with your GitHub Pages URL
2. Run `npm run deploy` to deploy
3. Configure GitHub Pages to serve from `gh-pages` branch

## Data Model

```javascript
// Entry structure
{
  id: number,           // Unique identifier
  name: string,         // Entry name
  weight: number,       // Pull weight (positive integer)
  collection: string    // Collection name
}

// Local Storage keys
'gotcha-entries'           // Array of all entries
'gotcha-collections'       // Array of collection names
'gotcha-total-pulls'       // Current total pulls value
'gotcha-current-collection' // Currently selected collection
```

## Build Output

The `npm run build` command creates a fully static `build/` folder containing:
- `index.html` - Main HTML file
- `static/js/` - Optimized JavaScript bundles
- `static/css/` - Optimized CSS files
- `asset-manifest.json` - Asset mapping

This build can be deployed to any static hosting service.

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires JavaScript enabled
- Uses localStorage for data persistence

## Performance

- Optimized production build (~105KB JavaScript, ~3KB CSS)
- Lazy loading of chart components
- Efficient state management with React hooks
- Minimal dependencies for fast loading

The application is production-ready and can be deployed immediately to GitHub Pages or any static hosting service. 