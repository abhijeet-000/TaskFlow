# Task Management Application

## Project Structure
- `backend/`: Flask backend
- `frontend/`: HTML/JavaScript frontend

## Backend Setup

### Prerequisites
- Python 3.8+
- pip
- virtualenv

### Installation Steps
1. Navigate to backend directory
```bash
cd backend
```

2. Create virtual environment
```bash
python -m venv .venv
```

3. Activate virtual environment
- On Windows:
```bash
.venv\Scripts\activate
```
- On macOS/Linux:
```bash
source .venv/bin/activate
```

4. Install dependencies
```bash
pip install flask flask-cors
```

5. Run the application
```bash
python app.py
```

## Frontend Setup
1. Open `index.html` in a web browser

## Dependencies
- Backend: Flask, Flask-CORS
- Frontend: Vanilla JavaScript

## Notes
- Ensure backend is running before using frontend
- Default backend runs on `http://localhost:5000`

## Troubleshooting
- Verify Python version
- Check virtual environment activation
- Ensure all dependencies are installed
