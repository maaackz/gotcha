// Demo script to populate localStorage with sample data
// Run this in the browser console after starting the app

const sampleEntries = [
  { id: 1, name: "SSR Character", weight: 1, collection: "default" },
  { id: 2, name: "SR Character", weight: 10, collection: "default" },
  { id: 3, name: "R Character", weight: 89, collection: "default" },
  { id: 4, name: "Limited SSR", weight: 0.5, collection: "limited" },
  { id: 5, name: "Limited SR", weight: 5, collection: "limited" },
  { id: 6, name: "Limited R", weight: 94.5, collection: "limited" }
];

const sampleCollections = ["limited"];

// Clear existing data
localStorage.removeItem('gotcha-entries');
localStorage.removeItem('gotcha-collections');
localStorage.removeItem('gotcha-total-pulls');
localStorage.removeItem('gotcha-current-collection');

// Set sample data
localStorage.setItem('gotcha-entries', JSON.stringify(sampleEntries));
localStorage.setItem('gotcha-collections', JSON.stringify(sampleCollections));
localStorage.setItem('gotcha-total-pulls', '1000');
localStorage.setItem('gotcha-current-collection', 'default');

console.log('Demo data loaded! Refresh the page to see the sample entries.'); 