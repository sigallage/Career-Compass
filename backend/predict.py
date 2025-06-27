import joblib
import pandas as pd
import json
import sys
from collections import Counter

# Load trained model, encoder, and dataset (exported from Colab)
model = joblib.load('role_model.pkl')
mlb = joblib.load('mlb_encoder.pkl')
df = pd.read_pickle('skills_dataset.pkl')

# Step 1: Read skills from stdin (sent by Node.js backend)
try:
    user_input = json.loads(sys.stdin.read())
except json.JSONDecodeError:
    print(json.dumps({
        "predicted_role": None,
        "message": "❌ Invalid input format.",
        "suggested_skills": []
    }))
    sys.exit(1)

# Step 2: Clean and filter input
user_input = [skill.strip().lower() for skill in user_input if isinstance(skill, str)]
known_skills = set(mlb.classes_)
filtered_input = [skill for skill in user_input if skill in known_skills]

# Step 3: Check if any skills are valid
if not filtered_input:
    print(json.dumps({
        "predicted_role": None,
        "message": "❌ None of the input skills matched known skills in the model.",
        "suggested_skills": []
    }))
    sys.exit(0)

# Step 4: Transform input and predict role
try:
    input_vector = mlb.transform([filtered_input])
    predicted_role = model.predict(input_vector)[0]
except Exception as e:
    print(json.dumps({
        "predicted_role": None,
        "message": f"❌ Error during prediction: {str(e)}",
        "suggested_skills": []
    }))
    sys.exit(1)

# Step 5: Suggest missing skills for the predicted role
skills_for_role = df[df['Role'] == predicted_role]['Skills']
all_skills = Counter([skill for skill_list in skills_for_role for skill in skill_list])
suggested_skills = [skill for skill, _ in all_skills.most_common() if skill not in user_input]

# Step 6: Return the result as JSON
result = {
    "predicted_role": predicted_role,
    "message": f"🎯 Predicted Role: {predicted_role}",
    "suggested_skills": suggested_skills[:8]  # Top 8
}

print(json.dumps(result))
