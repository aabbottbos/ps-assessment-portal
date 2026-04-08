#!/bin/bash

# PS Assessments Portal - Status Script
# Check if the development server is running

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
LOG_FILE="$PROJECT_DIR/.dev-server.log"

cd "$PROJECT_DIR"

echo "📊 PS Assessments Portal - Status"
echo "=================================="
echo ""

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
  echo "Status: ❌ Not running"
  exit 1
fi

PID=$(cat "$PID_FILE")

# Check if process is actually running
if ! ps -p "$PID" > /dev/null 2>&1; then
  echo "Status: ❌ Not running (stale PID file)"
  echo ""
  echo "Cleaning up..."
  rm "$PID_FILE"
  exit 1
fi

# Server is running, get details
echo "Status: ✅ Running"
echo ""
echo "Process:"
echo "   PID: $PID"

# Try to get memory usage
if command -v ps &> /dev/null; then
  MEM=$(ps -o rss= -p "$PID" 2>/dev/null | awk '{printf "%.1f MB", $1/1024}')
  if [ ! -z "$MEM" ]; then
    echo "   Memory: $MEM"
  fi
fi

# Try to extract the port from the log file
if [ -f "$LOG_FILE" ]; then
  PORT=$(grep -oE "Local:.*http://localhost:[0-9]+" "$LOG_FILE" | grep -oE "[0-9]+$" | head -1)
  if [ ! -z "$PORT" ]; then
    echo ""
    echo "URLs:"
    echo "   Local: http://localhost:$PORT"
    echo "   Admin: http://localhost:$PORT/assessments/admin"
  fi

  # Check for recent errors in logs
  if grep -q "Error" "$LOG_FILE" 2>/dev/null; then
    echo ""
    echo "⚠️  Recent errors detected in logs"
    echo "   Run: ./scripts/logs.sh"
  fi
fi

echo ""
echo "Commands:"
echo "   ./scripts/stop.sh    - Stop the server"
echo "   ./scripts/logs.sh    - View live logs"
echo "   ./scripts/restart.sh - Restart the server"
