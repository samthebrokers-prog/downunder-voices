#!/bin/bash
set -euo pipefail
echo "=== load started $(date)"
sudo -u postgres python3 /opt/dv-repo/deploy/load.py
systemctl restart postgrest
echo "=== load finished $(date)"
