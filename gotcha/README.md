# Gotcha! - Weighted Pulls Calculator

A static web application for calculating weighted pull probabilities in gacha games. Built with React, Tailwind CSS, and Chart.js.

## Features

- **Entry Management**: Add, edit, and remove entries with custom names and weights
- **Collections**: Organize entries into different collections (e.g., different banners, events)
- **Real-time Calculations**: Automatic probability and expected count calculations
- **Interactive Charts**: Beautiful pie charts showing weight distribution
- **Data Persistence**: All data is saved to localStorage
- **Export Functionality**: Export results as CSV files
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **PapaParse** - CSV export functionality
- **Create React App** - Build tool

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gotcha.git
cd gotcha
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

To create a production build:

```bash
npm run build
```

This creates a `build` folder with optimized static files ready for deployment.

## Deployment to GitHub Pages

### Automatic Deployment

1. Update the `homepage` field in `package.json` with your GitHub Pages URL:
```json
{
  "homepage": "https://yourusername.github.io/gotcha"
}
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

This command will:
- Build the project
- Deploy it to the `gh-pages` branch
- Make it available at your GitHub Pages URL

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Push the `build` folder contents to your repository's `gh-pages` branch or configure GitHub Pages to serve from the `build` folder.

## Usage

### Adding Entries

1. Enter an entry name (e.g., "SSR Character", "SR Character")
2. Enter a weight value (e.g., 1, 10, 100)
3. Click "Add" to add the entry to the current collection

### Managing Collections

- Use the "Add Collection" button to create new collections
- Click on collection names to switch between them
- Use the "×" button to delete collections (cannot delete the default collection)

### Calculating Probabilities

- The app automatically calculates:
  - Individual entry probabilities as percentages
  - Expected counts based on the total number of pulls
  - Total weight and distribution

### Exporting Data

- Click the "Export CSV" button to download the current collection's data as a CSV file
- The CSV includes entry names, weights, probabilities, and expected counts

## Data Model

Each entry contains:
- **Name**: String identifier for the entry
- **Weight**: Positive integer representing the pull weight
- **Collection**: String identifier for grouping entries

The application calculates:
- **Total Weight**: Sum of all entry weights in the current collection
- **Probability**: `(entry_weight / total_weight) * 100`
- **Expected Count**: `(entry_weight / total_weight) * total_pulls`

## Local Storage

The application automatically saves all data to localStorage:
- `gotcha-entries`: Array of all entries
- `gotcha-collections`: Array of collection names
- `gotcha-total-pulls`: Current total pulls value
- `gotcha-current-collection`: Currently selected collection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub. 