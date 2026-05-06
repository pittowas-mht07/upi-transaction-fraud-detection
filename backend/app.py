from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
from datetime import datetime
import uuid

transactions_history = []

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model pipeline
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fraud_detection_pipeline.pkl')
try:
    pipeline = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")
    pipeline = None

EXPECTED_COLUMNS = [
    'amount', 'hour_of_day', 'day_of_week', 'is_night_transaction', 
    'receiver_type_User', 'payment_app_BHIM', 'payment_app_GPay', 
    'payment_app_Paytm', 'payment_app_PhonePe', 'payment_app_WhatsApp Pay', 
    'device_type_Web', 'device_type_iOS', 'user_city_tier_Tier 2', 
    'user_city_tier_Tier 3', 'user_kyc_status_Verified'
]

@app.route('/predict', methods=['POST'])
def predict():
    if not pipeline:
        return jsonify({'error': 'Model pipeline is not loaded.'}), 500

    try:
        # Get JSON data from the request
        data = request.get_json(force=True)
        
        # Initialize a dictionary for the row with all 0s
        row = {col: 0 for col in EXPECTED_COLUMNS}
        
        # 1. Amount
        row['amount'] = float(data.get('amount', 0))
        
        # 2. Time-based features
        # The frontend will pass a timestamp or time string. Let's assume ISO format or just parsing it.
        txn_time_str = data.get('transaction_time', '')
        if txn_time_str:
            dt = pd.to_datetime(txn_time_str)
            row['hour_of_day'] = dt.hour
            row['day_of_week'] = dt.dayofweek
            row['is_night_transaction'] = 1 if (dt.hour < 6 or dt.hour > 22) else 0
            
        # 3. Receiver Type
        if data.get('receiver_type') == 'User':
            row['receiver_type_User'] = 1
            
        # 4. Payment App
        app_name = data.get('payment_app', '')
        col_name = f"payment_app_{app_name}"
        if col_name in row:
            row[col_name] = 1
            
        # 5. Device Type
        device = data.get('device_type', '')
        col_name = f"device_type_{device}"
        if col_name in row:
            row[col_name] = 1
            
        # 6. City Tier
        tier = data.get('user_city_tier', '')
        col_name = f"user_city_tier_{tier}"
        if col_name in row:
            row[col_name] = 1
            
        # 7. KYC Status
        if data.get('user_kyc_status') == 'Verified':
            row['user_kyc_status_Verified'] = 1

        # Convert to pandas DataFrame
        df = pd.DataFrame([row], columns=EXPECTED_COLUMNS)
        
        # Predict
        prediction = pipeline.predict(df)[0]
        
        # Try to get probability
        if hasattr(pipeline, 'predict_proba'):
            probability = float(pipeline.predict_proba(df)[0][1])
        else:
            probability = 1.0 if prediction == 1 else 0.0
            
        record = {
            'id': str(uuid.uuid4())[:8],
            'timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'amount': float(data.get('amount', 0)),
            'payment_app': data.get('payment_app', 'Unknown'),
            'receiver_type': data.get('receiver_type', 'Unknown'),
            'fraud_prediction': int(prediction),
            'fraud_probability': probability
        }
        
        transactions_history.insert(0, record)
        if len(transactions_history) > 50:
            transactions_history.pop()
            
        return jsonify({
            'fraud_prediction': int(prediction),
            'fraud_probability': probability,
            'transaction_id': record['id']
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/history', methods=['GET'])
def get_history():
    return jsonify(transactions_history)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "model_loaded": pipeline is not None})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
