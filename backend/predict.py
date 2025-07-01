import os
import joblib
import pandas as pd
import json
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

print(f"Loading models from: {script_dir}")

try:
    # Load trained model, encoder, and dataset (exported from Colab)
    model = joblib.load('role_model.pkl')
    mlb = joblib.load('mlb_encoder.pkl')
    df = pd.read_pickle('skills_dataset.pkl')
    print("✅ All models loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ Error loading model files: {e}")
    print(f"Files in directory: {os.listdir('.')}")
    exit(1)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Step 1: Get JSON data from request
        data = request.get_json()
        
        if not data or 'skills' not in data:
            return jsonify({
                "error": "No skills provided",
                "predicted_role": None,
                "suggested_skills": []
            }), 400
            
        user_input = data['skills']
        
        # Step 2: Clean and filter input
        user_input = [skill.strip().lower() for skill in user_input if isinstance(skill, str)]
        known_skills = set(mlb.classes_)
        filtered_input = [skill for skill in user_input if skill in known_skills]
        
        # Step 3: Check if any skills are valid
        if not filtered_input:
            return jsonify({
                "predicted_role": None,
                "message": "❌ None of the input skills matched known skills in the model.",
                "suggested_skills": [],
                "known_skills_sample": list(known_skills)[:20]  # Show sample of known skills
            }), 400
        
        # Step 4: Transform input and predict role
        input_vector = mlb.transform([filtered_input])
        predicted_role = model.predict(input_vector)[0]
        
        # Step 5: Suggest missing skills for the predicted role
        skills_for_role = df[df['Role'] == predicted_role]['Skills']
        all_skills = Counter([skill for skill_list in skills_for_role for skill in skill_list])
        suggested_skills = [skill for skill, _ in all_skills.most_common() if skill not in user_input]
        
        # Step 6: Return the result as JSON
        result = {
            "predicted_role": predicted_role,
            "message": f"🎯 Predicted Role: {predicted_role}",
            "suggested_skills": suggested_skills[:8],  # Top 8
            "filtered_skills": filtered_input,
            "total_input_skills": len(user_input),
            "matched_skills": len(filtered_input)
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"❌ Error during prediction: {str(e)}")
        return jsonify({
            "error": f"Error during prediction: {str(e)}",
            "predicted_role": None,
            "suggested_skills": []
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'total_known_skills': len(mlb.classes_),
        'total_roles': len(df['Role'].unique())
    })

@app.route('/skills', methods=['GET'])
def get_known_skills():
    """Endpoint to get all known skills"""
    return jsonify({
        'known_skills': sorted(list(mlb.classes_)),
        'total_count': len(mlb.classes_)
    })

if __name__ == '__main__':
    print("🚀 Starting Career Compass Prediction Service...")
    print(f"📁 Working directory: {os.getcwd()}")
    print(f"🎯 Total known skills: {len(mlb.classes_)}")
    print(f"💼 Total roles in dataset: {len(df['Role'].unique())}")
    print(f"🌐 Server starting on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)