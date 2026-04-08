# Scripts Quick Reference

Quick command reference for managing the PS Assessments Portal.

## 🚀 Basic Commands

```bash
./scripts/start.sh      # Start development server
./scripts/stop.sh       # Stop development server
./scripts/restart.sh    # Restart server
./scripts/status.sh     # Check if server is running
./scripts/logs.sh       # View server logs (live tail)
./scripts/clean.sh      # Clean up logs and build files
```

## 📋 Common Workflows

### Daily Development

```bash
# Morning - Start server
./scripts/start.sh

# During day - Check status
./scripts/status.sh

# Evening - Stop server
./scripts/stop.sh
```

### After Code Changes

```bash
# Quick restart
./scripts/restart.sh

# Or full clean restart
./scripts/stop.sh
./scripts/clean.sh
./scripts/start.sh
```

### Debugging

```bash
# View live logs
./scripts/logs.sh

# Check for errors
./scripts/status.sh
```

### Before Deployment

```bash
# Clean build test
./scripts/stop.sh
./scripts/clean.sh
npm run build
```

## 📁 Files Created

| File | Purpose |
|------|---------|
| `.dev-server.pid` | Process ID of running server |
| `.dev-server.log` | Server output logs |

These files are in `.gitignore` and cleaned up automatically.

## 🔧 Troubleshooting

**Server won't start?**
```bash
./scripts/clean.sh
./scripts/start.sh
```

**Port already in use?**
- Script auto-detects next available port
- Check output: `./scripts/status.sh`

**Check for errors?**
```bash
./scripts/logs.sh
```

## 📖 Full Documentation

See [scripts/README.md](./scripts/README.md) for complete documentation.

---

**Tip:** Add to your shell aliases:

```bash
alias ps-start="./scripts/start.sh"
alias ps-stop="./scripts/stop.sh"
alias ps-status="./scripts/status.sh"
alias ps-logs="./scripts/logs.sh"
```
