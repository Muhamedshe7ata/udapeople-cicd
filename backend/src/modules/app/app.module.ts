// import {
//   Module,
//   NestModule,
//   MiddlewareConsumer,
//   RequestMethod,
// } from '@nestjs/common';
// import { AppService } from './app.service';
// import { StatusModule } from '../status/status.module';
// import { StatusController } from '../status/status.controller';
// import { AppLogger } from './app.logger';
// import { ConfigModule } from '../config/config.module';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigService } from '../config/config.service';
// import { OrdersModule } from '../domain/orders/orders.module';
// import { EmployeeModule } from '../domain/employees/employee.module';

// @Module({
//   imports: [
//     StatusModule,
//     ConfigModule,
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => config.TypeOrmDatabase,
//     }),
//     OrdersModule,
//     EmployeeModule,
//   ],
//   controllers: [StatusController],
//   providers: [AppService, AppLogger],
// })
// export class AppModule {}
// backend/src/modules/app/app.module.ts <--- MUST BE THIS CONTENT FOR NOW
import { Module, Controller, Get } from '@nestjs/common';

@Controller()
export class TempAppController {
  @Get() // Root path, so http://<ip>:3030/ should hit this
  getTest(): string {
    console.log('[TempAppController] getTest() called, returning "Service is ok"');
    return 'Service is ok'; // Smoke test looks for "ok"
  }
}

@Module({
  imports: [
    // THIS MUST BE EMPTY for this baseline test.
    // No ConfigModule, TypeOrmModule, AuthModule, etc.
  ],
  controllers: [TempAppController], // Only the simple controller
  providers: [],                  // No providers
})
export class AppModule {
  constructor() {
    console.log('[AppModule] MINIMAL AppModule is being constructed.');
  }
}

