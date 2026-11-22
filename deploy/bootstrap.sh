#!/bin/bash
# First-boot script, run once by the server's user-data. Starts the control
# service, then installs everything.
set -x
mkdir -p /opt/dvctl/logs /opt/dvimport
cat > /etc/systemd/system/dv-control.service <<'UNIT'
[Unit]
Description=Downunder Voices control service
After=network-online.target
[Service]
ExecStart=/usr/bin/python3 /opt/dv-repo/deploy/control.py
Restart=always
RestartSec=3
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now dv-control
apt-get install -y rsync
bash /opt/dv-repo/deploy/setup.sh >> /opt/dvctl/logs/setup.log 2>&1
