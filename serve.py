#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Simple HTTP Server for Terminal App
Serves on all network interfaces so you can access from other devices
"""

import http.server
import socketserver
import socket
import os
import sys

# Fix Windows encoding issues
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuration
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add CORS headers to allow access from anywhere
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

def get_local_ip():
    """Get the local IP address of this machine"""
    try:
        # Create a socket to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except:
        return "127.0.0.1"

if __name__ == "__main__":
    os.chdir(DIRECTORY)

    # Get local IP
    local_ip = get_local_ip()

    # Create server that listens on all interfaces (0.0.0.0)
    with socketserver.TCPServer(("0.0.0.0", PORT), MyHTTPRequestHandler) as httpd:
        print("=" * 60)
        print("         TERMINAL APP SERVER RUNNING")
        print("=" * 60)
        print()
        print(f"Serving directory: {DIRECTORY}")
        print()
        print("Access from:")
        print(f"  * This computer:    http://localhost:{PORT}")
        print(f"  * Other devices:    http://{local_ip}:{PORT}")
        print()
        print("On your phone/tablet, connect to the same WiFi network")
        print(f"and open: http://{local_ip}:{PORT}")
        print()
        print(f"Make sure your firewall allows port {PORT}")
        print()
        print("Press Ctrl+C to stop the server")
        print("-" * 60)
        print()

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServer stopped")
            print("Goodbye!")
