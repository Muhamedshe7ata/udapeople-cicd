// src/main.ts (TEMPORARY - for extreme debugging - CORRECTED)
import * as http from 'http';

const port = parseInt(process.env.PORT || "3030", 10); // Ensure port is a number
const host = '0.0.0.0';

console.log(`[MINIMAL-APP] Node.js version: ${process.version}`);
console.log(`[MINIMAL-APP] Attempting to start simple HTTP server on ${host}:${port}`);
console.log(`[MINIMAL-APP] Raw PORT env var: ${process.env.PORT}`);

const server = http.createServer((req, res) => {
  console.log(`[MINIMAL-APP] Received request: ${req.method} ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Minimal App OK\n');
});

// Corrected server.listen call:
server.listen(port, host, () => {
  console.log(`[MINIMAL-APP] Server is listening on ${host}:${port}`);
  console.log(`[MINIMAL-APP] PM2 should keep this process alive.`);
});

server.on('error', (e) => {
  console.error(`[MINIMAL-APP] Server error: ${e.message}`);
  process.exit(1); // Exit with error if server fails to start
});

console.log('[MINIMAL-APP] End of main.ts script. Server should be listening.');