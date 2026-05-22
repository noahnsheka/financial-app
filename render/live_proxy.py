import http.client
import json
import os
import socket
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


LISTEN_PORT = int(os.environ.get('PORT', '10000'))
BACKEND_PORT = 8001
FRONTEND_PORT = 8088
BACKEND_PREFIXES = ('/api', '/admin')
HEALTH_PATHS = {'/api/health', '/api/health/'}
REQUEST_HEADER_EXCLUSIONS = {'connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade'}
RESPONSE_HEADER_EXCLUSIONS = REQUEST_HEADER_EXCLUSIONS | {'content-length', 'server', 'date', 'host'}


class LiveProxyHandler(BaseHTTPRequestHandler):
    protocol_version = 'HTTP/1.1'

    def do_GET(self):
        self.forward_request()

    def do_POST(self):
        self.forward_request()

    def do_PATCH(self):
        self.forward_request()

    def do_PUT(self):
        self.forward_request()

    def do_DELETE(self):
        self.forward_request()

    def do_OPTIONS(self):
        self.forward_request()

    def do_HEAD(self):
        self.forward_request()

    def is_backend_request(self) -> bool:
        return any(self.path == prefix or self.path.startswith(prefix + '/') for prefix in BACKEND_PREFIXES)

    def probe_upstream(self, port: int) -> bool:
        try:
            with socket.create_connection(('127.0.0.1', port), timeout=2):
                return True
        except OSError:
            return False

    def handle_health_request(self) -> None:
        backend_reachable = self.probe_upstream(BACKEND_PORT)
        frontend_reachable = self.probe_upstream(FRONTEND_PORT)
        status_code = 200 if backend_reachable and frontend_reachable else 503
        payload = {
            'status': 'ok' if status_code == 200 else 'degraded',
            'service': 'ledgerlift-live-proxy',
            'backend': 'reachable' if backend_reachable else 'unreachable',
            'frontend': 'reachable' if frontend_reachable else 'unreachable',
        }
        response_body = json.dumps(payload).encode('utf-8')

        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response_body)))
        self.end_headers()

        if self.command != 'HEAD':
            self.wfile.write(response_body)

    def build_upstream_headers(self) -> dict:
        forwarded_for = self.client_address[0]
        existing_forwarded_for = self.headers.get('X-Forwarded-For', '').strip()
        if existing_forwarded_for:
            forwarded_for = f'{existing_forwarded_for}, {forwarded_for}'

        headers = {}
        for key, value in self.headers.items():
            if key.lower() in REQUEST_HEADER_EXCLUSIONS:
                continue
            headers[key] = value

        headers['Host'] = self.headers.get('Host', '')
        headers['X-Forwarded-For'] = forwarded_for
        headers['X-Forwarded-Host'] = self.headers.get('Host', '')
        headers['X-Forwarded-Proto'] = self.headers.get('X-Forwarded-Proto', 'https')
        return headers

    def forward_request(self) -> None:
        if self.path in HEALTH_PATHS:
            self.handle_health_request()
            return

        upstream_port = BACKEND_PORT if self.is_backend_request() else FRONTEND_PORT
        body_length = int(self.headers.get('Content-Length', '0') or '0')
        request_body = self.rfile.read(body_length) if body_length > 0 else None

        connection = http.client.HTTPConnection('127.0.0.1', upstream_port, timeout=60)

        try:
            connection.request(
                self.command,
                self.path,
                body=request_body,
                headers=self.build_upstream_headers(),
            )
            response = connection.getresponse()
            response_body = response.read()

            self.send_response(response.status, response.reason)

            for key, value in response.getheaders():
                if key.lower() in RESPONSE_HEADER_EXCLUSIONS:
                    continue
                self.send_header(key, value)

            self.send_header('Content-Length', str(len(response_body)))
            self.end_headers()

            if self.command != 'HEAD' and response_body:
                self.wfile.write(response_body)
        except OSError:
            body = b'Upstream service is unavailable.'
            self.send_response(502, 'Bad Gateway')
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
        finally:
            connection.close()

    def log_message(self, format: str, *args) -> None:
        message = '%s - - [%s] %s' % (self.address_string(), self.log_date_time_string(), format % args)
        print(message, flush=True)


def main() -> None:
    server = ThreadingHTTPServer(('0.0.0.0', LISTEN_PORT), LiveProxyHandler)
    print(f'LedgerLift live proxy listening on 0.0.0.0:{LISTEN_PORT}', flush=True)
    server.serve_forever()


if __name__ == '__main__':
    main()