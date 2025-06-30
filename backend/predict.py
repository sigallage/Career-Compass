# flask_predict_service.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from collections import Counter

app = Flask(__name__)
CORS(app)

# Load trained model, encoder, and dataset (exported from Colab)
model = joblib.load('role_model.pkl')
mlb = joblib.load('mlb_encoder.pkl')
df = pd.read_pickle('skills_dataset.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get skills from request
        data = request.get_json()
        user_input = data.get('skills', [])
        
        # Clean and filter input
        user_input = [skill.strip().lower() for skill in user_input if isinstance(skill, str)]
        known_skills = set(mlb.classes_)
        filtered_input = [skill for skill in user_input if skill in known_skills]
        
        # Check if any skills are valid
        if not filtered_input:
            return jsonify({
                "predicted_role": None,
                "message": "❌ None of the input skills matched known skills in the model.",
                "suggested_skills": []
            })
        
        # Transform input and predict role
        input_vector = mlb.transform([filtered_input])
        predicted_role = model.predict(input_vector)[0]
        
        # Suggest missing skills for the predicted role
        skills_for_role = df[df['Role'] == predicted_role]['Skills']
        all_skills = Counter([skill for skill_list in skills_for_role for skill in skill_list])
        suggested_skills = [skill for skill, _ in all_skills.most_common() if skill not in user_input]
        
        # Return the result
        result = {
            "predicted_role": predicted_role,
            "message": f"🎯 Predicted Role: {predicted_role}",
            "suggested_skills": suggested_skills[:8]  # Top 8
        }
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "predicted_role": None,
            "message": f"❌ Error during prediction: {str(e)}",
            "suggested_skills": []
        }), 500

if __name__ == '__main__':
    print("🐍 Python prediction service running on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)