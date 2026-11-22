#!/bin/bash
# Same scheduled jobs that Vercel ran (times are UTC, as on Vercel).
set -euo pipefail
source /opt/dvctl/secrets.env
timedatectl set-timezone UTC
C="curl -s -m 290 -o /dev/null -H 'Authorization: Bearer $CRON_SECRET' http://127.0.0.1:3000"
cat > /etc/cron.d/downunder-voices <<CRON

SHELL=/bin/bash
0 * * * * root $C/api/cron/import-news
15 0,6,12,18 * * * root $C/api/cron/editorials
45 3,9,15,21 * * * root $C/api/cron/editorial-audit
15 1 * * * root $C/api/cron/cartoon
5 23,4,9,13 * * * root $C/api/cron/election-articles
50 * * * * root $C/api/cron/radio-news
20 * * * * root $C/api/cron/radio-programme
10 7,21 * * * root $C/api/cron/audaisuki-news
40 23,5,11 * * * root $C/api/cron/lankawitness-analysis
*/10 * * * * root $C/api/originals/sync
CRON
chmod 644 /etc/cron.d/downunder-voices
systemctl restart cron
echo "crons installed $(date)"
