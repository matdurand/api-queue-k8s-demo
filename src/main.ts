// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv-flow').config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
