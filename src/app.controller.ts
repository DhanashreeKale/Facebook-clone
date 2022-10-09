import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { logger } from './config/app-logger.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    logger.info('This is sample info log.', { json: true });
    logger.error('This is sample error log.');
    return this.appService.getHello();
  }
}
