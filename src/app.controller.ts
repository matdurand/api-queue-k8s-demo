import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from './payload-validation.pipe';
import { AppService } from './app.service';
import { ApiPayloadSchema } from './app.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  ping(): string {
    return 'alive';
  }

  @Post('/publish')
  @UsePipes(new JoiValidationPipe(ApiPayloadSchema))
  async process(@Body() payload: unknown): Promise<void> {
    await this.appService.processMessage(payload);
  }
}
