from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List  # List add kiya hai yahan
import psycopg2
from psycopg2.extras import RealDictCursor, Json
import numpy as np
import pandas as pd  # ✅ DataFrames ke liye Pandas
from sklearn.linear_model import LinearRegression
import uuid
import joblib  # 👈 Model load karne ke liye
import os

app = FastAPI()

# 🎯 CRITICAL: CORS configuration allows React (localhost:5173) to securely send data
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 ML Model initialization (Loading your custom trained 15-feature model)
try:
    # ✅ FIX 1: Nayi 15-features wali PKL file load ho rahi hai
    ml_model = joblib.load("student_predictor_15_features.pkl")
    print("✅ Custom AI Model 'student_predictor_15_features.pkl' Loaded Successfully!")
except Exception as e:
    # Agar kabhi file path ka masla aaye to project crash nahi hoga
    print("❌ Error loading custom model. Using dummy fallback model for now. Error:", e)
    
    # ✅ FIX 2: Fallback model mein ab poori 15 values hain taake crash na ho
    X_train = np.array([
        [90, 3.8, 85, 6, 2, 8, 1, 0, 20, 0, 95, 80, 2, 3, 5], 
        [85, 3.5, 75, 5, 3, 7, 2, 5, 40, 0, 80, 70, 1, 2, 4], 
        [75, 3.0, 65, 4, 1, 6, 3, 10, 60, 1, 60, 50, 0, 1, 3], 
        [60, 2.5, 50, 2, 4, 5, 5, 15, 90, 2, 40, 30, 0, 0, 2], 
        [95, 3.9, 90, 7, 1, 8, 1, 0, 15, 0, 100, 90, 4, 5, 5]
    ])
    y_train = np.array([3.9, 3.6, 3.1, 2.2, 4.0])
    ml_model = LinearRegression()
    ml_model.fit(X_train, y_train)

def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    return psycopg2.connect(
        db_url,
        cursor_factory=RealDictCursor
    )
class AuthRequest(BaseModel):
    username: str
    password: str

# ✅ FIX 3: Naye 10 features API input mein add kar diye gaye hain
class AcademicDataInput(BaseModel):
    user_id: str
    attendance_percentage: float
    current_cgpa: float
    study_hours_daily: float
    extracurricular_hours_weekly: float
    subject_marks: Dict[str, int]
    sleep_hours_daily: float
    social_media_hours: float
    part_time_job_hours: float
    commute_time_mins: float
    past_backlogs: float
    assignment_completion_pct: float
    class_participation_score: float
    group_study_hours: float
    library_hours: float
    internet_access_quality: float


# 🤖 NAYA FUNCTION: Explainable AI logic with English sentences
def generate_ai_reason(data: AcademicDataInput, predicted_grade: str) -> List[str]:
    reasons = []
    
    # 1. Sleep Logic
    if data.sleep_hours_daily < 6:
        reasons.append("Your average sleep is too low, which is causing a drop in focus. Try to get at least 7 hours of sleep.")
        
    # 2. Social Media Logic
    if data.social_media_hours > 3:
        reasons.append("Excessive social media usage is consuming your valuable study time. Please control your screen time.")
        
    # 3. Class Participation Logic
    if data.class_participation_score < 50:
        reasons.append("Your class participation is very low. Ask more questions during lectures to clear your concepts.")
        
    # 4. Past Backlogs Logic
    if data.past_backlogs > 0:
        reasons.append("The pressure of past backlogs is negatively affecting your current performance. Focus on clearing them.")
        
    # 5. Study/Library Time
    if data.library_hours == 0 and data.group_study_hours == 0:
        reasons.append("You are not utilizing library resources or group study. Try studying with peers for difficult subjects.")

    # 6. Attendance Logic
    if data.attendance_percentage < 75:
        reasons.append("Your attendance is in the danger zone. Try not to miss any upcoming classes to improve your grade.")

    # Agar student ka data bohat acha ho aur koi issue na ho
    if not reasons:
        reasons.append("Excellent! Your academic and lifestyle routines are highly optimized. Keep up the great work!")
        
    return reasons


# --- USER AUTHENTICATION ENGINE ---

