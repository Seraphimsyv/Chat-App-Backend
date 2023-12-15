import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix('/api/');
  app.useWebSocketAdapter(new IoAdapter());

  await app.listen(3030);
}

bootstrap();