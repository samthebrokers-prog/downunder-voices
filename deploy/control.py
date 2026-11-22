#!/usr/bin/env python3
"""Downunder Voices server control service (port 8088).

Every path must contain the server's private nonce (/opt/dvctl/nonce), set at
server creation. It only accepts data uploads and runs scripts that live in
this public GitHub repo (deploy/*.sh), so no passwords are ever needed.

  POST /up/<nonce>/<name>     save request body to /opt/dvimport/<name>
  GET  /run/<nonce>/<script>  git pull, then run deploy/<script>.sh in background
  GET  /log/<nonce>/<script>  last 200 lines of that script's log
  GET  /status/<nonce>        quick health summary
"""
import http.server, os, re, subprocess, socketserver, shutil

NONCE = open('/opt/dvctl/nonce').read().strip()
REPO = '/opt/dv-repo'
IMPORT_DIR = '/opt/dvimport'
LOG_DIR = '/opt/dvctl/logs'
os.makedirs(IMPORT_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)
SAFE = re.compile(r'^[A-Za-z0-9_.-]{1,80}$')


def tail(path, n=200):
    try:
        with open(path, 'rb') as f:
            return b''.join(f.readlines()[-n:]).decode('utf-8', 'replace')
    except FileNotFoundError:
        return '(no log yet)'


def sh(cmd):
    try:
        return subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=20).stdout
    except Exception as e:  # noqa
        return str(e)


class H(http.server.BaseHTTPRequestHandler):
    def _send(self, code, text):
        body = text.encode()
        self.send_response(code)
        self.send_header('Content-Type', 'text/plain; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def _parts(self):
        p = self.path.split('?')[0].strip('/').split('/')
        if len(p) < 2 or p[1] != NONCE:
            return None
        return p

    def do_POST(self):
        p = self._parts()
        if not p or p[0] != 'up' or len(p) != 3 or not SAFE.match(p[2]):
            return self._send(404, 'not found')
        length = int(self.headers.get('Content-Length', 0))
        tmp = os.path.join(IMPORT_DIR, p[2] + '.part')
        with open(tmp, 'wb') as f:
            remaining = length
            while remaining > 0:
                chunk = self.rfile.read(min(remaining, 1 << 20))
                if not chunk:
                    break
                f.write(chunk)
                remaining -= len(chunk)
        os.replace(tmp, os.path.join(IMPORT_DIR, p[2]))
        self._send(200, 'saved %d bytes' % length)

    def do_GET(self):
        p = self._parts()
        if not p:
            return self._send(404, 'not found')
        if p[0] == 'status':
            files = sorted(os.listdir(IMPORT_DIR))
            text = 'uptime: ' + sh('uptime') + sh('free -m') + sh('df -h /') + \
                '\nimport files: %d\n' % len(files) + '\n'.join(files[-15:]) + \
                '\n\nservices:\n' + sh('systemctl is-active postgresql postgrest dv-web caddy 2>&1') + \
                '\nlogs:\n' + '\n'.join(sorted(os.listdir(LOG_DIR)))
            return self._send(200, text)
        if p[0] == 'log' and len(p) == 3 and SAFE.match(p[2]):
            return self._send(200, tail(os.path.join(LOG_DIR, p[2] + '.log')))
        if p[0] == 'run' and len(p) == 3 and SAFE.match(p[2]):
            script = os.path.join(REPO, 'deploy', p[2] + '.sh')
            log = os.path.join(LOG_DIR, p[2] + '.log')
            cmd = ('cd %s && git fetch -q --depth 1 origin main && git reset -q --hard origin/main; '
                   'test -f %s && bash %s' % (REPO, script, script))
            subprocess.Popen(['bash', '-c', '(%s) >> %s 2>&1' % (cmd, log)], start_new_session=True)
            return self._send(200, 'started %s\n' % p[2])
        return self._send(404, 'not found')

    def log_message(self, *a):
        pass


class S(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


S(('0.0.0.0', 8088), H).serve_forever()
