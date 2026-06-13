#!/bin/bash

echo "=========================================="
echo "Starting LLM Wiki Harness..."
echo "=========================================="

echo "1. Starting Backend API Server..."
(cd tools/server && npm start) &
BACKEND_PID=$!

echo "2. Starting Frontend Viewer..."
(cd viewer && npm run dev) &
FRONTEND_PID=$!

echo "3. Starting Watcher Script..."
python3 watcher.py &
WATCHER_PID=$!

echo ""
echo "All services started in the background!"
echo "Please open http://localhost:5173 in your browser."
echo "Press Ctrl+C to stop all services."

# Wait for user to press Ctrl+C
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID $WATCHER_PID; exit" INT
wait
