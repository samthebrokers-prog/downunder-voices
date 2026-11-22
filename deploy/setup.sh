#!/bin/bash
# Installs everything Downunder Voices needs on its own BinaryLane server.
# Safe to run again. Secrets are generated here and never leave the server.
set -euxo pipefail
export DEBIAN_FRONTEND=noninteractive
echo "=== setup started $(date)"

# 2 GB swap so the Next.js build never runs out of memory
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

apt-get update
apt-get install -y postgresql postgresql-contrib python3-psycopg2 curl ca-certificates xz-utils caddy cron
if ! command -v node >/dev/null || ! node -v | grep -q '^v20'; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# PostgREST gives the site the same /rest/v1 API it used with Supabase
if [ ! -x /usr/local/bin/postgrest ]; then
  curl -fsSL https://github.com/PostgREST/postgrest/releases/download/v12.2.3/postgrest-v12.2.3-linux-static-x64.tar.xz | tar xJ -C /usr/local/bin
fi

SECRETS=/opt/dvctl/secrets.env
if [ ! -f $SECRETS ]; then
  b64url() { openssl base64 -A | tr '+/' '-_' | tr -d '='; }
  JWT_SECRET=$(openssl rand -hex 32)
  H=$(printf '{"alg":"HS256","typ":"JWT"}' | b64url)
  P=$(printf '{"role":"service_role","iss":"dv"}' | b64url)
  SIG=$(printf '%s.%s' "$H" "$P" | openssl dgst -sha256 -hmac "$JWT_SECRET" -binary | b64url)
  cat > $SECRETS <<EOF
JWT_SECRET=$JWT_SECRET
SERVICE_KEY=$H.$P.$SIG
AUTH_DB_PASSWORD=$(openssl rand -hex 24)
CRON_SECRET=$(openssl rand -hex 24)
ADMIN_PASSWORD=$(openssl rand -hex 12)
EOF
  chmod 600 $SECRETS
fi
source $SECRETS

# Database and roles (same role names Supabase used)
sudo -u postgres psql -v ON_ERROR_STOP=1 <<EOF
SELECT 'create database dv' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname='dv')\gexec
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role NOLOGIN BYPASSRLS; END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='authenticator') THEN CREATE ROLE authenticator LOGIN NOINHERIT; END IF;
END \$\$;
ALTER ROLE authenticator PASSWORD '$AUTH_DB_PASSWORD';
GRANT anon, service_role TO authenticator;
EOF
sudo -u postgres psql -d dv -v ON_ERROR_STOP=1 <<'EOF'
CREATE EXTENSION IF NOT EXISTS pgcrypto;
GRANT USAGE ON SCHEMA public TO anon, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;
EOF

cat > /etc/postgrest.conf <<EOF
db-uri = "postgres://authenticator:$AUTH_DB_PASSWORD@127.0.0.1:5432/dv"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$JWT_SECRET"
server-host = "127.0.0.1"
server-port = 3001
db-pool = 10
EOF
chmod 600 /etc/postgrest.conf
cat > /etc/systemd/system/postgrest.service <<'EOF'
[Unit]
Description=PostgREST
After=postgresql.service
[Service]
ExecStart=/usr/local/bin/postgrest /etc/postgrest.conf
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now postgrest
systemctl restart postgrest

cp /opt/dv-repo/deploy/Caddyfile /etc/caddy/Caddyfile
systemctl enable caddy
systemctl reload caddy || systemctl restart caddy
echo "=== setup finished $(date)"
