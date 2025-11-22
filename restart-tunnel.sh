#!/bin/bash
# Medicaid CE MVP - Tunnel Restart Script
# Run this script whenever you need to restart the tunnel after sleep/disconnect

set -e

echo "🔄 Restarting Medicaid CE MVP Tunnel..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

# Check containers
echo "📦 Checking Docker containers..."
cd "$(dirname "$0")"

# Get container status
BACKEND_STATUS=$(docker-compose ps backend --format json 2>/dev/null | grep -o '"State":"[^"]*"' | cut -d'"' -f4 || echo "not_running")
FRONTEND_STATUS=$(docker-compose ps frontend --format json 2>/dev/null | grep -o '"State":"[^"]*"' | cut -d'"' -f4 || echo "not_running")

if [ "$BACKEND_STATUS" != "running" ] || [ "$FRONTEND_STATUS" != "running" ]; then
    echo "⚠️  Containers are not running. Starting them..."
    docker-compose up -d
    echo "⏳ Waiting for containers to be ready..."
    sleep 10
else
    echo "✅ Containers are already running"
fi

# Verify app is responding
echo ""
echo "🔍 Testing application..."
if curl -s -o /dev/null -w "" --max-time 5 http://localhost:5173 && \
   curl -s -o /dev/null -w "" --max-time 5 http://localhost:4000/health; then
    echo "✅ Application is responding"
else
    echo "⚠️  Application not responding, restarting containers..."
    docker-compose restart
    sleep 10
fi

# Kill any existing cloudflared processes
echo ""
echo "🔪 Stopping any existing tunnels..."
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 2

# Start new tunnel
echo ""
echo "🚀 Starting new Cloudflare tunnel..."
cloudflared tunnel --url http://localhost:5173 --no-autoupdate > /tmp/cloudflared.log 2>&1 &
TUNNEL_PID=$!

# Wait for tunnel to start and get URL
echo "⏳ Waiting for tunnel to initialize..."
sleep 5

# Extract the URL from logs
TUNNEL_URL=$(grep -o 'https://[^[:space:]]*\.trycloudflare\.com' /tmp/cloudflared.log | head -1)

if [ -n "$TUNNEL_URL" ]; then
    echo ""
    echo "✅ Tunnel started successfully!"
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "   🌐 Your app is now accessible at:"
    echo ""
    echo "   $TUNNEL_URL"
    echo ""
    echo "   Admin Portal: $TUNNEL_URL/admin"
    echo "   Member Portal: $TUNNEL_URL/m"
    echo ""
    echo "   Tunnel PID: $TUNNEL_PID"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    echo "💡 To stop the tunnel: kill $TUNNEL_PID"
    echo "💡 To view tunnel logs: tail -f /tmp/cloudflared.log"
    echo ""
else
    echo "❌ Failed to start tunnel. Check logs: tail -f /tmp/cloudflared.log"
    exit 1
fi
