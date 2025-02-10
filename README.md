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
