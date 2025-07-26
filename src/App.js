import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

function App() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ name: '', weight: 1, amount: 1, probability: '' });
  const [totalPulls, setTotalPulls] = useState(100);
  const [useTotalPulls, setUseTotalPulls] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState('default');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [bulkEditValues, setBulkEditValues] = useState({ weight: '', amount: '', probability: '' });
  const [loaded, setLoaded] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      // Test localStorage functionality
      const testKey = 'gotcha-test';
      localStorage.setItem(testKey, 'test-value');
      const testValue = localStorage.getItem(testKey);
      console.log('localStorage test:', testValue === 'test-value' ? 'PASSED' : 'FAILED');
      localStorage.removeItem(testKey);

      const savedCurrentCollection = localStorage.getItem('gotcha-current-collection');
      if (savedCurrentCollection) {
        setCurrentCollection(savedCurrentCollection);
      }
      const savedEntries = localStorage.getItem('gotcha-entries');
      if (savedEntries) {
        // Ensure amount and probability are present for each entry
        const parsedEntries = JSON.parse(savedEntries).map(entry => ({
          ...entry,
          amount: entry.amount !== undefined ? entry.amount : 1,
          probability: entry.probability !== undefined ? entry.probability : ''
        }));
        setEntries(parsedEntries);
      }
      const savedCollections = localStorage.getItem('gotcha-collections');
      if (savedCollections) {
        setCollections(JSON.parse(savedCollections));
      }
      const savedTotalPulls = localStorage.getItem('gotcha-total-pulls');
      if (savedTotalPulls) {
        setTotalPulls(parseInt(savedTotalPulls));
      }
      const savedUseTotalPulls = localStorage.getItem('gotcha-use-total-pulls');
      if (savedUseTotalPulls) {
        setUseTotalPulls(JSON.parse(savedUseTotalPulls));
      }
      setLoaded(true);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!loaded) return;
    try {
      // Save amount and probability for each entry
      const entriesToSave = entries.map(entry => ({
        ...entry,
        amount: entry.amount !== undefined ? entry.amount : 1,
        probability: entry.probability !== undefined ? entry.probability : ''
      }));
      localStorage.setItem('gotcha-entries', JSON.stringify(entriesToSave));
      localStorage.setItem('gotcha-collections', JSON.stringify(collections));
      localStorage.setItem('gotcha-total-pulls', totalPulls.toString());
      localStorage.setItem('gotcha-use-total-pulls', JSON.stringify(useTotalPulls));
      localStorage.setItem('gotcha-current-collection', currentCollection);
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [entries, collections, totalPulls, useTotalPulls, currentCollection, loaded]);

  const addEntry = () => {
    if (!newEntry.name.trim() || (newEntry.weight <= 0 && !newEntry.amount && !newEntry.probability)) {
      alert('Please enter a valid name and either a positive weight, amount, or probability');
      return;
    }

    // Calculate weight based on desired amount or probability if provided
    let calculatedWeight = newEntry.weight;
    
    if (newEntry.probability && newEntry.probability.trim()) {
      // If probability is provided, calculate weight from it
      const decimal = fractionToDecimal(newEntry.probability);
      if (decimal !== null) {
        const currentEntries = entries.filter(entry => entry.collection === currentCollection);
        const otherTotalWeight = currentEntries.reduce((sum, entry) => sum + entry.weight, 0);
        calculatedWeight = (decimal * otherTotalWeight) / (1 - decimal);
        calculatedWeight = Math.max(0.1, Math.round(calculatedWeight * 100) / 100);
      }
    } else if (newEntry.amount > 0) {
      // If amount is provided, use it directly as the weight
      // This makes it more intuitive - amount 10 = weight 10
      calculatedWeight = Math.max(0.1, Math.round(newEntry.amount * 100) / 100);
    }

    const entry = {
      id: Date.now(),
      name: newEntry.name.trim(),
      weight: calculatedWeight,
      collection: currentCollection
    };

    setEntries(prevEntries => [...prevEntries, entry]);
    setNewEntry({ name: '', weight: 1, amount: 1, probability: '' });
  };

  // Helper function to get probability as fraction for a specific entry
  const getProbabilityFraction = (entry) => {
    const currentEntries = entries.filter(e => e.collection === currentCollection);
    const totalWeight = currentEntries.reduce((sum, e) => sum + e.weight, 0);
    
    if (totalWeight === 0) return '0';
    
    const probability = entry.weight / totalWeight;
    if (probability === 0) return '0';
    if (probability === 1) return '1';
    
    // Calculate the actual denominator based on total weight
    const denominator = Math.round(1 / probability);
    return `1/${denominator}`;
  };

  // Helper function to convert fraction to decimal
  const fractionToDecimal = (fraction) => {
    const parts = fraction.split('/');
    if (parts.length !== 2) return null;
    
    const numerator = parseFloat(parts[0]);
    const denominator = parseFloat(parts[1]);
    
    if (isNaN(numerator) || isNaN(denominator) || denominator === 0) return null;
    
    return numerator / denominator;
  };

  const updateEntryByFraction = (id, fraction) => {
    const decimal = fractionToDecimal(fraction);
    if (decimal === null) {
      alert('Please enter a valid fraction (e.g., 1/6, 1/72)');
      return;
    }
    
    const currentEntries = entries.filter(entry => entry.collection === currentCollection);
    const otherEntries = currentEntries.filter(entry => entry.id !== id);
    const otherTotalWeight = otherEntries.reduce((sum, entry) => sum + entry.weight, 0);
    
    // Calculate new weight based on desired probability
    const newWeight = (decimal * otherTotalWeight) / (1 - decimal);
    const finalWeight = Math.max(0.1, Math.round(newWeight * 100) / 100);
    
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, weight: finalWeight } : entry
      )
    );
    setEditingId(null);
    setEditingField(null);
  };

  const updateEntry = (id, updatedEntry) => {
    setEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
    setEditingId(null);
    setEditingField(null);
  };

  const updateEntryByAmount = (id, amountValue) => {
    if (useTotalPulls) {
      // When using fixed total pulls, calculate weight needed for the desired amount
      const currentEntries = entries.filter(entry => entry.collection === currentCollection);
      const otherEntries = currentEntries.filter(entry => entry.id !== id);
      const otherTotalWeight = otherEntries.reduce((sum, entry) => sum + entry.weight, 0);
      
      // Calculate the weight needed for this specific amount
      const targetWeight = (amountValue / totalPulls) * (otherTotalWeight + 1);
      const finalWeight = Math.max(0.1, Math.round(targetWeight * 100) / 100);
      
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === id ? { ...entry, weight: finalWeight } : entry
        )
      );
    } else {
      // When not using fixed total pulls, adjust weight proportionally
      const currentEntries = entries.filter(entry => entry.collection === currentCollection);
      const entryToUpdate = currentEntries.find(entry => entry.id === id);
      
      if (!entryToUpdate) return;
      
      // Calculate current amount for this entry
      const currentTotalWeight = currentEntries.reduce((sum, entry) => sum + entry.weight, 0);
      const currentAmount = currentTotalWeight > 0 ? ((entryToUpdate.weight / currentTotalWeight) * effectiveTotalPulls) : 0;
      
      // Calculate the ratio of desired amount to current amount
      const ratio = currentAmount > 0 ? amountValue / currentAmount : 1;
      
      // Adjust the weight by this ratio
      const newWeight = Math.max(0.1, Math.round(entryToUpdate.weight * ratio * 100) / 100);
      
      setEntries(prevEntries => 
        prevEntries.map(entry => 
          entry.id === id ? { ...entry, weight: newWeight } : entry
        )
      );
    }
    setEditingId(null);
    setEditingField(null);
  };

  const deleteEntry = (id) => {
    setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
  };

  const addCollection = () => {
    const collectionName = prompt('Enter collection name:');
    if (collectionName && collectionName.trim()) {
      setCollections(prevCollections => [...prevCollections, collectionName.trim()]);
    }
  };

  const deleteCollection = (collectionName) => {
    if (collectionName === 'default') {
      alert('Cannot delete the default collection');
      return;
    }
    setEntries(prevEntries => prevEntries.filter(entry => entry.collection !== collectionName));
    setCollections(prevCollections => prevCollections.filter(col => col !== collectionName));
    if (currentCollection === collectionName) {
      setCurrentCollection('default');
    }
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const toggleEntrySelection = (id) => {
    setSelectedEntries(prev => 
      prev.includes(id) 
        ? prev.filter(entryId => entryId !== id)
        : [...prev, id]
    );
  };

  const selectAllEntries = () => {
    const allIds = currentEntries.map(entry => entry.id);
    setSelectedEntries(allIds);
  };

  const clearSelection = () => {
    setSelectedEntries([]);
  };

  const bulkUpdateEntries = () => {
    if (selectedEntries.length === 0) return;

    setEntries(prevEntries => 
      prevEntries.map(entry => {
        if (!selectedEntries.includes(entry.id)) return entry;
        
        const updates = {};
        
        if (bulkEditValues.weight !== '') {
          updates.weight = Math.max(0.1, Math.round(parseFloat(bulkEditValues.weight) * 100) / 100);
        }
        
        if (bulkEditValues.amount !== '') {
          // Use proportional adjustment for amounts
          const currentEntries = entries.filter(e => e.collection === currentCollection);
          const currentTotalWeight = currentEntries.reduce((sum, e) => sum + e.weight, 0);
          const currentAmount = currentTotalWeight > 0 ? ((entry.weight / currentTotalWeight) * effectiveTotalPulls) : 0;
          const ratio = currentAmount > 0 ? parseInt(bulkEditValues.amount) / currentAmount : 1;
          updates.weight = Math.max(0.1, Math.round(entry.weight * ratio * 100) / 100);
        }
        
        if (bulkEditValues.probability !== '') {
          const decimal = fractionToDecimal(bulkEditValues.probability);
          if (decimal !== null) {
            const currentEntries = entries.filter(e => e.collection === currentCollection);
            const otherEntries = currentEntries.filter(e => !selectedEntries.includes(e.id));
            const otherTotalWeight = otherEntries.reduce((sum, e) => sum + e.weight, 0);
            const newWeight = (decimal * otherTotalWeight) / (1 - decimal);
            updates.weight = Math.max(0.1, Math.round(newWeight * 100) / 100);
          }
        }
        
        return { ...entry, ...updates };
      })
    );

    setBulkEditMode(false);
    setBulkEditValues({ weight: '', amount: '', probability: '' });
    setSelectedEntries([]);
  };

  const deleteSelectedEntries = () => {
    if (selectedEntries.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedEntries.length} selected entries?`)) {
      setEntries(prevEntries => prevEntries.filter(entry => !selectedEntries.includes(entry.id)));
      setSelectedEntries([]);
      setBulkEditMode(false);
    }
  };

  const currentEntries = entries.filter(entry => entry.collection === currentCollection);
  const totalWeight = currentEntries.reduce((sum, entry) => sum + entry.weight, 0);
  
  // Calculate effective total pulls based on amounts
  const effectiveTotalPulls = useTotalPulls ? totalPulls : 
    currentEntries.length > 0 ? 
      Math.max(...currentEntries.map(entry => {
        const probability = totalWeight > 0 ? (entry.weight / totalWeight) : 0;
        return probability > 0 ? entry.weight / probability : 0;
      })) : 100;

  const chartData = {
    labels: currentEntries.map(entry => entry.name),
    datasets: [
      {
        data: currentEntries.map(entry => entry.weight),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#06B6D4',
          '#84CC16',
          '#F97316',
          '#EC4899',
          '#6B7280'
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#3B82F6',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const weight = context.parsed;
            const percentage = totalWeight > 0 ? ((weight / totalWeight) * 100).toFixed(2) : 0;
            return `${context.label}: ${weight} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2">
            gotcha!
          </h1>
          <p className="text-slate-600 text-lg">Weighted Pulls Calculator</p>
          <button
            onClick={() => {
              console.log('Current localStorage:', {
                entries: localStorage.getItem('gotcha-entries'),
                collections: localStorage.getItem('gotcha-collections'),
                totalPulls: localStorage.getItem('gotcha-total-pulls'),
                useTotalPulls: localStorage.getItem('gotcha-use-total-pulls'),
                currentCollection: localStorage.getItem('gotcha-current-collection')
              });
              console.log('Current state:', { entries, collections, totalPulls, useTotalPulls, currentCollection });
            }}
            className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Debug localStorage
          </button>
        </header>

        {/* Collections Management */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Collections</h2>
            <button
              onClick={addCollection}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl transition-colors"
            >
              Add Collection
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentCollection('default')}
              className={`px-4 py-2 rounded-xl transition-colors ${
                currentCollection === 'default'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200'
              }`}
            >
              Default
            </button>
            {collections.map(collection => (
              <div key={collection} className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentCollection(collection)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    currentCollection === collection
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white/50 text-slate-700 hover:bg-white/80 border border-slate-200'
                  }`}
                >
                  {collection}
                </button>
                <button
                  onClick={() => deleteCollection(collection)}
                  className="text-red-500 hover:text-red-700 text-sm bg-white/50 rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Entry Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Add Entry</h2>
          <div className="space-y-4">
            {/* Name Field - Full Width */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Entry Name</label>
              <input
                type="text"
                placeholder="e.g., SSR Character"
                value={newEntry.name}
                onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm"
              />
            </div>
            
            {/* Three Fields in a Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Weight Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Weight</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={Math.round(newEntry.weight * 100) / 100}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) || 0.1 })}
                    className="w-20 px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-center"
                  />
                  <input
                    type="range"
                    min="0.1"
                    max="100"
                    step="0.1"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: parseFloat(e.target.value) })}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
              
              {/* Amount Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={Math.round(newEntry.amount)}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-center"
                />
              </div>
              
              {/* Probability Field */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Probability</label>
                <input
                  type="text"
                  placeholder="e.g., 1/6"
                  value={newEntry.probability}
                  onChange={(e) => setNewEntry({ ...newEntry, probability: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-center"
                />
              </div>
            </div>
            
            {/* Add Button - Centered */}
            <div className="flex justify-center pt-2">
              <button
                onClick={addEntry}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-colors font-medium"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>

        {/* Total Pulls Input - Optional */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useTotalPulls"
                checked={useTotalPulls}
                onChange={(e) => setUseTotalPulls(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="useTotalPulls" className="text-sm font-medium text-slate-700">
                Use fixed total pulls
              </label>
            </div>
            {useTotalPulls ? (
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">Total Pulls</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={totalPulls}
                    onChange={(e) => setTotalPulls(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-center"
                  />
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    value={totalPulls}
                    onChange={(e) => setTotalPulls(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Effective Total Pulls: {Math.round(effectiveTotalPulls)}
                </label>
                <p className="text-sm text-slate-600">
                  Set your desired amounts and adjust weights to reach your goals
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Weight Distribution</h2>
            {currentEntries.length > 0 ? (
              <div className="h-80">
                <Pie data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p>No entries to display</p>
                </div>
              </div>
            )}
          </div>

          {/* Entries Table */}
          {console.log('entries:', entries, 'currentCollection:', currentCollection)}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-800">Entries</h2>
              {currentEntries.length > 0 && (
                <div className="flex gap-2">
                  {selectedEntries.length > 0 ? (
                    <>
                      <button
                        onClick={() => setBulkEditMode(!bulkEditMode)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm"
                      >
                        {bulkEditMode ? 'Cancel' : 'Bulk Edit'}
                      </button>
                      <button
                        onClick={deleteSelectedEntries}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl transition-colors text-sm"
                      >
                        Delete ({selectedEntries.length})
                      </button>
                      <button
                        onClick={clearSelection}
                        className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
                      >
                        Clear
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={selectAllEntries}
                      className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-colors text-sm"
                    >
                      Select All
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Bulk Edit Panel */}
            {bulkEditMode && selectedEntries.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-medium text-blue-800 mb-3">Bulk Edit {selectedEntries.length} Selected Entries</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Weight</label>
                    <input
                      type="number"
                      min="0.1"
                      max="100"
                      step="0.1"
                      placeholder="Leave empty to skip"
                      value={bulkEditValues.weight}
                      onChange={(e) => setBulkEditValues({ ...bulkEditValues, weight: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Amount</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Leave empty to skip"
                      value={bulkEditValues.amount}
                      onChange={(e) => setBulkEditValues({ ...bulkEditValues, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Probability</label>
                    <input
                      type="text"
                      placeholder="e.g., 1/6 (leave empty to skip)"
                      value={bulkEditValues.probability}
                      onChange={(e) => setBulkEditValues({ ...bulkEditValues, probability: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={bulkUpdateEntries}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Apply Changes
                  </button>
                  <button
                    onClick={() => {
                      setBulkEditMode(false);
                      setBulkEditValues({ weight: '', amount: '', probability: '' });
                    }}
                    className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {currentEntries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-3 font-medium text-slate-700 w-8">
                        <input
                          type="checkbox"
                          checked={selectedEntries.length === currentEntries.length && currentEntries.length > 0}
                          onChange={() => selectedEntries.length === currentEntries.length ? clearSelection() : selectAllEntries()}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="text-left py-3 px-3 font-medium text-slate-700">Name</th>
                      <th className="text-left py-3 px-3 font-medium text-slate-700">Weight</th>
                      <th className="text-left py-3 px-3 font-medium text-slate-700">Probability</th>
                      <th className="text-left py-3 px-3 font-medium text-slate-700">Amount</th>
                      <th className="text-left py-3 px-3 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntries.map(entry => (
                      <tr key={entry.id} className={`border-b border-slate-100 hover:bg-white/30 transition-colors ${selectedEntries.includes(entry.id) ? 'bg-blue-50' : ''}`}>
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={selectedEntries.includes(entry.id)}
                            onChange={() => toggleEntrySelection(entry.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="py-3 px-3">
                          {editingId === entry.id && editingField === 'name' ? (
                            <input
                              type="text"
                              defaultValue={entry.name}
                              onBlur={(e) => updateEntry(entry.id, { name: e.target.value })}
                              onKeyPress={(e) => e.key === 'Enter' && updateEntry(entry.id, { name: e.target.value })}
                              onClick={handleInputClick}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                              autoFocus
                            />
                          ) : (
                            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => { setEditingId(entry.id); setEditingField('name'); }}>
                              {entry.name}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === entry.id && editingField === 'weight' ? (
                            <div className="flex gap-2 items-center" onClick={handleInputClick}>
                              <input
                                type="number"
                                min="0.1"
                                max="100"
                                step="0.1"
                                defaultValue={Math.round(entry.weight * 100) / 100}
                                onBlur={(e) => updateEntry(entry.id, { weight: parseFloat(e.target.value) || 0.1 })}
                                onKeyPress={(e) => e.key === 'Enter' && updateEntry(entry.id, { weight: parseFloat(e.target.value) || 0.1 })}
                                className="w-16 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/50 text-center text-sm"
                              />
                              <input
                                type="range"
                                min="0.1"
                                max="100"
                                step="0.1"
                                defaultValue={Math.round(entry.weight * 100) / 100}
                                onBlur={(e) => updateEntry(entry.id, { weight: parseFloat(e.target.value) })}
                                className="w-20 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                            </div>
                          ) : (
                            <span className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => { setEditingId(entry.id); setEditingField('weight'); }}>
                              {Math.round(entry.weight * 100) / 100}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === entry.id && editingField === 'probability' ? (
                            <input
                              type="text"
                              placeholder="e.g., 1/6"
                              defaultValue={getProbabilityFraction(entry)}
                              onBlur={(e) => updateEntryByFraction(entry.id, e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && updateEntryByFraction(entry.id, e.target.value)}
                              onClick={handleInputClick}
                              className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/50 text-center text-sm"
                              autoFocus
                            />
                          ) : (
                            <span className="cursor-pointer hover:text-blue-600 transition-colors font-medium text-slate-700" onClick={() => { setEditingId(entry.id); setEditingField('probability'); }}>
                              {getProbabilityFraction(entry)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {editingId === entry.id && editingField === 'amount' ? (
                            <input
                              type="number"
                              min="0"
                              step="1"
                              defaultValue={Math.round(totalWeight > 0 ? ((entry.weight / totalWeight) * effectiveTotalPulls) : 0)}
                              onBlur={(e) => updateEntryByAmount(entry.id, parseInt(e.target.value) || 0)}
                              onKeyPress={(e) => e.key === 'Enter' && updateEntryByAmount(entry.id, parseInt(e.target.value) || 0)}
                              onClick={handleInputClick}
                              className="w-20 px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/50 text-center text-sm"
                              autoFocus
                            />
                          ) : (
                            <span className="cursor-pointer hover:text-blue-600 transition-colors font-medium text-slate-700" onClick={() => { setEditingId(entry.id); setEditingField('amount'); }}>
                              {Math.round(totalWeight > 0 ? ((entry.weight / totalWeight) * effectiveTotalPulls) : 0)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="text-red-500 hover:text-red-700 text-sm bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No entries in this collection</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {currentEntries.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 p-6 mt-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">{currentEntries.length}</div>
                <div className="text-slate-600 font-medium">Total Entries</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">{Math.round(effectiveTotalPulls)}</div>
                <div className="text-slate-600 font-medium">
                  {useTotalPulls ? 'Total Pulls' : 'Effective Pulls'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 