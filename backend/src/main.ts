// // src/main.ts (TEMPORARY - for extreme debugging - CORRECTED)
// import * as http from 'http';

// const port = parseInt(process.env.PORT || "3030", 10); // Ensure port is a number
// const host = '0.0.0.0';

// console.log(`[MINIMAL-APP] Node.js version: ${process.version}`);
// console.log(`[MINIMAL-APP] Attempting to start simple HTTP server on ${host}:${port}`);
// console.log(`[MINIMAL-APP] Raw PORT env var: ${process.env.PORT}`);

// const server = http.createServer((req, res) => {
//   console.log(`[MINIMAL-APP] Received request: ${req.method} ${req.url}`);
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end('Minimal App OK\n');
// });

// // Corrected server.listen call:
// server.listen(port, host, () => {
//   console.log(`[MINIMAL-APP] Server is listening on ${host}:${port}`);
//   console.log(`[MINIMAL-APP] PM2 should keep this process alive.`);
// });

// server.on('error', (e) => {
//   console.error(`[MINIMAL-APP] Server error: ${e.message}`);
//   process.exit(1); // Exit with error if server fails to start
// });

// console.log('[MINIMAL-APP] End of main.ts script. Server should be listening.');
process.on('unhandledRejection', (reason, promise) => {
  console.error('[GLOBAL] Unhandled Rejection at:', promise, 'reason:', reason);
  // Log more details about the reason if it's an error object
  if (reason instanceof Error) {
    console.error('[GLOBAL] Unhandled Rejection reason stack:', reason.stack);
  }
  process.exit(1); // Force exit with error
});

process.on('uncaughtException', (error) => {
  console.error('[GLOBAL] Uncaught Exception:', error);
  console.error('[GLOBAL] Uncaught Exception stack:', error.stack);
  process.exit(1); // Force exit with error
});

// THEN your import 'reflect-metadata';
// THEN the rest of your main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module'; // Adjust path if needed

async function bootstrap() {
  console.log('[NEST-MAIN] Entered bootstrap function.');
  console.info(`[NEST-MAIN] NodeJs Version ${process.version}`);
  // console.info(`[NEST-MAIN] All Process ENV: ${JSON.stringify(process.env)}`); // Optional for now

  let app;
  try {
    console.log('[NEST-MAIN] Attempting NestFactory.create(AppModule)...');
    app = await NestFactory.create(AppModule, {
      // logger: false, // Optionally disable Nest's default logger for cleaner output initially
    });
    console.log('[NEST-MAIN] NestFactory.create(AppModule) SUCCEEDED.');
  } catch (error) {
    console.error('[NEST-MAIN] NestFactory.create(AppModule) FAILED:', error);
    console.error('[NEST-MAIN] Error stack:', error.stack);
    throw error; // Re-throw to be caught by outer .catch()
  }

  const port = parseInt(process.env.PORT || "3000", 10);
  const host = '0.0.0.0';

  console.log(`[NEST-MAIN] Attempting app.listen on port: ${port}, host: ${host}`);
  try {
    await app.listen(port, host);
    console.log(`[NEST-MAIN] app.listen SUCCEEDED. Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error(`[NEST-MAIN] app.listen on port ${port} FAILED:`, error);
    console.error('[NEST-MAIN] Error stack:', error.stack);
    throw error;
  }
}

console.log('[NEST-MAIN] Calling bootstrap()...');
bootstrap()
  .then(() => {
    console.log('[NEST-MAIN] bootstrap() promise resolved successfully.');
  })
  .catch(error => {
    console.error('[NEST-MAIN] FATAL ERROR IN bootstrap() promise:', error);
    console.error('[NEST-MAIN] Error stack:', error.stack);
    process.exit(1); // Crucial for PM2 to see it as an error
  });

console.log('[NEST-MAIN] Script execution theoretically finished (after bootstrap call).');