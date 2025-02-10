# KTLProgram

Setting up local development environment to test both the frontend and backend together.
--
1. First, create a new directory for your Flask backend:
```bash
mkdir vessel-calculator-backend
cd vessel-calculator-backend
```

2. Create a virtual environment and install Flask:
```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install flask flask-cors
```

3. Create a new file `app.py`:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This allows your frontend to communicate with the backend

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    print("Received data:", data)  # For debugging
    
    vessel_type = data.get('vessel_type')
    sub_type = data.get('sub_type')
    
    # Example calculation logic
    if vessel_type == "displacement":
        if sub_type == "cargoboat":
            return jsonify({
                "status": "success",
                "message": "Calculation completed",
                "results": {
                    "vessel_type": vessel_type,
                    "sub_type": sub_type,
                    # Add your actual calculations here
                }
            })
    
    return jsonify({
        "status": "error",
        "message": "Unsupported vessel type"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

4. Update your frontend VesselCalculator.jsx to include the form submission:
```javascript
// Add this to your existing VesselCalculator.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch('http://localhost:5000/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vessel_type: selectedMainCategory.id,
                sub_type: selectedSubCategory.id,
                // Add your form data here
            })
        });
        
        const data = await response.json();
        console.log('Response:', data);  // For debugging
        
        // Handle the response
        if (data.status === 'success') {
            // Update your UI with the results
            setStep('results');  // Assuming you have this state
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

// Update your form to use this handler:
<form className="space-y-6" onSubmit={handleSubmit}>
    {/* Your existing form fields */}
    <Button type="submit">Calculate</Button>
</form>
```

5. To run both servers locally:

Terminal 1 (Backend):
```bash
cd vessel-calculator-backend
# Activate your virtual environment
flask run
```

Terminal 2 (Frontend):
```bash
cd vessel-calculator
npm run dev
```

Now you can:
1. Access your frontend at `http://localhost:3000`
2. The backend will be running at `http://localhost:5000`
3. When you submit the form, it will send data to your Flask backend
4. Check your browser's console and the Flask terminal for debugging information

To test:
1. Fill out the form on your frontend
2. Submit it
3. Check both terminal windows to see the data flow
4. Check your browser's console to see the response
   
--
Now that your frontend is deployed on Vercel, let's set up the Flask backend to handle different calculations for each vessel type. First, I'll help you structure the Flask backend with specific calculations for each vessel type:

1. Create a new directory for your backend:
```bash
mkdir vessel-calculator-api
cd vessel-calculator-api
```

2. Set up a Flask application with proper route handling:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import math

app = Flask(__name__)
CORS(app)

# Calculation functions for each vessel type
def calculate_displacement_cargoboat(data):
    """Calculations specific to displacement type cargoboat"""
    loa = float(data.get('loa', 0))
    width = float(data.get('width', 0))
    draft = float(data.get('draft', 0))
    engine_power = float(data.get('enginePower', 0))
    
    # Add your specific cargoboat calculations here
    return {
        "displacement": loa * width * draft * 0.85,  # Example calculation
        "power_ratio": engine_power / (loa * width),
        # Add more specific calculations
    }

def calculate_displacement_landing_craft(data):
    """Calculations specific to displacement type landing craft"""
    # Add specific calculations for landing craft
    pass

def calculate_planing_vessel(data):
    """Calculations specific to planing vessels"""
    # Add specific calculations for planing vessels
    pass

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.json
        vessel_type = data.get('vessel_type')
        sub_type = data.get('sub_type')
        
        # Dictionary to map vessel types to their calculation functions
        calculation_functions = {
            'displacement': {
                'cargoboat': calculate_displacement_cargoboat,
                'landing-craft': calculate_displacement_landing_craft,
                # Add more subtypes
            },
            'planing': {
                'type1': calculate_planing_vessel,
                # Add more subtypes
            }
            # Add more vessel types
        }
        
        # Get the appropriate calculation function
        if vessel_type in calculation_functions and sub_type in calculation_functions[vessel_type]:
            calculation_func = calculation_functions[vessel_type][sub_type]
            results = calculation_func(data)
            
            return jsonify({
                "status": "success",
                "results": results
            })
        else:
            return jsonify({
                "status": "error",
                "message": f"No calculation method for vessel type: {vessel_type}, sub type: {sub_type}"
            })
            
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)
```

3. Update your frontend to send the correct data to the backend:
```javascript
// In your VesselCalculator component, update the handleCalculate function:
const handleCalculate = async () => {
    try {
        const response = await fetch('YOUR_BACKEND_URL/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vessel_type: vesselType.id,
                sub_type: subType,
                ...formData
            })
        });
        
        const data = await response.json();
        if (data.status === 'success') {
            setResults(data.results);
        } else {
            // Handle error
            console.error('Calculation error:', data.message);
        }
    } catch (error) {
        console.error('API error:', error);
    }
};
```

To test this locally:
1. Run the Flask backend:
```bash
python app.py
```

2. The frontend is already deployed on Vercel, but for local testing you can:
```bash
npm run dev
```

Next steps:
1. Add specific calculation functions for each vessel type
2. Deploy the Flask backend (options include: PythonAnywhere, Heroku, DigitalOcean)
3. Update the frontend with the deployed backend URL

--
