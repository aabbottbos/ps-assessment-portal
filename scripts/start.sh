#!/bin/bash

# PS Assessments Portal - Start Script
# Starts the development server and saves the PID

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
LOG_FILE="$PROJECT_DIR/.dev-server.log"

cd "$PROJECT_DIR"

# Check if already running
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p "$PID" > /dev/null 2>&1; then
    echo "❌ Server is already running (PID: $PID)"
    echo "   Use ./scripts/stop.sh to stop it first"
    exit 1
  else
    echo "⚠️  Stale PID file found, removing..."
    rm "$PID_FILE"
  fi
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "⚠️  Warning: .env.local not found"
  echo "   Copy .env.local.example and fill in your values:"
  echo "   cp .env.local.example .env.local"
  echo ""
fi

echo "🚀 Starting PS Assessments Portal..."
echo ""

# Start the server in the background
npm run dev > "$LOG_FILE" 2>&1 &
SERVER_PID=$!

# Save the PID
echo "$SERVER_PID" > "$PID_FILE"

# Wait a moment for the server to start
sleep 3

# Check if the server is still running
if ps -p "$SERVER_PID" > /dev/null 2>&1; then
  # Try to extract the port from the log file
  PORT=$(grep -oE "Local:.*http://localhost:[0-9]+" "$LOG_FILE" | grep -oE "[0-9]+$" | head -1)

  if [ -z "$PORT" ]; then
    PORT="3000"
  fi

  echo "✅ Server started successfully!"
  echo ""
  echo "   📍 URL: http://localhost:$PORT"
  echo "   🔢 PID: $SERVER_PID"
  echo "   📝 Logs: $LOG_FILE"
  echo ""
  echo "   Admin: http://localhost:$PORT/assessments/admin"
  echo ""
  echo "Commands:"
  echo "   ./scripts/stop.sh      - Stop the server"
  echo "   ./scripts/status.sh    - Check server status"
  echo "   ./scripts/logs.sh      - View live logs"
  echo "   ./scripts/restart.sh   - Restart the server"
else
  echo "❌ Failed to start server"
  echo ""
  echo "Check the logs for errors:"
  echo "   cat $LOG_FILE"
  rm "$PID_FILE"
  exit 1
fi
