  // src/main.ts
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  // Add any other necessary imports (e.g., ValidationPipe)

  // --- ADD GLOBAL HANDLERS ---
  // Put these near the top after imports
  process.on('unhandledRejection', (reason, promise) => {
    // Use console.error to ensure it goes to stderr, which PM2 logs capture better
    console.error('!!!! GLOBAL unhandledRejection !!!!'); 
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    // Consider logging the full 'reason' object if it's complex: console.error(reason);
    // Optionally add process.exit(1); here if you want to ensure it exits on unhandled rejections
    // process.exit(1); 
  });

  process.on('uncaughtException', (err, origin) => {
    console.error('!!!! GLOBAL uncaughtException !!!!');
    console.error('Error:', err);
    console.error('Origin:', origin);
    // process.exit(1); // Node recommends exiting on uncaught exceptions
  });
  // --- END GLOBAL HANDLERS ---

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configure your app (CORS, Pipes, etc.)
    // Example: app.enableCors();
    // Example: app.useGlobalPipes(new ValidationPipe()); 

    const port = process.env.PORT || 3000; // Use PORT env var
    const host = '0.0.0.0'; // Explicitly listen on all interfaces!

    console.log(`Attempting to listen on ${host}:${port}...`); // Add log before listen
    await app.listen(port, host);
    // This line will only be reached if app.listen succeeds
    console.log(`Nest application is running and listening on: ${host}:${port}`); 
  }

  bootstrap().catch(err => {
    // Catch synchronous errors specifically from the bootstrap function itself
    console.error('!!!! Error during bootstrap() execution !!!!');
    console.error(err);
    process.exit(1);
  });


// import { NestFactory } from '@nestjs/core';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from './modules/config/config.service';
// import { ValidationPipe } from '@nestjs/common';
// import { AppModule } from './modules/app/app.module';
// import { AppLogger } from './modules/app/app.logger';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import * as cors from 'cors';
// import { TransformInterceptor } from './modules/common/interceptors/TransformInterceptor';
// import * as express from 'express';
// import { ErrorFilter } from './modules/errors/error.filter';

// async function bootstrap() {
//   const logger = new AppLogger();
//   logger.info(`NodeJs Version ${process.version}`);
//   logger.info(JSON.stringify(process.env));
//   const server = express();
//   const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
//     logger,
//   });
//   app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
//   const apiVersionPrefix: string = process.env.API_VERSION || 'api';
//   app.setGlobalPrefix(apiVersionPrefix);
//   app.useGlobalInterceptors(new TransformInterceptor());
//   const options = new DocumentBuilder()
//     .setTitle('Glee2')
//     .setDescription('Glee2 API')
//     .setVersion('1.0')
//     .addTag('customTag')
//     .setBasePath(apiVersionPrefix)
//     .addBearerAuth()
//     .build();
//   const document = SwaggerModule.createDocument(app, options);
//   SwaggerModule.setup(`api/${apiVersionPrefix}`, app, document);
//   const config: ConfigService = app.get('ConfigService');
//   const whitelist = config.CORS_WHITELIST;
//   const corsOptions = {
//     origin(origin, callback) {
//       const isOriginAllowed = whitelist.indexOf(origin) !== -1;
//       const allowAccessAnyway = whitelist.length === 0;
//       if (isOriginAllowed || allowAccessAnyway) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//   };
//   app.use(cors(corsOptions));
//   app.useGlobalFilters(new ErrorFilter());
//   await app.listen(config.PORT);
//   logger.log(`Listening on port ${config.PORT}.`);
// }

// bootstrap();




// bootstrap().catch(err => {
//     // Catch errors specifically from the bootstrap function itself
//     console.error('!!!! Error during bootstrap phase:', err);
//     process.exit(1);
// });