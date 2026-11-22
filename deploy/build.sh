#!/bin/bash
# Builds the latest Downunder Voices code and (re)starts the website.
set -euo pipefail
echo "=== build started $(date)"
source /opt/dvctl/secrets.env
mkdir -p /opt/dv-app
rsync -a --delete --exclude .git --exclude node_modules --exclude .next --exclude .env.production /opt/dv-repo/ /opt/dv-app/
cat > /opt/dv-app/.env.production <<ENV
SUPABASE_URL=http://127.0.0.1:8080
SUPABASE_SERVICE_ROLE_KEY=$SERVICE_KEY
CRON_SECRET=$CRON_SECRET
ADMIN_PASSWORD=$ADMIN_PASSWORD
NEXT_PUBLIC_SITE_URL=https://www.downundervoices.com
DV_AI_ENABLED=false
ENV
chmod 600 /opt/dv-app/.env.production
cd /opt/dv-app
npm ci --no-audit --no-fund
NODE_OPTIONS=--max-old-space-size=1536 npm run build

cat > /etc/systemd/system/dv-web.service <<'UNIT'
[Unit]
Description=Downunder Voices website
After=network.target postgrest.service
[Service]
WorkingDirectory=/opt/dv-app
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/npm start -- -p 3000 -H 127.0.0.1
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable dv-web
systemctl restart dv-web
sleep 8
curl -s -o /dev/null -w "homepage HTTP %{http_code}\n" http://127.0.0.1:3000/ || true
echo "=== build finished $(date)"
