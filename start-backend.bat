@echo off
echo 🚀 Starting CuraGenie Backend...
cd /d "%~dp0backend"
set "BACKEND_PYTHON="

if exist venv\Scripts\python.exe (
	set "BACKEND_PYTHON=venv\Scripts\python.exe"
	echo ✅ Using backend virtual environment interpreter: %BACKEND_PYTHON%
) else (
	echo ⚠️ Virtual environment not found at backend\venv.
	py -3.13 -c "import sys" >nul 2>nul
	if not errorlevel 1 (
		set "BACKEND_PYTHON=py -3.13"
		echo ✅ Using Python 3.13 from launcher - recommended for TensorFlow.
	) else (
		py -3.12 -c "import sys" >nul 2>nul
		if not errorlevel 1 (
			set "BACKEND_PYTHON=py -3.12"
			echo ⚠️ Using Python 3.12 from launcher.
		) else (
			set "BACKEND_PYTHON=py"
			echo ⚠️ Falling back to default Python launcher.
		)
	)
)

echo 🔄 Starting FastAPI server on http://localhost:8000

%BACKEND_PYTHON% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

if errorlevel 1 (
	echo ❌ Backend failed to start. Ensure uvicorn is installed in the active environment.
	echo    Suggested fix: %BACKEND_PYTHON% -m pip install -r requirements.txt
)
pause