@app.post("/api/auth/signup")
async def signup(user: AuthRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        generated_uuid = str(uuid.uuid4())
        user_email = f"{user.username.lower().strip()}@uom.edu.pk"
        
        cur.execute(
            "INSERT INTO users (id, username, email, password_hash) VALUES (%s, %s, %s, %s) RETURNING id, username;",
            (generated_uuid, user.username.strip(), user_email, user.password)
        )
        new_user = cur.fetchone()
        conn.commit()
        
        return {
            "status": "success", 
            "id": str(new_user["id"]), 
            "user_id": str(new_user["id"]), 
            "username": new_user["username"]
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=400, detail=f"Database insertion failed: {str(e)}")
    finally:
        cur.close()
        conn.close()

@app.post("/api/auth/login")
async def login(user: AuthRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT id, username, password_hash FROM users WHERE LOWER(username) = LOWER(%s);", (user.username.strip(),))
        db_user = cur.fetchone()
        
        # ✅ PROPER LOGIN SYSTEM (No more fallback bypass)
        
        # 1. Agar user database mein nahi hai
        if not db_user:
            raise HTTPException(status_code=404, detail="Account nahi mila! Pehle register karein.")
            
        # 2. Agar password galat hai
        if db_user['password_hash'] != user.password:
            raise HTTPException(status_code=401, detail="Password galat hai. Dobara koshish karein.")
            
        # 3. Agar account bhi hai aur password bhi theek hai (Success)
        return {
            "status": "success", 
            "id": str(db_user['id']), 
            "user_id": str(db_user['id']), 
            "username": db_user['username']
        }
        
    except HTTPException:
        # Ye zaroori hai taake custom error messages frontend tak jayein
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Authentication exception: {str(e)}")
    finally:
        cur.close()
        conn.close()


# --- PREDICTION ENGINE ---

@app.post("/api/predict")
async def save_and_predict(data: AcademicDataInput):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        avg_marks = float(np.mean(list(data.subject_marks.values()))) if data.subject_marks else 0.0

        # ✅ FIX 4: Pandas DataFrame mein ab poore 15 features ja rahe hain
        features_df = pd.DataFrame([{
            'attendance_pct': data.attendance_percentage,
            'current_cgpa': data.current_cgpa,
            'current_semester_avg_marks': avg_marks,
            'daily_study_hours': data.study_hours_daily,
            'extracurricular_hours': data.extracurricular_hours_weekly,
            'sleep_hours_daily': data.sleep_hours_daily,
            'social_media_hours': data.social_media_hours,
            'part_time_job_hours': data.part_time_job_hours,
            'commute_time_mins': data.commute_time_mins,
            'past_backlogs': data.past_backlogs,
            'assignment_completion_pct': data.assignment_completion_pct,
            'class_participation_score': data.class_participation_score,
            'group_study_hours': data.group_study_hours,
            'library_hours': data.library_hours,
            'internet_access_quality': data.internet_access_quality
        }])
        
        raw_pred = float(ml_model.predict(features_df)[0])
        final_gpa = max(0.0, min(4.0, round(raw_pred, 2)))
        
        # Limit thodi set ki hai taake toppers ko easily A mil jaye
        if final_gpa >= 3.30: predicted_letter = "A"
        elif final_gpa >= 2.80: predicted_letter = "B"
        elif final_gpa >= 2.00: predicted_letter = "C"
        else: predicted_letter = "F"

        # ✅ FIX 5: Database (PostgreSQL) mein 15 columns ke andar data save ho raha hai
        cur.execute(
            """
            INSERT INTO student_academic_records 
            (user_id, attendance_percentage, current_cgpa, study_hours_daily, extracurricular_hours_weekly, 
             sleep_hours_daily, social_media_hours, part_time_job_hours, commute_time_mins, past_backlogs, 
             assignment_completion_pct, class_participation_score, group_study_hours, library_hours, 
             internet_access_quality, subject_marks, predicted_grade)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id;
            """,
            (data.user_id, data.attendance_percentage, data.current_cgpa, data.study_hours_daily, 
             data.extracurricular_hours_weekly, data.sleep_hours_daily, data.social_media_hours, 
             data.part_time_job_hours, data.commute_time_mins, data.past_backlogs, data.assignment_completion_pct, 
             data.class_participation_score, data.group_study_hours, data.library_hours, 
             data.internet_access_quality, Json(data.subject_marks), predicted_letter)
        )
        conn.commit()
        
        # 🤖 NAYA CODE: Sirf ek line mein AI Recommendations generate ho rahin hain
        recommendations = generate_ai_reason(data, predicted_letter)

        return {
            "status": "success", 
            "prediction": predicted_letter, 
            "score": final_gpa, 
            "recommendations": recommendations
        }
    except Exception as e:
        conn.rollback()
        print("Record saving crash trace:", str(e))
        raise HTTPException(status_code=500, detail=f"Academic insertion error: {str(e)}")
    finally:
        cur.close()
        conn.close()