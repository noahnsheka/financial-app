class LoopbackHttpsProxyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        forwarded_proto = str(request.META.get('HTTP_X_FORWARDED_PROTO', '')).split(',')[0].strip().lower()
        host = str(request.META.get('HTTP_HOST', '')).split(':')[0].strip().lower()

        if forwarded_proto == 'https' and host in {'127.0.0.1', 'localhost'}:
            request.META['wsgi.url_scheme'] = 'https'

        return self.get_response(request)