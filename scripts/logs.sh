#!/bin/bash

# PS Assessments Portal - Logs Script
# View development server logs

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
LOG_FILE="$PROJECT_DIR/.dev-server.log"

cd "$PROJECT_DIR"

# Check if log file exists
if [ ! -f "$LOG_FILE" ]; then
  echo "❌ No log file found"
  echo "   The server may not have been started yet"
  echo "   Run: ./scripts/start.sh"
  exit 1
fi

# Check if server is running
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p "$PID" > /dev/null 2>&1; then
    echo "📝 Viewing live logs (Ctrl+C to exit)..."
    echo "========================================"
    echo ""
    tail -f "$LOG_FILE"
  else
    echo "📝 Viewing logs (server not running)..."
    echo "========================================"
    echo ""
    tail -n 50 "$LOG_FILE"
  fi
else
  echo "📝 Viewing logs (server not running)..."
  echo "========================================"
  echo ""
  tail -n 50 "$LOG_FILE"
fi
