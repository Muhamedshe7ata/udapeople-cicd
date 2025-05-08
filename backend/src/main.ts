// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ********** COMMON THINGS TO CHECK/ADD **********

  // 1. GET THE PORT: Ensure you're using the correct port (e.g., from environment variables, defaulting to 3030)
  const port = process.env.PORT || 3030;

  // 2. LISTEN ON ALL INTERFACES:
  // Make sure it's listening on '0.0.0.0' so it can be accessed externally,
  // not just 'localhost' or '127.0.0.1'.
  // The logs suggest it is starting but not getting here.
  
  // 3. ADD LOGGING: Add logs before and after app.listen()
  console.log(`[Bootstrap] Attempting to listen on port ${port} on host 0.0.0.0`);
  
  try {
    await app.listen(port, '0.0.0.0'); // Use '0.0.0.0' to allow external connections
    console.log(`[Bootstrap] Application successfully started and is listening on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('[Bootstrap] CRITICAL ERROR: Failed to start application:', error);
    process.exit(1); // Exit with a non-zero code if listen fails
  }

  // ****************************************************
}
bootstrap();
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




