class LoopbackHttpsProxyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        remote_addr = (request.META.get('REMOTE_ADDR') or '').split(',')[0].strip().lower()
        forwarded_host = request.META.get('HTTP_X_FORWARDED_HOST') or ''
        host = request.META.get('HTTP_HOST') or ''
        server_name = request.META.get('SERVER_NAME') or ''
        candidate_host = (forwarded_host or host or server_name).split(':')[0].strip().lower()

        if remote_addr in {'127.0.0.1', '::1'} and candidate_host in {'127.0.0.1', 'localhost', '::1'}:
            request.META.setdefault('HTTP_X_FORWARDED_PROTO', 'https')

        return self.get_response(request)