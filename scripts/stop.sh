#!/bin/bash

# PS Assessments Portal - Stop Script
# Stops the development server cleanly

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"

cd "$PROJECT_DIR"

# Check if PID file exists
if [ ! -f "$PID_FILE" ]; then
  echo "❌ Server is not running (no PID file found)"
  exit 1
fi

PID=$(cat "$PID_FILE")

# Check if process is actually running
if ! ps -p "$PID" > /dev/null 2>&1; then
  echo "❌ Server is not running (PID $PID not found)"
  echo "   Cleaning up stale PID file..."
  rm "$PID_FILE"
  exit 1
fi

echo "🛑 Stopping PS Assessments Portal (PID: $PID)..."

# Try graceful shutdown first (SIGTERM)
kill "$PID" 2>/dev/null || true

# Wait up to 10 seconds for graceful shutdown
for i in {1..10}; do
  if ! ps -p "$PID" > /dev/null 2>&1; then
    echo "✅ Server stopped successfully"
    rm "$PID_FILE"
    exit 0
  fi
  sleep 1
done

# If still running, force kill (SIGKILL)
echo "⚠️  Server didn't stop gracefully, forcing shutdown..."
kill -9 "$PID" 2>/dev/null || true

# Wait a moment
sleep 1

# Check if it's really dead
if ps -p "$PID" > /dev/null 2>&1; then
  echo "❌ Failed to stop server"
  exit 1
else
  echo "✅ Server stopped (forced)"
  rm "$PID_FILE"
  exit 0
fi
