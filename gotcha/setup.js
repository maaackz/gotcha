// Setup script for Gotcha! Calculator
// This script can be run in the browser console to initialize sample data

console.log('Setting up Gotcha! Calculator with sample data...');

// Sample data for demonstration
const sampleEntries = [
  { id: Date.now(), name: "SSR Character", weight: 1, collection: "default" },
  { id: Date.now() + 1, name: "SR Character", weight: 10, collection: "default" },
  { id: Date.now() + 2, name: "R Character", weight: 89, collection: "default" },
  { id: Date.now() + 3, name: "Limited SSR", weight: 0.5, collection: "limited" },
  { id: Date.now() + 4, name: "Limited SR", weight: 5, collection: "limited" },
  { id: Date.now() + 5, name: "Limited R", weight: 94.5, collection: "limited" }
];

const sampleCollections = ["limited"];

// Clear any existing data
localStorage.removeItem('gotcha-entries');
localStorage.removeItem('gotcha-collections');
localStorage.removeItem('gotcha-total-pulls');
localStorage.removeItem('gotcha-current-collection');

// Set sample data
localStorage.setItem('gotcha-entries', JSON.stringify(sampleEntries));
localStorage.setItem('gotcha-collections', JSON.stringify(sampleCollections));
localStorage.setItem('gotcha-total-pulls', '1000');
localStorage.setItem('gotcha-current-collection', 'default');

console.log('✅ Sample data loaded successfully!');
console.log('📊 Default collection: SSR (1%), SR (10%), R (89%)');
console.log('🎯 Limited collection: Limited SSR (0.5%), Limited SR (5%), Limited R (94.5%)');
console.log('🔄 Refresh the page to see the sample entries.');
console.log('🎛️ Try the dual input system: type exact values or use sliders!');
console.log('📝 Click on entry values to edit with both number input and slider.');
console.log('🎯 NEW: Click on Expected values to set desired outcomes - weight adjusts automatically!'); 