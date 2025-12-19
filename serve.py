import http.server
import socketserver
import os

PORT = 8000
LAN_IP = "192.168.1.16"  # your LAN IP

# Hardcoded Tailwind 404 page (uses background.jpg from the folder)
ERROR_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>FunWeb Simulations</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
    body {
      font-family: 'Inter';
      background: url('background.jpg') center / cover no-repeat fixed;
      overscroll-behavior: none;
    }
    @supports not (backdrop-filter: blur(1px)) {
      .glass { background-color: rgba(200 20, 30, 0.85); }
    }
  </style>
</head>
<body class="min-h-screen text-white bg-black/70">
 

<script>
  const notif = document.getElementById('notification');
  const closeBtn = document.getElementById('closeNotif');

  // Slide in animation on page load
  window.addEventListener('load', () => {
    notif.classList.remove('-translate-x-40', 'opacity-0');
    notif.classList.add('translate-x-0', 'opacity-100');
  });

  // Manual close
  closeBtn.addEventListener('click', () => {
    notif.classList.add('-translate-x-40', 'opacity-0');
    setTimeout(() => notif.remove(), 500); // remove after transition
  });

  // Auto hide after 5 seconds
  setTimeout(() => {
    notif.classList.add('-translate-x-40', 'opacity-0');
    setTimeout(() => notif.remove(), 500);
  }, 5000);
</script>

  <div class="fixed inset-0 backdrop-blur-2xl z-0"></div>
  <main class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 space-y-6">
    <section class="glass bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-12 text-center shadow-xl max-w-xl">
      <h1 class="text-5xl font-extrabold mb-4">Error</h1>
      <p class="text-lg sm:text-xl text-white/80 mb-6">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <a href="/index.html" class="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition">
        Go Back Home
      </a>
    </section>
  </main>

 
</body>
</html>
"""



class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Map "/" to "index.html"
        if self.path == "/":
            self.path = "/index.html"

        # Check if the requested file exists in the folder
        requested_file = self.path.lstrip("/")
        if os.path.exists(requested_file):
            return super().do_GET()  # serve real file
        else:
            # Serve hardcoded 404 page
            self.send_response(404)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(ERROR_HTML.encode("utf-8"))

# Run the server
with socketserver.TCPServer((LAN_IP, PORT), Handler) as httpd:
    print(f"Serving on http://{LAN_IP}:{PORT}")
    httpd.serve_forever()
