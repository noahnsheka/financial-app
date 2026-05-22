import http.client
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


LISTEN_PORT = int(os.environ.get('PORT', '10000'))
BACKEND_PORT = 8001
FRONTEND_PORT = 8088
BACKEND_PREFIXES = ('/api', '/admin')


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

    def build_upstream_headers(self) -> dict:
        forwarded_for = self.client_address[0]
        existing_forwarded_for = self.headers.get('X-Forwarded-For', '').strip()
        if existing_forwarded_for:
            forwarded_for = f'{existing_forwarded_for}, {forwarded_for}'

        headers = {}
        for key, value in self.headers.items():
            if key.lower() in {'connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade'}:
                continue
            headers[key] = value

        headers['Host'] = self.headers.get('Host', '')
        headers['X-Forwarded-For'] = forwarded_for
        headers['X-Forwarded-Host'] = self.headers.get('Host', '')
        headers['X-Forwarded-Proto'] = self.headers.get('X-Forwarded-Proto', 'https')
        return headers

    def forward_request(self) -> None:
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
                if key.lower() in {'connection', 'keep-alive', 'proxy-connection', 'transfer-encoding', 'upgrade'}:
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