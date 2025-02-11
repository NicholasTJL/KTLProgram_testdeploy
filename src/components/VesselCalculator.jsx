"use client"

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ship, Anchor, Navigation } from 'lucide-react';

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

  function VesselSubTypeSelector({ vesselType, onSelectSubType, onBack }) {
    const vesselSubTypes = {
      'displacement': [
        { id: 'cargoboat', name: 'Cargo Boat' },
        { id: 'landing-craft', name: 'Landing Craft' },
        { id: 'roro-ferry', name: 'Roro Ferry' },
        { id: 'sea-going-freighter', name: 'Sea Going Freighter' }
      ],
      'fine-displacement': [
        { id: 'passenger-vessel', name: 'Passenger Vessel' },
        { id: 'cruise-ship', name: 'Cruise Ship' },
        { id: 'yacht', name: 'Yacht' },
        { id: 'research-vessel', name: 'Research Vessel' }
      ],
      'semi-displacement': [
        { id: 'patrol-boat', name: 'Patrol Boat' },
        { id: 'pilot-boat', name: 'Pilot Boat' },
        { id: 'rescue-vessel', name: 'Rescue Vessel' },
        { id: 'work-boat', name: 'Work Boat' }
      ],
      'planing': [
        { id: 'speed-boat', name: 'Speed Boat' },
        { id: 'race-boat', name: 'Race Boat' },
        { id: 'leisure-craft', name: 'Leisure Craft' },
        { id: 'tender', name: 'Tender' }
      ],
      'catamaran': [
        { id: 'ferry', name: 'Ferry' },
        { id: 'sport-fishing', name: 'Sport Fishing' },
        { id: 'dive-support', name: 'Dive Support' },
        { id: 'wind-farm', name: 'Wind Farm Support' }
      ]
    };

    const getSubTypes = () => {
      return vesselSubTypes[vesselType.id] || [];
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
            <h1 className="text-2xl font-bold">Select {vesselType.name} Type</h1>
            <p className="text-gray-600">Choose your specific vessel configuration</p>
          </div>
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

  function VesselCalculator({ vesselType, subType, onBack }) {
    const formFields = {
      speed: { label: 'Speed', unit: 'knots' },
      bollardPull: { label: 'Bollard Pull', unit: 'tonnes' },
      loa: { label: 'Length Overall (LOA)', unit: 'm' },
      width: { label: 'Width', unit: 'm' },
      draft: { label: 'Draft', unit: 'm' },
      numEngines: { label: 'Number of Engines', unit: 'units' },
      enginePower: { label: 'Engine Power', unit: 'kW' },
      engineRPM: { label: 'Engine RPM', unit: 'rpm' },
      gearboxRatio: { label: 'Gearbox Ratio', unit: ':1' }
    };

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

    const handleCalculate = async () => {
      try {
        // Clear previous results first
        setResults(null);

        console.log('Sending request to:', `${process.env.NEXT_PUBLIC_API_URL}/calculate`);
        const response = await fetch(`https://nicholas287.pythonanywhere.com/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            vessel_type: vesselType.id,
            sub_type: subType,
            ...formData
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.status === 'success') {
          setResults(data.results);
        } else {
          console.error('Calculation error:', data.message);
        }
      } catch (error) {
        console.error('API error:', error);
        alert('Failed to calculate. Please make sure the backend server is running.');
      }
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
            <p className="text-black">
              {vesselType.name} - {subType}
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([field, value]) => (
                <div key={field} className="space-y-2">
                  <label className="text-sm font-medium text-white">
                    {formFields[field].label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 border rounded text-black bg-white"
                      value={value}
                      onChange={handleInputChange(field)}
                      placeholder={`Enter ${formFields[field].label.toLowerCase()}`}
                    />
                    <span className="absolute right-3 top-2 text-gray-500">
                      {formFields[field].unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md shadow-md border border-blue-600"
              onClick={handleCalculate}
            >
              Calculate
            </Button>

            {results && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4 text-black">Results:</h3>
                
                {/* Vessel Characteristics */}
                <div className="mb-4">
                  <h4 className="font-medium text-black mb-2">Vessel Characteristics:</h4>
                  <div className="grid grid-cols-2 gap-4 text-black">
                    {results.vessel_characteristics && Object.entries(results.vessel_characteristics).map(([key, value]) => (
                      <div key={key}>
                        {key.replace(/_/g, ' ').charAt(0).toUpperCase() + 
                         key.replace(/_/g, ' ').slice(1)}: {
                          typeof value === 'number' ? value.toFixed(2) : value || 'N/A'
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* Propulsion Parameters */}
                <div className="mb-4">
                  <h4 className="font-medium text-black mb-2">Propulsion Parameters:</h4>
                  <div className="grid grid-cols-2 gap-4 text-black">
                    {results.propulsion_parameters && Object.entries(results.propulsion_parameters).map(([key, value]) => (
                      <div key={key}>
                        {key.replace(/_/g, ' ').charAt(0).toUpperCase() + 
                         key.replace(/_/g, ' ').slice(1)}: {
                          typeof value === 'number' ? value.toFixed(2) : value || 'N/A'
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div>
                  <h4 className="font-medium text-black mb-2">Performance:</h4>
                  <div className="grid grid-cols-2 gap-4 text-black">
                    {results.performance && Object.entries(results.performance).map(([key, value]) => (
                      <div key={key}>
                        {key.replace(/_/g, ' ').charAt(0).toUpperCase() + 
                         key.replace(/_/g, ' ').slice(1)}: {
                          typeof value === 'number' ? value.toFixed(2) : value || 'N/A'
                        }
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

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
