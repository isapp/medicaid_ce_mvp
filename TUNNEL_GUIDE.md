# Medicaid CE MVP - Tunnel Management Guide

## Quick Reference

### Current Tunnel
**URL:** https://tutorials-traffic-trackbacks-beaches.trycloudflare.com
- **Note:** This URL changes each time you restart the tunnel

### Demo Credentials
- **Admin Portal (`/admin`):**
  - Admin: `admin@demo.com` / `Admin123!`
  - Case Worker: `worker@demo.com` / `Worker123!`

- **Member Portal (`/m`):**
  - Phone: `555-555-0101`, `555-555-0102`, `555-555-0103`
  - Code: `123456`

---

## 🚀 After Computer Sleep or Restart

When your Mac wakes up from sleep, the tunnel disconnects. Simply run:

```bash
cd /Users/jayson/medicaid_ce_mvp
./restart-tunnel.sh
```

This script will:
1. ✅ Check if Docker containers are running
2. ✅ Restart them if needed
3. ✅ Kill old tunnel connections
4. ✅ Start a fresh tunnel
5. ✅ Display the new public URL

---

## 🔧 Common Commands

### Check Status
```bash
# Check if containers are running
docker-compose ps

# Check app accessibility
curl http://localhost:5173      # Frontend
curl http://localhost:4000/health  # Backend
```

### Manual Container Management
```bash
# Start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# Restart specific container
docker-compose restart frontend
docker-compose restart backend

# View logs
docker-compose logs -f          # All logs
docker-compose logs -f frontend # Frontend only
docker-compose logs -f backend  # Backend only
```

### Manual Tunnel Management
```bash
# Kill existing tunnel
pkill -f "cloudflared tunnel"

# Start new tunnel (manual)
cloudflared tunnel --url http://localhost:5173 --no-autoupdate

# View tunnel logs
tail -f /tmp/cloudflared.log
```

---

## 💡 Preventing Sleep Issues

### Option 1: Keep Mac Awake (Recommended for Demo Days)
```bash
# Run this in a terminal - keeps Mac awake
caffeinate -d
```

Press `Ctrl+C` to stop preventing sleep.

### Option 2: System Settings
1. Go to **System Settings > Battery > Options**
2. Enable "Prevent automatic sleeping when display is off"

---

## 🐛 Troubleshooting

### Problem: Tunnel won't start
**Solution:**
```bash
# Kill all cloudflared processes
pkill -9 -f cloudflared
# Wait a moment
sleep 2
# Restart tunnel
./restart-tunnel.sh
```

### Problem: Containers show as "unhealthy"
**Solution:** This is usually a false alarm. Check if the app actually works:
```bash
curl http://localhost:5173
curl http://localhost:4000/health
```

If both return HTTP 200, the app is fine. The "unhealthy" status is just a Docker health check timing issue.

### Problem: Frontend returns 404
**Solution:** Restart frontend container:
```bash
docker-compose restart frontend
```

### Problem: Database connection errors
**Solution:** Restart all containers:
```bash
docker-compose down
docker-compose up -d
```

---

## 🌐 Tunnel Alternatives

### Free Cloudflare Tunnel (Current - Temporary URLs)
- ✅ Free, no account needed
- ❌ URL changes on restart
- ❌ Drops on computer sleep
- ❌ No uptime guarantee

### ngrok (Recommended for Stability)
```bash
# 1. Sign up at ngrok.com and get auth token
# 2. Set up auth token:
ngrok config add-authtoken YOUR_TOKEN_HERE

# 3. Start tunnel with custom subdomain (requires paid plan):
ngrok http 5173 --domain=medicaid-ce.ngrok.io

# OR use free random subdomain:
ngrok http 5173
```

### Cloudflare Named Tunnel (Best for Production)
```bash
# Requires Cloudflare account
# 1. Login
cloudflared tunnel login

# 2. Create named tunnel
cloudflared tunnel create medicaid-ce

# 3. Configure and run
cloudflared tunnel --name medicaid-ce --url http://localhost:5173
```

---

## 📊 Monitoring

### Watch Logs in Real-Time
```bash
# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Tunnel logs
tail -f /tmp/cloudflared.log
```

### Check Container Health
```bash
# Full status
docker-compose ps

# Health check details
docker inspect medicaid_ce_mvp-frontend-1 | grep -A 10 Health
```

---

## 🔄 Daily Workflow

1. **Morning / After Sleep:**
   ```bash
   cd /Users/jayson/medicaid_ce_mvp
   ./restart-tunnel.sh
   ```

2. **Share the URL** displayed by the script

3. **End of Day:**
   ```bash
   # Optional - stop containers to free resources
   docker-compose down

   # Kill tunnel
   pkill -f cloudflared
   ```

---

## 📝 Notes

- **Backup tag created:** `v1.0.0-backup-20251121-222151`
- **Rollback if needed:** `git checkout v1.0.0-backup-20251121-222151`
- **Local access:** Always available at http://localhost:5173
- **Tunnel stability:** Free Cloudflare tunnels are meant for testing, not production

---

**Last Updated:** November 22, 2025
