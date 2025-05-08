import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './modules/config/config.service';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { AppLogger } from './modules/app/app.logger';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';
import { TransformInterceptor } from './modules/common/interceptors/TransformInterceptor';
import * as express from 'express';
import { ErrorFilter } from './modules/errors/error.filter';

async function bootstrap() {
  const logger = new AppLogger();
  logger.info(`NodeJs Version ${process.version}`);
  logger.info(JSON.stringify(process.env));
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const apiVersionPrefix: string = process.env.API_VERSION || 'api';
  app.setGlobalPrefix(apiVersionPrefix);
  app.useGlobalInterceptors(new TransformInterceptor());
  const options = new DocumentBuilder()
    .setTitle('Glee2')
    .setDescription('Glee2 API')
    .setVersion('1.0')
    .addTag('customTag')
    .setBasePath(apiVersionPrefix)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`api/${apiVersionPrefix}`, app, document);
  const config: ConfigService = app.get('ConfigService');
  const whitelist = config.CORS_WHITELIST;
  const corsOptions = {
    origin(origin, callback) {
      const isOriginAllowed = whitelist.indexOf(origin) !== -1;
      const allowAccessAnyway = whitelist.length === 0;
      if (isOriginAllowed || allowAccessAnyway) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  };
  app.use(cors(corsOptions));
  app.useGlobalFilters(new ErrorFilter());
  await app.listen(config.PORT);
  logger.log(`Listening on port ${config.PORT}.`);
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
//   const appLogger = new AppLogger();
//   // appLogger.setContext('Bootstrap'); // Removed due to TS error TS2339 - Add setContext method to AppLogger if needed

//   appLogger.log('Phase 1: Starting bootstrap function.');
//   appLogger.log(`NodeJs Version ${process.version}`);

//   try {
//     appLogger.log('Phase 2: Creating express server instance...');
//     const server = express();
//     appLogger.log('Phase 2.1: Express server instance created.');

//     appLogger.log('Phase 3: Attempting to create Nest application instance...');
//     const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
//       logger: appLogger,
//     });
//     appLogger.log('Phase 4: Nest application instance successfully created.');

//     appLogger.log('Phase 5: Applying global pipes...');
//     app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
//     appLogger.log('Phase 5.1: Global pipes applied.');

//     const apiVersionPrefix: string = process.env.API_VERSION || 'api';
//     appLogger.log(`Phase 6: API version prefix set to: ${apiVersionPrefix}`);
//     app.setGlobalPrefix(apiVersionPrefix);

//     appLogger.log('Phase 7: Applying global interceptors...');
//     app.useGlobalInterceptors(new TransformInterceptor());
//     appLogger.log('Phase 7.1: Global interceptors applied.');

//     appLogger.log('Phase 8: Setting up Swagger...');
//     const options = new DocumentBuilder()
//       .setTitle('Glee2')
//       .setDescription('Glee2 API')
//       .setVersion('1.0')
//       .addTag('customTag')
//       .addBearerAuth()
//       .build();
//     const document = SwaggerModule.createDocument(app, options);
//     SwaggerModule.setup(`${apiVersionPrefix}/docs`, app, document);
//     appLogger.log(`Phase 8.1: Swagger setup complete at /${apiVersionPrefix}/docs`);

//     appLogger.log('Phase 9: Getting ConfigService...');
//     const config: ConfigService = app.get(ConfigService);
//     appLogger.log(`Phase 9.1: ConfigService retrieved. PORT from ConfigService: ${config.PORT}`);
//     appLogger.log(`Phase 9.2: CORS Whitelist from ConfigService: ${JSON.stringify(config.CORS_WHITELIST)}`);

//     appLogger.log('Phase 10: Setting up CORS...');
//     const whitelist = config.CORS_WHITELIST;
//     const corsOptions = {
//       origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
//         appLogger.debug(`CORS check: Origin: ${origin}`);
//         const isOriginAllowed = whitelist.indexOf(origin!) !== -1; // Added non-null assertion for origin in indexOf
//         const allowAccessAnyway = whitelist.length === 0;
//         if (isOriginAllowed || allowAccessAnyway || !origin) {
//           appLogger.debug(`CORS check: Allowed (isOriginAllowed: ${isOriginAllowed}, allowAccessAnyway: ${allowAccessAnyway}, !origin: ${!origin})`);
//           callback(null, true);
//         } else {
//           appLogger.warn(`CORS check: Not allowed for origin: ${origin}`);
//           callback(new Error('Not allowed by CORS'));
//         }
//       },
//     };
//     app.use(cors(corsOptions));
//     appLogger.log('Phase 10.1: CORS setup complete.');

//     appLogger.log('Phase 11: Applying global filters (ErrorFilter)...');
//     app.useGlobalFilters(new ErrorFilter());
//     appLogger.log('Phase 11.1: Global filters applied.');

//     let portString: string;
//     if (config.PORT !== undefined) {
//         portString = String(config.PORT);
//     } else if (process.env.PORT !== undefined) {
//         portString = process.env.PORT;
//     } else {
//         portString = '3030';
//     }
//     const portToListenOn = parseInt(portString, 10);

//     appLogger.log(`Phase 12: Attempting to listen on port ${portToListenOn}`);
//     await app.listen(portToListenOn, '0.0.0.0');
//     appLogger.log(`Phase 13: Application successfully started and is listening on port ${portToListenOn}. Full URL: ${await app.getUrl()}`);

//   } catch (error) {
//     const loggerToUse = typeof appLogger !== 'undefined' ? appLogger : console;
//     loggerToUse.error('[Bootstrap] CRITICAL ERROR DURING BOOTSTRAP:', error);
//     if (error instanceof Error && error.stack) {
//       loggerToUse.error("Stack Trace:", error.stack);
//     }
//     process.exit(1);
//   }
// }

// bootstrap().catch(err => {
//   console.error('[Bootstrap] FATAL UNHANDLED PROMISE REJECTION FROM BOOTSTRAP FUNCTION:', err);
//   if (err instanceof Error && err.stack) {
//     console.error("Stack Trace:", err.stack);
//   }
//   process.exit(1);
// });