from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl
import os

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/":
            self.path = "/index.html"
        return super().do_GET()

os.chdir('/home/soundsafari')  # Change working directory

httpd = HTTPServer(('0.0.0.0', 5500), Handler)
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    server_side=True,
    certfile='/home/soundsafari/certs/selfsigned.crt',
    keyfile='/home/soundsafari/certs/selfsigned.key',
    ssl_version=ssl.PROTOCOL_TLS
)

print("Serving on https://0.0.0.0:5500")
httpd.serve_forever()

