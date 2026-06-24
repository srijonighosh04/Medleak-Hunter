# 🛡️ MedLeak AI

AI-Powered Healthcare Insider Threat Detection Platform

MedLeak AI is a cybersecurity platform designed to identify high-risk employee behavior and potential healthcare data leaks using machine learning and behavioral analytics.

Built using FastAPI, Scikit-Learn, and a modern Security Operations Center (SOC) dashboard, the platform analyzes employee activity patterns and generates real-time insider threat risk assessments.

---

## 🚀 Features

### Machine Learning Risk Detection
- Insider threat classification using Random Forest
- Risk scoring engine
- High-risk employee identification
- Confidence-based threat assessment

### User Behavior Analytics
- Login activity monitoring
- Device usage tracking
- Access pattern analysis
- Working hour anomaly detection

### File Access Intelligence
- File activity monitoring
- Document classification
- Sensitive file detection
- Healthcare record access analysis

### SOC Dashboard
- Real-time security overview
- Threat intelligence center
- Employee risk profiles
- Security alerts and monitoring

### Authentication & Access Control
- Secure login system
- Role-based access simulation
- Security clearance levels
- Session management

---

## 🏗️ Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6)
- Canvas API

### Backend
- FastAPI
- Python

### Machine Learning
- Scikit-Learn
- Random Forest Classifier
- Pandas
- NumPy
- Joblib

### Dataset
- CERT Insider Threat Dataset

---

## 📂 Project Structure

```bash
MedLeak-Hunter/
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
├── backend/
│   ├── main.py
│   ├── medleak_model.pkl
│   └── requirements.txt
│
├── notebooks/
│   └── medleak-ai.ipynb
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/srijonighosh04/Medleak-Hunter.git
cd Medleak-Hunter
```

### Backend Setup

```bash
cd backend

python -m pip install -r requirements.txt
```

Run API:

```bash
uvicorn main:app --reload
```

Backend available at:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

---

### Frontend Setup

Open:

```text
frontend/index.html
```

or serve locally:

```bash
python -m http.server 8080
```

---

## 🤖 API Endpoint

### Analyze User

```http
POST /analyze-user
```

Request:

```json
{
  "mean_hour": 13,
  "min_hour": 8,
  "max_hour": 18,
  "unique_pcs": 1,
  "event_count": 692,
  "device_events": 20,
  "device_unique_pcs": 1,
  "total_files": 200,
  "unique_files": 200,
  "doc": 100,
  "exe": 0,
  "jpg": 20,
  "pdf": 50,
  "txt": 20,
  "zip": 10,
  "sensitive_files": 2
}
```

Response:

```json
{
  "is_high_risk": false,
  "risk_score": 21,
  "risk_level": "Medium"
}
```

---

## 📈 Machine Learning Pipeline

1. Extract employee activity features
2. Generate behavioral indicators
3. Process device usage patterns
4. Analyze file access history
5. Run Random Forest prediction
6. Generate risk score and threat level

---

## 🔮 Future Improvements

- Real EHR integration
- Multi-factor authentication
- SIEM integration
- Explainable AI risk reasoning
- Live threat feeds
- Healthcare compliance monitoring
- Role-based access control (RBAC)

---

## 👩‍💻 Author

**Srijoni Ghosh**

Cybersecurity Undergraduate | AI Security Enthusiast | Blockchain Developer

GitHub:
https://github.com/srijonighosh04

---

## 📜 License

MIT License
