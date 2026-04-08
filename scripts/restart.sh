#!/bin/bash

# PS Assessments Portal - Restart Script
# Restart the development server

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"

cd "$PROJECT_DIR"

echo "🔄 Restarting PS Assessments Portal..."
echo ""

# Stop if running
if [ -f "$PID_FILE" ]; then
  echo "Stopping current server..."
  "$SCRIPT_DIR/stop.sh"
  echo ""
  sleep 1
fi

# Start the server
"$SCRIPT_DIR/start.sh"
