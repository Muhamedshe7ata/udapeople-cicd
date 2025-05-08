import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './modules/config/config.service'; // Assuming ConfigService is correctly providing PORT and CORS_WHITELIST
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app/app.module';
import { AppLogger } from './modules/app/app.logger'; // Custom logger
import { ExpressAdapter } from '@nestjs/platform-express';
import * as cors from 'cors';
import { TransformInterceptor } from './modules/common/interceptors/TransformInterceptor';
import * as express from 'express';
import { ErrorFilter } from './modules/errors/error.filter';

async function bootstrap() {
  // It's good practice to instantiate your logger first if it doesn't depend on Nest DI
  const appLogger = new AppLogger(); // Use a different variable name to avoid confusion with app
  appLogger.setContext('Bootstrap'); // Set context for logger messages

  appLogger.log('Phase 1: Starting bootstrap function.'); // <<<< ADDED
  appLogger.log(`NodeJs Version ${process.version}`);
  // Consider being selective about logging process.env in production for security
  // appLogger.log(`Raw process.env: ${JSON.stringify(process.env)}`); // Maybe log only specific needed env vars

  try { // Wrap the main Nest app creation and setup in a try...catch
    appLogger.log('Phase 2: Creating express server instance...'); // <<<< ADDED
    const server = express();
    appLogger.log('Phase 2.1: Express server instance created.'); // <<<< ADDED

    appLogger.log('Phase 3: Attempting to create Nest application instance...'); // <<<< ADDED
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      logger: appLogger, // Use your custom AppLogger instance
    });
    appLogger.log('Phase 4: Nest application instance successfully created.'); // <<<< ADDED

    appLogger.log('Phase 5: Applying global pipes...'); // <<<< ADDED
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    appLogger.log('Phase 5.1: Global pipes applied.'); // <<<< ADDED

    const apiVersionPrefix: string = process.env.API_VERSION || 'api';
    appLogger.log(`Phase 6: API version prefix set to: ${apiVersionPrefix}`); // <<<< ADDED
    app.setGlobalPrefix(apiVersionPrefix);

    appLogger.log('Phase 7: Applying global interceptors...'); // <<<< ADDED
    app.useGlobalInterceptors(new TransformInterceptor());
    appLogger.log('Phase 7.1: Global interceptors applied.'); // <<<< ADDED

    appLogger.log('Phase 8: Setting up Swagger...'); // <<<< ADDED
    const options = new DocumentBuilder()
      .setTitle('Glee2')
      .setDescription('Glee2 API')
      .setVersion('1.0')
      .addTag('customTag')
      // .setBasePath(apiVersionPrefix) // setBasePath is deprecated for OpenAPI 3. Remove or ensure compatibility.
                                     // NestJS's setGlobalPrefix handles the base path for routes.
                                     // For Swagger UI path, it's handled by SwaggerModule.setup path.
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup(`${apiVersionPrefix}/docs`, app, document); // Changed path to avoid conflict if apiVersionPrefix is 'api'
    appLogger.log(`Phase 8.1: Swagger setup complete at /${apiVersionPrefix}/docs`); // <<<< ADDED

    appLogger.log('Phase 9: Getting ConfigService...'); // <<<< ADDED
    const config: ConfigService = app.get(ConfigService); // Ensure ConfigService is exported and available
    // Log specific config values to verify they are loaded, e.g., PORT. Be careful with sensitive data.
    appLogger.log(`Phase 9.1: ConfigService retrieved. PORT from ConfigService: ${config.PORT}`);
    appLogger.log(`Phase 9.2: CORS Whitelist from ConfigService: ${JSON.stringify(config.CORS_WHITELIST)}`);

    appLogger.log('Phase 10: Setting up CORS...'); // <<<< ADDED
    const whitelist = config.CORS_WHITELIST;
    const corsOptions = {
      origin(origin, callback) {
        appLogger.debug(`CORS check: Origin: ${origin}`); // Log CORS origin checks
        const isOriginAllowed = whitelist.indexOf(origin) !== -1;
        const allowAccessAnyway = whitelist.length === 0; // Be cautious with this logic if it means allow all
        if (isOriginAllowed || allowAccessAnyway || !origin) { // Added !origin for cases like server-to-server or same-origin
          appLogger.debug(`CORS check: Allowed (isOriginAllowed: ${isOriginAllowed}, allowAccessAnyway: ${allowAccessAnyway}, !origin: ${!origin})`);
          callback(null, true);
        } else {
          appLogger.warn(`CORS check: Not allowed for origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      },
    };
    app.use(cors(corsOptions));
    appLogger.log('Phase 10.1: CORS setup complete.'); // <<<< ADDED

    appLogger.log('Phase 11: Applying global filters (ErrorFilter)...'); // <<<< ADDED
    app.useGlobalFilters(new ErrorFilter()); // Ensure ErrorFilter is correctly implemented
    appLogger.log('Phase 11.1: Global filters applied.'); // <<<< ADDED

    const portToListenOn = parseInt(config.PORT || process.env.PORT || '3030', 10); // Prioritize ConfigService's PORT
    appLogger.log(`Phase 12: Attempting to listen on port ${portToListenOn}`); // <<<< ADDED
    await app.listen(portToListenOn, '0.0.0.0'); // Listen on all interfaces for EC2
    appLogger.log(`Phase 13: Application successfully started and is listening on port ${portToListenOn}. Full URL: ${await app.getUrl()}`); // <<<< ADDED

  } catch (error) {
    // Use appLogger if instantiated, otherwise console.error
    const loggerToUse = typeof appLogger !== 'undefined' ? appLogger : console;
    loggerToUse.error('[Bootstrap] CRITICAL ERROR DURING BOOTSTRAP:', error);
    if (error instanceof Error && error.stack) {
      loggerToUse.error("Stack Trace:", error.stack);
    }
    process.exit(1);
  }
}

bootstrap().catch(err => {
  // Use console.error here as appLogger might not be available if bootstrap itself fails early
  console.error('[Bootstrap] FATAL UNHANDLED PROMISE REJECTION FROM BOOTSTRAP FUNCTION:', err);
  if (err instanceof Error && err.stack) {
    console.error("Stack Trace:", err.stack);
  }
  process.exit(1);
});