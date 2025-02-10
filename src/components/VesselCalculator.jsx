"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ship, Anchor, Navigation } from 'lucide-react';

// Main Container Component
export default function VesselCalculatorContainer() {
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [selectedSubType, setSelectedSubType] = useState(null);

  const mainCategories = [
    { id: 'displacement', name: 'Displacement', icon: Ship },
    { id: 'fine-displacement', name: 'Fine Displacement', icon: Ship },
    { id: 'semi-displacement', name: 'Semi-Displacement', icon: Ship },
    { id: 'planing', name: 'Planing', icon: Ship },
    { id: 'catamaran', name: 'Catamaran', icon: Ship }
  ];

  const handleVesselSelect = (vesselType) => {
    setSelectedVessel(vesselType);
  };

  const handleSubTypeSelect = (subType) => {
    setSelectedSubType(subType);
  };

  const handleBack = () => {
    if (selectedSubType) {
      setSelectedSubType(null);
    } else {
      setSelectedVessel(null);
    }
  };

  // Main Type Selection Component
  function VesselTypeSelector({ onSelectVessel }) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Vessel Calculator</h1>
          <p className="text-gray-600">Select the type of hull for your vessel</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mainCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className="cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => onSelectVessel(category)}
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <IconComponent className="w-12 h-12 mb-4 text-blue-500" />
                  <h2 className="text-xl font-semibold text-center">{category.name}</h2>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Sub-Type Selection Component
  function VesselSubTypeSelector({ vesselType, onSelectSubType, onBack }) {
    const getSubTypes = () => {
      return [
        { id: 'type1', name: 'Type 1' },
        { id: 'type2', name: 'Type 2' },
        { id: 'type3', name: 'Type 3' },
        { id: 'type4', name: 'Type 4' },
      ];
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mr-4"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold">Select Vessel Type</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getSubTypes().map((subType) => (
            <Card 
              key={subType.id}
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => onSelectSubType(subType.id)}
            >
              <CardContent className="flex items-center p-6">
                <Anchor className="w-8 h-8 mr-4 text-blue-500" />
                <h3 className="text-lg font-semibold">{subType.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculator Component
  function VesselCalculator({ vesselType, subType, onBack }) {
    const [formData, setFormData] = useState({
      speed: '',
      bollardPull: '',
      loa: '',
      width: '',
      draft: '',
      numEngines: '',
      enginePower: '',
      engineRPM: '',
      gearboxRatio: ''
    });
    const [results, setResults] = useState(null);

    const handleInputChange = (field) => (e) => {
      const text = e.target.value;
      if (/^\d*\.?\d*$/.test(text)) {
        setFormData(prev => ({ ...prev, [field]: text }));
      }
    };

    const handleCalculate = () => {
      const {
        loa, width, draft, numEngines, enginePower,
        engineRPM, gearboxRatio, bollardPull
      } = formData;

      const loaNum = parseFloat(loa) || 0;
      const widthNum = parseFloat(width) || 0;
      const draftNum = parseFloat(draft) || 0;
      const numEnginesNum = parseFloat(numEngines) || 0;
      const enginePowerNum = parseFloat(enginePower) || 0;
      const gearboxRatioNum = parseFloat(gearboxRatio) || 1;
      const bollardPullNum = parseFloat(bollardPull) || 0;

      const diameter = loaNum + widthNum;
      const pitch = diameter / 2;
      const bar = draftNum / 3;
      const predictedSpeed = (numEnginesNum * enginePowerNum) / gearboxRatioNum;
      const predictedBollardPull = bollardPullNum - 10;

      setResults({
        diameter,
        pitch,
        bar,
        predictedSpeed,
        predictedBollardPull
      });
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mr-4"
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Vessel Specifications</h1>
            <p className="text-gray-600">
              {vesselType.name} - {subType}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([field, value]) => (
                <div key={field} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={value}
                    onChange={handleInputChange(field)}
                    placeholder={`Enter ${field.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <Button 
              className="w-full mt-6"
              onClick={handleCalculate}
            >
              Calculate
            </Button>

            {results && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Results:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>Diameter: {results.diameter.toFixed(2)}</div>
                  <div>Pitch: {results.pitch.toFixed(2)}</div>
                  <div>Bar: {results.bar.toFixed(2)}</div>
                  <div>Predicted Speed: {results.predictedSpeed.toFixed(2)}</div>
                  <div>Predicted Bollard Pull: {results.predictedBollardPull.toFixed(2)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render appropriate component based on selection state
  if (selectedVessel && selectedSubType) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <VesselCalculator 
          vesselType={selectedVessel}
          subType={selectedSubType}
          onBack={handleBack}
        />
      </div>
    );
  } else if (selectedVessel) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <VesselSubTypeSelector 
          vesselType={selectedVessel}
          onSelectSubType={handleSubTypeSelect}
          onBack={handleBack}
        />
      </div>
    );
  } else {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <VesselTypeSelector 
          onSelectVessel={handleVesselSelect}
        />
      </div>
    );
  }
}
