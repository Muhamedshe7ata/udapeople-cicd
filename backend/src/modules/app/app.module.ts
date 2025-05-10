import { Module, Controller, Get } from '@nestjs/common'; // Make sure Get is imported

@Controller('api') // <--- Set controller base path to '/api'
export class TempAppController {
  @Get('status') // <--- Set route path to '/status' relative to controller
  getTest(): string {
    console.log('[TempAppController] getTest() for /api/status called, returning "Service is ok"');
    return 'Service is ok'; // Smoke test looks for "ok"
  }
}

// ... AppModule remains the same ...
@Module({
  imports: [],
  controllers: [TempAppController],
  providers: [],
})
export class AppModule {
  constructor() {
    console.log('[AppModule] MINIMAL AppModule is being constructed.');
  }
}