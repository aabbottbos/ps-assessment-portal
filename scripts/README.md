# Development Scripts

Shell scripts for managing the PS Assessments Portal development server.

## Quick Start

```bash
# Start the dev server
./scripts/start.sh

# Check status
./scripts/status.sh

# View logs
./scripts/logs.sh

# Stop the server
./scripts/stop.sh
```

## Available Scripts

### `start.sh`

Starts the development server in the background.

**Features:**
- ✅ Checks if server is already running
- ✅ Warns if `.env.local` is missing
- ✅ Saves PID for clean shutdown
- ✅ Shows the server URL and port
- ✅ Logs output to `.dev-server.log`

**Usage:**
```bash
./scripts/start.sh
```

**Example Output:**
```
🚀 Starting PS Assessments Portal...

✅ Server started successfully!

   📍 URL: http://localhost:3000
   🔢 PID: 12345
   📝 Logs: /path/to/.dev-server.log

   Admin: http://localhost:3000/assessments/admin

Commands:
   ./scripts/stop.sh      - Stop the server
   ./scripts/status.sh    - Check server status
   ./scripts/logs.sh      - View live logs
   ./scripts/restart.sh   - Restart the server
```

---

### `stop.sh`

Stops the development server cleanly.

**Features:**
- ✅ Graceful shutdown (SIGTERM)
- ✅ Force kill if needed (SIGKILL after 10s)
- ✅ Cleans up PID file
- ✅ Verifies server stopped

**Usage:**
```bash
./scripts/stop.sh
```

**Example Output:**
```
🛑 Stopping PS Assessments Portal (PID: 12345)...
✅ Server stopped successfully
```

---

### `status.sh`

Check if the server is running and view details.

**Features:**
- ✅ Shows running status
- ✅ Displays PID and memory usage
- ✅ Shows server URL
- ✅ Detects recent errors

**Usage:**
```bash
./scripts/status.sh
```

**Example Output:**
```
📊 PS Assessments Portal - Status
==================================

Status: ✅ Running

Process:
   PID: 12345
   Memory: 145.3 MB

URLs:
   Local: http://localhost:3000
   Admin: http://localhost:3000/assessments/admin

Commands:
   ./scripts/stop.sh    - Stop the server
   ./scripts/logs.sh    - View live logs
   ./scripts/restart.sh - Restart the server
```

---

### `logs.sh`

View server logs in real-time or historical.

**Features:**
- ✅ Live tail if server is running
- ✅ Last 50 lines if stopped
- ✅ Easy error debugging

**Usage:**
```bash
./scripts/logs.sh
```

Press `Ctrl+C` to exit live logs.

---

### `restart.sh`

Restart the development server (stop + start).

**Usage:**
```bash
./scripts/restart.sh
```

**Example Output:**
```
🔄 Restarting PS Assessments Portal...

Stopping current server...
🛑 Stopping PS Assessments Portal (PID: 12345)...
✅ Server stopped successfully

🚀 Starting PS Assessments Portal...
✅ Server started successfully!
```

---

### `clean.sh`

Remove logs, PID files, and build artifacts.

**Features:**
- ✅ Stops server if running
- ✅ Removes `.dev-server.pid`
- ✅ Removes `.dev-server.log`
- ✅ Removes `.next/` directory

**Usage:**
```bash
./scripts/clean.sh
```

**Example Output:**
```
🧹 Cleaning PS Assessments Portal...

Removing PID file...
Removing log file...
Removing .next build directory...

✅ Cleanup complete!
```

---

## Files Created

The scripts create these files in the project root:

- `.dev-server.pid` - Process ID of the running server
- `.dev-server.log` - Server output logs

These files are automatically cleaned up when you stop the server or run `clean.sh`.

---

## Troubleshooting

### Server won't start (port in use)

The scripts automatically detect available ports. If you see:

```
⚠ Port 3000 is in use, trying 3001 instead.
```

This is normal. The server will use the next available port.

### Stale PID file

If the server crashed without cleaning up:

```
./scripts/stop.sh   # Will clean up stale PID
./scripts/start.sh  # Start fresh
```

Or use:

```
./scripts/clean.sh  # Remove all temp files
./scripts/start.sh
```

### Check for errors

```bash
./scripts/status.sh  # Check for error warnings
./scripts/logs.sh    # View full logs
```

---

## Workflow Examples

### Daily Development

```bash
# Morning
./scripts/start.sh

# Check it's running
./scripts/status.sh

# Evening
./scripts/stop.sh
```

### After Making Changes

```bash
# Restart to pick up changes
./scripts/restart.sh
```

### Debugging Issues

```bash
# View live logs
./scripts/logs.sh

# Clean restart
./scripts/stop.sh
./scripts/clean.sh
./scripts/start.sh
```

### Before Deploying

```bash
# Clean build
./scripts/stop.sh
./scripts/clean.sh
npm run build
```

---

## Platform Compatibility

These scripts are designed for **macOS and Linux** (bash).

For **Windows**, use:
- WSL (Windows Subsystem for Linux)
- Git Bash
- Or use npm scripts directly: `npm run dev`, `npm run build`

---

## Integration with package.json

You can add these to `package.json` scripts:

```json
{
  "scripts": {
    "start": "./scripts/start.sh",
    "stop": "./scripts/stop.sh",
    "restart": "./scripts/restart.sh",
    "status": "./scripts/status.sh",
    "logs": "./scripts/logs.sh",
    "clean": "./scripts/clean.sh"
  }
}
```

Then use: `npm run start`, `npm run stop`, etc.
