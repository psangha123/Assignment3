@echo off
echo ==========================================
echo Starting LLM Wiki Harness...
echo ==========================================

echo 1. Starting Backend API Server...
start "Backend Server" cmd /k "cd tools\server && npm start"

echo 2. Starting Frontend Viewer...
start "Frontend Viewer" cmd /k "cd viewer && npm run dev"

echo 3. Starting Watcher Script...
start "LLM Agent Watcher" cmd /k "python watcher.py"

echo.
echo All services have been launched in separate windows!
echo Please open http://localhost:5173 in your browser.
echo.
pause
