#!/bin/bash

# PS Assessments Portal - Clean Script
# Remove logs, PID files, and build artifacts

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$PROJECT_DIR/.dev-server.pid"
LOG_FILE="$PROJECT_DIR/.dev-server.log"

cd "$PROJECT_DIR"

echo "🧹 Cleaning PS Assessments Portal..."
echo ""

# Stop server if running
if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if ps -p "$PID" > /dev/null 2>&1; then
    echo "⚠️  Server is running. Stopping first..."
    "$SCRIPT_DIR/stop.sh"
    echo ""
  fi
fi

# Remove PID file
if [ -f "$PID_FILE" ]; then
  echo "Removing PID file..."
  rm "$PID_FILE"
fi

# Remove log file
if [ -f "$LOG_FILE" ]; then
  echo "Removing log file..."
  rm "$LOG_FILE"
fi

# Remove Next.js build artifacts
if [ -d ".next" ]; then
  echo "Removing .next build directory..."
  rm -rf .next
fi

# Remove node_modules (optional, uncomment if needed)
# if [ -d "node_modules" ]; then
#   echo "Removing node_modules..."
#   rm -rf node_modules
# fi

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "To rebuild:"
echo "   npm install          - Reinstall dependencies"
echo "   npm run build        - Build for production"
echo "   ./scripts/start.sh   - Start dev server"
