import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';
import { Award, BookOpen, Activity, BrainCircuit, Plus, Trash2, Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react';

function App() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Core Academic Metrics
  const [attendance, setAttendance] = useState(85);
  const [cgpa, setCgpa] = useState(3.2);
  const [studyHours, setStudyHours] = useState(5);
  
  // Other Activities States
  const [extracurricular, setExtracurricular] = useState(3);
  const [activityType, setActivityType] = useState("Sports");
  const [activitiesList, setActivitiesList] = useState([
    { type: 'Sports', detail: 'Cricket Practice' },
    { type: 'Hobby', detail: 'Coding Competitions' }
  ]);
  const [newActivityDetail, setNewActivityDetail] = useState("");
  
  // Subjects Matrix
  const [subjectsList, setSubjectsList] = useState([
    { name: 'OOP', marks: 85 },
    { name: 'Data Structures', marks: 58 },
    { name: 'Compiler', marks: 88 }
  ]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectMarks, setNewSubjectMarks] = useState("");
  
  // Prediction States
  const [predictionResult, setPredictionResult] = useState({
    prediction: "B+",
    score: 78.5,
    recommendations: ["Maintain steady workflow."]
  });
  const [weakestSubject, setWeakestSubject] = useState(null);

  // Mapping Chart Data Formats
  const chartData = subjectsList.map(sub => ({
    subject: sub.name,
    marks: parseInt(sub.marks) || 0,
    fullMark: 100
  }));

  const addCustomSubject = () => {
    if (!newSubjectName || !newSubjectMarks) return;
    setSubjectsList([...subjectsList, { name: newSubjectName, marks: parseInt(newSubjectMarks) }]);
    setNewSubjectName("");
    setNewSubjectMarks("");
  };

  const deleteSubject = (index) => {
    setSubjectsList(subjectsList.filter((_, i) => i !== index));
  };

  const addOtherActivity = () => {
    if (!newActivityDetail) return;
    setActivitiesList([...activitiesList, { type: activityType, detail: newActivityDetail }]);
    setNewActivityDetail("");
  };

  const deleteActivity = (index) => {
    setActivitiesList(activitiesList.filter((_, i) => i !== index));
  };

  // 🎯 REAL-TIME LIVE BALANCED AI MODEL SIMULATION (Frontend Engine)
  useEffect(() => {
    // 1. Calculate Average Marks
    const avgMarks = subjectsList.length > 0 
      ? subjectsList.reduce((acc, curr) => acc + parseInt(curr.marks || 0), 0) / subjectsList.length 
      : 60;

    // 2. Balanced Feature Weights (No single feature dominates)
    const weightCgpa = (parseFloat(cgpa) / 4.0) * 40;          // Max 40
    const weightAttendance = (parseFloat(attendance) / 100) * 20; // Max 20
    const weightStudy = (parseFloat(studyHours) / 16) * 20;       // Max 20
    const weightMarks = (avgMarks / 100) * 20;                  // Max 20

    let baseScore = weightCgpa + weightAttendance + weightStudy + weightMarks;

    // 3. Extracurricular Activity Factor integration
    const sportsHours = parseFloat(extracurricular);
    if (sportsHours > 12) {
      baseScore -= (sportsHours - 12) * 0.7; // Study imbalance penalty
    } else if (sportsHours >= 3 && sportsHours <= 8) {
      baseScore += 2.5; // Brain health bonus
    }

    const finalScore = Math.max(0, Math.min(100, baseScore));

    // 4. Map Score to Target Grade
    let grade = "D";
    if (finalScore >= 85) grade = "A";
    else if (finalScore >= 75) grade = "B+";
    else if (finalScore >= 65) grade = "B";
    else if (finalScore >= 55) grade = "C";

    // 5. Generate Dynamic Recommendations
   // 5. Generate Dynamic Recommendations
    const recs = [];
    if (parseInt(attendance) < 75) {
      recs.push(`Critical! Attendance is ${attendance}%. Raise it to avoid exam detention.`);
    } else {
      recs.push("Attendance matrix status is healthy.");
    }

    if (parseFloat(studyHours) < 4) recs.push("Daily study execution focus is low. Allocate minimum 2 hours more.");
    
    if (sportsHours > 12) recs.push("High extra-curricular density detected. Optimize time blocking for core subjects.");
    else if (sportsHours < 2) recs.push("Passive lifestyle. Add some sports or social activities to boost productivity.");

    setPredictionResult({
      prediction: grade,
      score: finalScore.toFixed(2),
      recommendations: recs
    });

    // 6. Weakest Subject Diagnostic Analysis
    if (subjectsList.length > 0) {
      const sorted = [...subjectsList].sort((a, b) => a.marks - b.marks);
      if (sorted[0].marks < 70) {
        setWeakestSubject(sorted[0]);
      } else {
        setWeakestSubject(null);
      }
    } else {
      setWeakestSubject(null);
    }
  }, [attendance, cgpa, studyHours, extracurricular, subjectsList]);

 const handleAuth = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const API_URL = import.meta.env.VITE_API_URL;
    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/signup";

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert(isLoginMode ? "Login Successful!" : "Signup Successful!");
        setUserId(data.user_id || "secured_dev_session");
      } else {
        alert(data.detail || "Authentication failed!");
      }
    } catch (error) {
      console.p("Error connecting to backend:", error);
      alert("Server error or connection failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-black tracking-wide text-white">EDU-COACH <span className="text-indigo-400">AI</span></h1>
        </div>
        {userId && <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 font-bold">Active Student Session: {username || "Saniah"}</span>}
      </header>

      {!userId ? (
        <div className="max-w-md mx-auto mt-16 bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">{isLoginMode ? "Student Portal Login" : "Register Student Credentials"}</h2>
          <p className="text-sm text-slate-400 mb-6">Access your relational data container securely using your unique account identifiers.</p>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Username Reference</label>
              <input type="text" required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Security Password</label>
              <input type="password" required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg cursor-pointer transition-all">
              {isLoginMode ? "Login Dashboard" : "Register Database Row"}
            </button>
          </form>
          <p className="text-xs text-center text-slate-400 mt-4 cursor-pointer hover:text-indigo-400" onClick={() => setIsLoginMode(!isLoginMode)}>
            {isLoginMode ? "Need a personal account? Register here" : "Already have parameters? Login here"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls & Other Activities Panel */}
          <div className="space-y-6">
            
            {/* Core Metrics Slider */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> Operational Metrics</h3>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Attendance Percentage</span><span className="text-indigo-400 font-bold">{attendance}%</span></div>
                <input type="range" min="0" max="100" className="w-full accent-indigo-500" value={attendance} onChange={(e) => setAttendance(e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Current CGPA Vector</span><span className="text-indigo-400 font-bold">{cgpa}</span></div>
                <input type="range" min="0" max="4.0" step="0.01" className="w-full accent-indigo-500" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Daily Self-Study Focus</span><span className="text-indigo-400 font-bold">{studyHours} hrs</span></div>
                <input type="range" min="1" max="16" step="0.5" className="w-full accent-indigo-500" value={studyHours} onChange={(e) => setStudyHours(e.target.value)} />
              </div>
            </div>

            {/* Extra-Curricular Folder Panel */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Extra-Curricular & Hobbies</h3>
              <div>
                <div className="flex justify-between text-xs mb-1"><span>Weekly Time Investment</span><span className="text-amber-400 font-bold">{extracurricular} hrs/week</span></div>
                <input type="range" min="0" max="30" className="w-full accent-amber-500" value={extracurricular} onChange={(e) => setExtracurricular(e.target.value)} />
              </div>

              {/* Activities Directory List */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/40 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Activity Logs</span>
                <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 text-xs">
                  {activitiesList.map((act, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-800 p-2 rounded border border-slate-700/50">
                      <span><b className="text-amber-400 font-semibold">[{act.type}]</b> {act.detail}</span>
                      <Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-500" onClick={() => deleteActivity(idx)} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Activity Controls */}
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <select className="col-span-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-slate-300" value={activityType} onChange={(e) => setActivityType(e.target.value)}>
                    <option value="Sports">Sports</option>
                    <option value="Hobby">Hobby</option>
                    <option value="Social">Social</option>
                  </select>
                  <input type="text" placeholder="e.g. Cricket" className="col-span-2 bg-slate-900 border border-slate-700 rounded p-1.5 text-white" value={newActivityDetail} onChange={(e) => setNewActivityDetail(e.target.value)} />
                </div>
                <button onClick={addOtherActivity} className="w-full flex items-center justify-center gap-1 bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/30 text-amber-400 font-semibold py-1.5 rounded transition">
                  <Plus className="w-3.5 h-3.5" /> Append Activity Log
                </button>
              </div>
            </div>

            {/* Course Modules Management */}
            <div className="bg-slate-800/80 border border-slate-700/60 p-5 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Dynamic Course Modules</h4>
              <div className="max-h-28 overflow-y-auto space-y-2 pr-1">
                {subjectsList.map((sub, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-800 text-xs">
                    <span>{sub.name} <b className="text-indigo-400 ml-2">{sub.marks} Marks</b></span>
                    <Trash2 className="w-3.5 h-3.5 text-red-400 cursor-pointer hover:text-red-500" onClick={() => deleteSubject(idx)} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Course Name" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white" value={newSubjectName} onChange={(e) => setNewSubjectName(e.target.value)} />
                <input type="number" placeholder="Marks" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white" value={newSubjectMarks} onChange={(e) => setNewSubjectMarks(e.target.value)} />
              </div>
              <button onClick={addCustomSubject} className="w-full flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-xs font-semibold py-2 rounded transition text-indigo-300">
                <Plus className="w-3.5 h-3.5" /> Append Course Row
              </button>
            </div>
          </div>

          {/* Analytics Canvas & Visualization Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* AI Predictions & Dynamic Weak Point Detector Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800 border border-indigo-500/20 p-5 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Predicted Target Grade</span>
                  <h2 className="text-5xl font-black text-white mt-1">{predictionResult.prediction}</h2>
                  <p className="text-[10px] text-slate-400 mt-1">Calculated ML Matrix Index: {predictionResult.score}%</p>
                </div>
                <Award className="w-14 h-14 text-indigo-400 opacity-60" />
              </div>

              {/* AI Subject Weakness Diagnostics Card */}
              <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex flex-col justify-center">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" /> AI Diagnostic Advisor
                </span>
                {weakestSubject ? (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-300">
                      System optimization alert triggered for <span className="text-white font-bold uppercase underline decoration-rose-500">{weakestSubject.name}</span>.
                    </p>
                    <p className="text-[11px] bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded p-2 font-medium mt-1">
                      ⚠️ Critical Marks: {weakestSubject.marks}/100. Student must allocate at least 1.5 hours of additional daily focus to re-balance this domain.
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded p-3">
                    <CheckCircle2 className="w-4 h-4" /> All course structures are balanced above performance thresholds (70%+). Maintain steady workflow!
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic AI Performance Advisor Logs */}
            <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider block mb-2">System Performance Recommendations:</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                {predictionResult.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>

            {/* DUAL CHART INTERFACE CANVAS */}
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700/60 space-y-8">
              
              {/* Chart 1: Simple Bar Chart (Histogram Style) */}
              <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-sky-400" /> Simple Subject Analysis (Bar Grid)</h4>
                <p className="text-xs text-slate-400 mb-3">Asaan and clear layout for primary evaluation and performance height metrics.</p>
                <div className="h-56">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                        <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#fff' }} />
                        <Bar dataKey="marks" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={40} name="Obtained Marks" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">No subject data to render.</div>
                  )}
                </div>
              </div>

              {/* Chart 2: Complex Radar Chart */}
              <div className="pt-6 border-t border-slate-700/50">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4 text-indigo-400" /> Advanced Balance Model (Radar Layout)</h4>
                <div className="h-56">
                  {chartData.length > 2 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" radius="80%" data={chartData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#334155" />
                        <Radar name="Student Matrix" dataKey="marks" stroke="#818cf8" fill="#818cf8" fillOpacity={0.35} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500">Append at least 3 dynamic courses to evaluate shape balance matrices on radar canvas.</div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;